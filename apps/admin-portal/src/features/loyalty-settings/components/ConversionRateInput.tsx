import { useState } from 'react';

interface ConversionRateInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function ConversionRateInput({ value, onChange }: ConversionRateInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val > 100) {
      setError('Rate exceeds 100 points per dollar - may cause inflation issues');
    } else if (val < 0) {
      setError('Rate cannot be negative');
    } else {
      setError(null);
    }
    onChange(isNaN(val) ? 0 : val);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-700">Conversion Rate</label>
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">1 Point = $</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={handleChange}
          className={`w-32 rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
        <span className="text-sm text-zinc-500">AUD</span>
      </div>
      {error && <p className="text-xs text-amber-600">{error}</p>}
    </div>
  );
}