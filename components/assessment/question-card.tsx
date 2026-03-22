import { AssessmentQuestion } from "@/lib/assessment/questions";

interface QuestionCardProps {
  question: AssessmentQuestion;
  children: React.ReactNode;
}

export function QuestionCard({ question, children }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
          {question.text}
        </h3>
        <p className="text-base text-gray-600 leading-relaxed">
          {question.description}
        </p>
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}
