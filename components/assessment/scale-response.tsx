import { MaturityLevel } from "@/lib/assessment/questions";

interface ScaleResponseProps {
  levels: MaturityLevel[];
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function ScaleResponse({
  levels,
  value,
  onChange,
  disabled = false,
}: ScaleResponseProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {levels.map((level) => (
        <button
          key={level.level}
          type="button"
          onClick={() => onChange(level.level)}
          disabled={disabled}
          className={`
            rounded-xl border-2 p-4 text-center transition-all
            ${
              value === level.level
                ? "border-brand-primary bg-brand-primary text-white shadow-md"
                : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <div className="font-bold text-lg">{level.level}</div>
          <div className="text-xs font-medium mt-1 opacity-80">
            {level.label}
          </div>
        </button>
      ))}
    </div>
  );
}
