import { X } from "lucide-react";
import Link from "next/link";

interface AssessmentHeaderProps {
  currentDimension: number;
  totalDimensions: number;
  dimensionName: string;
  progress: number;
  onSaveAndExit?: () => void;
}

export function AssessmentHeader({
  currentDimension,
  totalDimensions,
  dimensionName,
  progress,
  onSaveAndExit,
}: AssessmentHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Header content */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Dimensão {currentDimension} de {totalDimensions} · {dimensionName}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {dimensionName}
            </h1>
          </div>

          {onSaveAndExit && (
            <button
              onClick={onSaveAndExit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Salvar e sair"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
