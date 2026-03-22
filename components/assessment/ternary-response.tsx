interface TernaryResponseProps {
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const ternaryOptions = [
  { value: 1, label: "Não", color: "bg-red-50 border-red-200 text-red-900" },
  { value: 3, label: "Parcial", color: "bg-amber-50 border-amber-200 text-amber-900" },
  { value: 5, label: "Sim", color: "bg-green-50 border-green-200 text-green-900" },
];

export function TernaryResponse({
  value,
  onChange,
  disabled = false,
}: TernaryResponseProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ternaryOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`
            rounded-xl border-2 p-4 text-center transition-all font-semibold
            ${
              value === option.value
                ? `${option.color} border-current shadow-md`
                : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
