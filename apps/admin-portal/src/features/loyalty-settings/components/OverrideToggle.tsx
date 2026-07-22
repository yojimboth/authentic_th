interface OverrideToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function OverrideToggle({ checked, onChange }: OverrideToggleProps) {
  return (
    <label className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? 'bg-indigo-600' : 'bg-zinc-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <div>
        <span className="text-sm font-medium text-zinc-700">Allow Override</span>
        <p className="text-xs text-zinc-500">Restaurants can set custom rates</p>
      </div>
    </label>
  );
}