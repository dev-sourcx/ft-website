import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Plus, Trash2, ChevronLeft, ChevronRight, 
  Video, MessageSquare, Timer, X, CheckCircle, Zap
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Loader } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, formatTime, formatCurrency, getApiErrorMessage } from '../../utils/helpers';

// ─── Bottom Sheet / Modal ────────────────────────────────
const CreateSlotsSheet = ({ isOpen, onClose, user, onCreated }) => {
  const [sessionType, setSessionType] = useState('video');
  const [recurring, setRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<any[]>([]);
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(user?.pricePerSession?.toString() || '250');
  const [freeTrial, setFreeTrial] = useState(false);
  const [creating, setCreating] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const durationOptions = [15, 30, 45, 60, 90, 120];

  // Time grid: 08:00 → 20:00
  const timeSlots = useMemo(() => {
    const times = [];
    for (let h = 8; h <= 20; h++) {
      times.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return times;
  }, []);

  // Check if a time is in the past for today
  const isTimePast = (time) => {
    if (startDate !== today) return false;
    const now = new Date();
    const [h] = time.split(':').map(Number);
    return h <= now.getHours();
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (time) => {
    if (isTimePast(time)) return;
    setSelectedTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time].sort()
    );
  };

  const calcEndTime = (startTime) => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    const endH = Math.floor(totalMin / 60);
    const endM = totalMin % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  // Build all target dates
  const getAllDates = () => {
    if (!startDate || !endDate) return [];
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    const dayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };

    while (current <= end) {
      if (!recurring || selectedDays.length === 0) {
        dates.push(current.toISOString().split('T')[0]);
      } else {
        const jsDay = current.getDay();
        if (selectedDays.some(d => dayMap[d] === jsDay)) {
          dates.push(current.toISOString().split('T')[0]);
        }
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const totalSlots = useMemo(() => {
    return getAllDates().length * selectedTimes.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, recurring, selectedDays, selectedTimes]);

  const effectivePrice = freeTrial ? 0 : parseFloat(price) || 0;

  const isValid = startDate && endDate && selectedTimes.length > 0 && duration > 0 && (freeTrial || effectivePrice > 0);

  const handleCreate = async () => {
    if (!isValid) return;
    setCreating(true);

    // Fetch existing slots to check for overlaps
    let existingSlots: any[] = [];
    try {
      const res = await api.get(`/slots/teacher/${user.id}`);
      existingSlots = res.data || [];
    } catch {}

    const allDates = getAllDates();
    const requests: any[] = [];
    const skipped: string[] = [];

    allDates.forEach(date => {
      selectedTimes.forEach(time => {
        const endTime = calcEndTime(time);
        // Check overlap with existing slots
        const overlap = existingSlots.find(s => 
          s.date === date && s.startTime === time
        );
        if (overlap) {
          skipped.push(`${date} at ${time}`);
        } else {
          requests.push({
            teacherId: user.id,
            date,
            startTime: time,
            endTime,
            sessionType,
            duration,
            price: effectivePrice,
          });
        }
      });
    });

    if (skipped.length > 0 && requests.length === 0) {
      toast.error(`All slots overlap with existing ones. ${skipped.length} slot(s) already exist at those times.`);
      setCreating(false);
      return;
    }
    if (skipped.length > 0) {
      toast.error(`Skipped ${skipped.length} overlapping slot(s): ${skipped.slice(0, 3).join(', ')}${skipped.length > 3 ? '...' : ''}`);
    }

    let success = 0;
    let fail = 0;
    const batchSize = 5;
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const results = await Promise.allSettled(batch.map(r => api.post('/slots', r)));
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          success++;
        } else {
          fail++;
          const errMsg = (r as any).reason?.response?.data?.detail;
          if (errMsg && typeof errMsg === 'string' && errMsg.toLowerCase().includes('overlap')) {
            // Server-side overlap detection
          }
        }
      });
    }

    if (success > 0) toast.success(`${success} slot${success > 1 ? 's' : ''} created`);
    if (fail > 0) toast.error(`${fail} slot${fail > 1 ? 's' : ''} failed — may overlap with existing slots`);

    setCreating(false);
    onCreated();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto animate-slideUp z-10">
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold font-heading text-slate-900">Create Slots</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            data-testid="close-sheet-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* 1 ─ Session Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2.5">Session Type</label>
            <div className="grid grid-cols-2 gap-2" data-testid="session-type-toggle">
              {[
                { id: 'video', label: 'Video', icon: Video },
                { id: 'chat', label: 'Chat', icon: MessageSquare },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSessionType(id)}
                  data-testid={`session-type-${id}`}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    sessionType === id
                      ? 'bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 2 ─ Weekly Recurring Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-semibold text-slate-700">Weekly Recurring</label>
              <button
                onClick={() => { setRecurring(!recurring); setSelectedDays([]); }}
                data-testid="recurring-toggle"
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  recurring ? 'bg-[#7B0080]' : 'bg-slate-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  recurring ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
            {recurring && (
              <div className="flex gap-1.5 animate-slideDown" data-testid="weekday-selector">
                {weekdays.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    data-testid={`day-${day}`}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      selectedDays.includes(day)
                        ? 'bg-gradient-to-b from-[#7B0080] to-[#A020A0] text-white shadow-sm shadow-[#7B0080]/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3 ─ Date Range */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2.5">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (!endDate || e.target.value > endDate) setEndDate(e.target.value);
                  }}
                  min={today}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none transition-all"
                  data-testid="start-date-input"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || today}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none transition-all"
                  data-testid="end-date-input"
                />
              </div>
            </div>
          </div>

          {/* 4 ─ Time Slot Grid */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2.5">
              Time Slots
              {selectedTimes.length > 0 && (
                <span className="ml-2 text-xs font-normal text-[#7B0080]">
                  ({selectedTimes.length} selected)
                </span>
              )}
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2" data-testid="time-grid">
              {timeSlots.map(time => {
                const selected = selectedTimes.includes(time);
                const past = isTimePast(time);
                return (
                  <button
                    key={time}
                    onClick={() => toggleTime(time)}
                    disabled={past}
                    data-testid={`time-${time}`}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      past
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                        : selected
                          ? 'bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20 scale-[1.03]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5 ─ Duration Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2.5">Duration (minutes)</label>
            <div className="grid grid-cols-6 gap-2" data-testid="duration-selector">
              {durationOptions.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  data-testid={`duration-${d}`}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    duration === d
                      ? 'bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 6 ─ Price Input + 7 ─ Free Trial Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-semibold text-slate-700">Price per Session (ZAR)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Free Trial</span>
                <button
                  onClick={() => setFreeTrial(!freeTrial)}
                  data-testid="free-trial-toggle"
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    freeTrial ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    freeTrial ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">R</span>
              <input
                type="number"
                value={freeTrial ? '0' : price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={freeTrial}
                min="0"
                placeholder="250"
                className={`w-full border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none transition-all ${
                  freeTrial ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''
                }`}
                data-testid="price-input"
              />
            </div>
            {freeTrial && (
              <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 animate-slideDown">
                <Zap className="w-3 h-3" /> This session will be free for students
              </p>
            )}
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4">
          {/* Summary */}
          {totalSlots > 0 && (
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
              <span><strong className="text-slate-700">{totalSlots}</strong> slot{totalSlots !== 1 ? 's' : ''}</span>
              <span>&bull;</span>
              <span><strong className="text-slate-700">{duration}</strong> min each</span>
              <span>&bull;</span>
              <span className="text-[#7B0080] font-semibold">
                {freeTrial ? 'Free' : formatCurrency(effectivePrice)}
              </span>
            </div>
          )}
          <Button
            onClick={handleCreate}
            loading={creating}
            disabled={!isValid}
            className="w-full"
            data-testid="create-slots-btn"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Create Slots
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────
const ManageSlots = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSheet, setShowSheet] = useState(false);
  const [deletingId, setDeletingId] = useState<any>(null);

  const today = new Date().toISOString().split('T')[0];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchSlots(); }, [user?.id]);

  const fetchSlots = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/slots/teacher/${user.id}`);
      setSlots(res.data);
    } catch (e: any) { if (process.env.NODE_ENV === 'development') console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (slotId) => {
    setDeletingId(slotId);
    try {
      await api.delete(`/slots/${slotId}`);
      toast.success('Slot deleted');
      setSlots(prev => prev.filter(s => s.id !== slotId));
    } catch (e: any) { toast.error('Failed to delete slot'); }
    finally { setDeletingId(null); }
  };

  // Week helpers
  const getWeekDates = () => {
    const dates = [];
    const start = new Date(selectedDate);
    const dow = start.getDay();
    const first = new Date(start);
    first.setDate(start.getDate() - dow);
    for (let i = 0; i < 7; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };
  const navigateWeek = (dir) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir * 7);
    setSelectedDate(d.toISOString().split('T')[0]);
  };
  const weekDates = getWeekDates();
  const getSlotsForDate = (date) => slots.filter(s => s.date === date);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12"><Loader size="lg" /></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="manage-slots-page">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slideUp">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Manage Availability</h1>
            <p className="text-slate-500 mt-1.5">Create and manage your tutoring time slots</p>
          </div>
          <Button onClick={() => setShowSheet(true)} data-testid="add-slots-btn">
            <Plus className="w-4 h-4 mr-2" />
            Create Slots
          </Button>
        </div>

        {/* Week Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <button onClick={() => navigateWeek(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-all" data-testid="prev-week">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <p className="font-semibold text-slate-900 font-heading">
                {formatDate(weekDates[0])} — {formatDate(weekDates[6])}
              </p>
              <button onClick={() => navigateWeek(1)} className="p-2 hover:bg-slate-100 rounded-lg transition-all" data-testid="next-week">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {weekDates.map(date => {
            const daySlots = getSlotsForDate(date);
            const isToday = date === today;
            const isPast = date < today;
            const d = new Date(date);
            return (
              <div key={date} className="min-h-[200px]">
                <div className={`text-center p-2.5 rounded-t-xl transition-colors ${
                  isToday
                    ? 'bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                    : isPast ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-700'
                }`}>
                  <p className="text-xs font-medium">{d.toLocaleDateString('en-ZA', { weekday: 'short' })}</p>
                  <p className="text-lg font-bold font-heading">{d.getDate()}</p>
                </div>
                <div className={`border border-t-0 border-slate-200/60 rounded-b-xl p-2 min-h-[150px] ${isPast ? 'bg-slate-50/50' : 'bg-white'}`}>
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No slots</p>
                  ) : (
                    <div className="space-y-1.5">
                      {daySlots.map(slot => (
                        <div
                          key={slot.id}
                          data-testid={`slot-card-${slot.id}`}
                          className={`p-2 rounded-lg text-xs group transition-all duration-200 ${
                            slot.status === 'booked'
                              ? 'bg-[#7B0080]/10 text-[#7B0080]'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{formatTime(slot.startTime).replace(' ', '')}</span>
                            {slot.status === 'available' && !isPast && (
                              <button
                                onClick={() => handleDelete(slot.id)}
                                disabled={deletingId === slot.id}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-0.5"
                                data-testid={`delete-slot-${slot.id}`}
                              >
                                {deletingId === slot.id
                                  ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                  : <Trash2 className="w-3 h-3" />
                                }
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] opacity-75 mt-0.5">
                            {slot.duration || 60}min &bull; {slot.status === 'booked' ? 'Booked' : formatCurrency(slot.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#7B0080]/10 border border-[#7B0080]/20" />
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Create Slots Bottom Sheet */}
      <CreateSlotsSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        user={user}
        onCreated={fetchSlots}
      />
    </PageWrapper>
  );
};

export default ManageSlots;
