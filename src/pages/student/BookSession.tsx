import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Video, MessageSquare, CreditCard, Zap,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Avatar, Loader } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatCurrency, getApiErrorMessage } from '../../utils/helpers';

const BookSession = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  // Filters
  const [freeTrial, setFreeTrial] = useState(false);
  const [sessionType, setSessionType] = useState('all');

  // Calendar
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Slots data
  const [monthSlots, setMonthSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  // ── Fetch teacher ───────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/teachers/${teacherId}`);
        setTeacher(res.data);
      } catch { toast.error('Failed to load teacher'); }
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId]);

  // ── Fetch slots for current month ──────────────────────
  const monthStr = useMemo(
    () => `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}`,
    [currentMonth]
  );

  const fetchMonthSlots = useCallback(async () => {
    if (!teacherId) return;
    setSlotsLoading(true);
    try {
      const res = await api.get(`/slots/available/${teacherId}?month=${monthStr}`);
      setMonthSlots(res.data || []);
    } catch { setMonthSlots([]); }
    finally { setSlotsLoading(false); }
  }, [teacherId, monthStr]);

  useEffect(() => { fetchMonthSlots(); }, [fetchMonthSlots]);

  // Reset selection on month/filter change
  useEffect(() => { setSelectedDate(null); setSelectedSlot(null); }, [currentMonth, freeTrial, sessionType]);

  // ── Derived: filtered slots ─────────────────────────────
  const filteredSlots = useMemo(() => {
    let s = monthSlots;
    if (freeTrial) s = s.filter(sl => sl.price === 0 || sl.price === 0.0);
    if (sessionType !== 'all') s = s.filter(sl => sl.sessionType === sessionType);
    return s;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthSlots, freeTrial, sessionType]);

  // Dates that have available slots (for green dots)
  const availableDates = useMemo(() => {
    const set = new Set();
    filteredSlots.forEach(s => set.add(s.date));
    return set;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSlots]);

  // Slots for selected date
  const dateSlotsFiltered = useMemo(() => {
    if (!selectedDate) return [];
    return filteredSlots.filter(s => s.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [filteredSlots, selectedDate]);

  // ── Calendar helpers ────────────────────────────────────
  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.year, currentMonth.month, 1).getDay(); // 0=Sun
  const monthName = new Date(currentMonth.year, currentMonth.month).toLocaleString('en-ZA', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const m = prev.month - 1;
      return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
    });
  };
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const m = prev.month + 1;
      return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
    });
  };

  const isPastDate = (day) => {
    const d = new Date(currentMonth.year, currentMonth.month, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const dateStr = (day) =>
    `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // ── Book slot ───────────────────────────────────────────
  const handleBook = async () => {
    if (!selectedSlot || !selectedDate) return;

    setBooking(true);
    try {
      const slotPrice = selectedSlot.price || 0;

      // Create booking first (always)
      const bookingRes = await api.post('/bookings', {
        slotId: selectedSlot.id,
        studentId: user.id,
        teacherId,
        sessionType: selectedSlot.sessionType || 'video',
        date: selectedDate,
        startTime: selectedSlot.startTime,
        duration: selectedSlot.duration || 60,
        price: slotPrice,
      });

      // If free, just redirect to bookings
      if (slotPrice === 0) {
        toast.success('Session booked successfully!');
        navigate('/student/bookings');
        return;
      }

      // Paid → PayFast redirect (handled by external backend)
      const params = new URLSearchParams({
        student_id: user.id,
        amount: String(slotPrice),
        email: user.email,
        name_first: user.firstName,
        name_last: user.lastName || '',
      });
      const payRes = await api.post(`/payment/initiate?${params.toString()}`);

      if (payRes.data.payfastUrl && payRes.data.payfastData) {
        const formData = payRes.data.payfastData;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payRes.data.payfastUrl;
        Object.entries(formData).forEach(([k, v]) => {
          const inp = document.createElement('input');
          inp.type = 'hidden'; inp.name = k; inp.value = String(v);
          form.appendChild(inp);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Booking failed'));
    } finally {
      setBooking(false);
    }
  };

  // ── Loading state ───────────────────────────────────────
  if (loading) {
    return (
      <PageWrapper showFooter={false}>
        <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
          <Loader size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (!teacher) {
    return (
      <PageWrapper showFooter={false}>
        <div className="max-w-2xl mx-auto px-4 py-12 text-center text-slate-500">
          Teacher not found
        </div>
      </PageWrapper>
    );
  }

  const canBook = selectedDate && selectedSlot;

  return (
    <PageWrapper showFooter={false}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-28 sm:pb-8" data-testid="book-session-page">
        {/* ── Top Header ─────────────────────────────────── */}
        <div className="flex items-center gap-4 py-5">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-500 hover:text-[#7B0080] hover:bg-[#7B0080]/5 rounded-lg transition-all"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar
              src={teacher.profilePhoto}
              firstName={teacher.firstName}
              lastName={teacher.lastName}
              size="default"
            />
            <div className="min-w-0">
              <h1 className="text-lg font-bold font-heading text-slate-900 truncate">Book Session</h1>
              <p className="text-sm text-slate-500 truncate">
                with {teacher.title} {teacher.firstName} {teacher.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* ── Filters ────────────────────────────────────── */}
        <Card className="mb-4">
          <CardContent className="p-4 sm:p-5">
            {/* Free Trial Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-700">Free Trial Only</span>
              <button
                onClick={() => setFreeTrial(!freeTrial)}
                data-testid="free-trial-filter"
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  freeTrial ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  freeTrial ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Session Type Pills */}
            <div className="flex gap-2" data-testid="session-type-filter">
              {[
                { id: 'all', label: 'All' },
                { id: 'video', label: 'Video', icon: Video },
                { id: 'chat', label: 'Chat', icon: MessageSquare },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSessionType(id)}
                  data-testid={`filter-${id}`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    sessionType === id
                      ? 'bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Calendar ───────────────────────────────────── */}
        <Card className="mb-4">
          <CardContent className="p-4 sm:p-5">
            <div className="mb-1">
              <h2 className="text-base font-bold font-heading text-slate-900">Select a Date</h2>
              <p className="text-xs text-slate-500 mt-0.5">Green dots indicate available slots</p>
            </div>

            {/* Month Nav */}
            <div className="flex items-center justify-between mt-4 mb-3">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                data-testid="prev-month"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h3 className="text-sm font-bold font-heading text-slate-900">{monthName}</h3>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                data-testid="next-month"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Weekday Header */}
            <div className="grid grid-cols-7 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1.5">{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            {slotsLoading ? (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="aspect-square rounded-xl skeleton" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const ds = dateStr(day);
                  const past = isPastDate(day);
                  const hasSlots = availableDates.has(ds);
                  const isSelected = selectedDate === ds;
                  const isToday = ds === todayStr;

                  const dayClass = isSelected
                    ? 'bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                    : past || !hasSlots
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-800 hover:bg-[#7B0080]/5 cursor-pointer';
                  const todayRing = isToday && !isSelected ? 'ring-2 ring-[#7B0080]/30 ring-inset' : '';

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (past || !hasSlots) return;
                        setSelectedDate(ds);
                        setSelectedSlot(null);
                      }}
                      disabled={past || !hasSlots}
                      data-testid={`cal-day-${day}`}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 ${dayClass} ${todayRing}`}
                    >
                      {day}
                      {/* Green dot */}
                      {hasSlots && !isSelected && (
                        <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Time Slots ─────────────────────────────────── */}
        {selectedDate && (
          <Card className="mb-4 animate-slideUp">
            <CardContent className="p-4 sm:p-5">
              <h2 className="text-base font-bold font-heading text-slate-900 mb-1">
                Available Slots
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {new Date(selectedDate).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              {dateSlotsFiltered.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-slate-400 font-medium">No slots available</p>
                  <p className="text-xs text-slate-400 mt-1">Try a different date or filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2" data-testid="time-slots-grid">
                  {dateSlotsFiltered.map(slot => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isFree = slot.price === 0 || slot.price === 0.0;
                    const priceColor = isSelected ? 'text-white/90' : isFree ? 'text-emerald-600' : 'text-[#7B0080]';
                    const SessionIcon = slot.sessionType === 'chat' ? MessageSquare : Video;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        data-testid={`slot-${slot.id}`}
                        className={`relative flex flex-col items-center py-3 px-2 rounded-xl text-sm transition-all duration-200 ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white shadow-lg shadow-[#7B0080]/25 scale-[1.03]'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-sm'
                        }`}
                      >
                        <span className="font-bold">{slot.startTime}</span>
                        <span className={`text-xs mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          {slot.duration || 60} min
                        </span>
                        <span className={`text-xs mt-1 font-semibold ${priceColor}`}>
                          {isFree ? 'Free' : formatCurrency(slot.price)}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center">
                            <SessionIcon className="w-3 h-3 text-[#7B0080]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Booking Summary (desktop) ──────────────────── */}
        {canBook && (
          <Card className="hidden sm:block mb-4 animate-slideUp">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Date: </span>
                    <span className="font-semibold text-slate-900">
                      {new Date(selectedDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Time: </span>
                    <span className="font-semibold text-slate-900">{selectedSlot.startTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Duration: </span>
                    <span className="font-semibold text-slate-900">{selectedSlot.duration || 60} min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedSlot.price === 0 ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Zap className="w-4 h-4" /> Free Trial
                      </span>
                    ) : (
                      <span className="text-[#7B0080] font-bold text-lg">
                        {formatCurrency(selectedSlot.price)}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleBook}
                  loading={booking}
                  data-testid="book-session-btn"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Sticky CTA (mobile) ────────────────────────── */}
      {canBook && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 z-40 animate-slideUp">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-slate-500">
              {new Date(selectedDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })} &bull; {selectedSlot.startTime}
            </span>
            {selectedSlot.price === 0 ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Free</span>
            ) : (
              <span className="text-[#7B0080] font-bold">{formatCurrency(selectedSlot.price)}</span>
            )}
          </div>
          <Button
            onClick={handleBook}
            loading={booking}
            className="w-full"
            data-testid="book-session-btn-mobile"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Book Session
          </Button>
        </div>
      )}
    </PageWrapper>
  );
};

export default BookSession;
