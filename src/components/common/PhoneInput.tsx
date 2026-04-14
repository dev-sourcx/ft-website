import React from 'react';

export interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: '+27', flag: '\u{1F1FF}\u{1F1E6}', name: 'South Africa' },
  { code: '+254', flag: '\u{1F1F0}\u{1F1EA}', name: 'Kenya' },
  { code: '+234', flag: '\u{1F1F3}\u{1F1EC}', name: 'Nigeria' },
  { code: '+255', flag: '\u{1F1F9}\u{1F1FF}', name: 'Tanzania' },
  { code: '+256', flag: '\u{1F1FA}\u{1F1EC}', name: 'Uganda' },
  { code: '+263', flag: '\u{1F1FF}\u{1F1FC}', name: 'Zimbabwe' },
  { code: '+264', flag: '\u{1F1F3}\u{1F1E6}', name: 'Namibia' },
  { code: '+267', flag: '\u{1F1E7}\u{1F1FC}', name: 'Botswana' },
  { code: '+268', flag: '\u{1F1F8}\u{1F1FF}', name: 'Eswatini' },
  { code: '+261', flag: '\u{1F1F2}\u{1F1EC}', name: 'Madagascar' },
  { code: '+44', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
  { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
  { code: '+91', flag: '\u{1F1EE}\u{1F1F3}', name: 'India' },
  { code: '+61', flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
];

interface PhoneInputProps {
  phoneCode: string;
  phone: string;
  onCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  error?: string;
  testIdPrefix?: string;
}

const PhoneInput = ({ phoneCode, phone, onCodeChange, onPhoneChange, error, testIdPrefix = '' }: PhoneInputProps) => {
  const selected = COUNTRY_CODES.find(c => c.code === phoneCode) || COUNTRY_CODES[0];

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
      <div className="flex gap-2">
        <select
          value={phoneCode}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-[110px] px-2 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none bg-white"
          data-testid={`${testIdPrefix}phone-code`}
        >
          {COUNTRY_CODES.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none ${
            error ? 'border-red-400' : 'border-slate-200'
          }`}
          data-testid={`${testIdPrefix}phone`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;
