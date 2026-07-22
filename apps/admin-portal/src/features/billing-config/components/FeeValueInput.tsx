import { Input } from '../../../components/ui/Input';

interface FeeValueInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  type: 'percentage' | 'fixed';
}

export function FeeValueInput({ value, onChange, error, type }: FeeValueInputProps) {
  return (
    <div className="flex items-center gap-2">
      {type === 'percentage' && (
        <span className="text-sm text-zinc-500">$</span>
      )}
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`block w-32 rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
          error ? 'border-red-500' : 'border-zinc-300'
        }`}
      />
      {type === 'percentage' && <span className="text-sm text-zinc-500">%</span>}
      {type === 'fixed' && <span className="text-sm text-zinc-500">.00</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}