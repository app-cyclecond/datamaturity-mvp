"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  assessmentQuestions,
  assessmentDimensions,
  AssessmentDimension,
} from "@/lib/assessment/questions";
import {
  calculateDimensionResults,
  calculateOverallScore,
  getMaturityLevel,
} from "@/lib/assessment/utils";
import { AssessmentHeader } from "@/components/assessment/assessment-header";
import { QuestionCard } from "@/components/assessment/question-card";
import { ScaleResponse } from "@/components/assessment/scale-response";
import { SaveIndicator } from "@/components/assessment/save-indicator";
import { maturityLevels } from "@/lib/assessment/questions";

export default function AssessmentPage() {
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saveStatus, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasSavedRef = useRef(false);

  const currentDimension = assessmentDimensions[currentDimensionIndex];
  const dimensionQuestions = assessmentQuestions.filter(
    (q) => q.dimension === currentDimension
  );

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = assessmentQuestions.length;
  const progress = Math.round((totalAnswered / totalQuestions) * 100);

  // Load saved answers from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem("assessmentAnswers");
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  // Save answers to session storage
  useEffect(() => {
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(answers));
  }, [answers]);

  // Auto-save to database when all questions are answered
  useEffect(() => {
    const allAnswered = assessmentQuestions.every((q) => answers[q.id] !== undefined);

    if (allAnswered && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveResults();
    }
  }, [answers]);

  async function saveResults() {
    setStatus("saving");
    try {
      const dimensionResults = calculateDimensionResults(
        assessmentQuestions,
        answers
      );
      const score = calculateOverallScore(answers);
      const level = getMaturityLevel(score);

      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          level,
          dimensionScores: dimensionResults,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      const data = await response.json();
      setStatus("saved");

      // Redirect to results page after a short delay
      setTimeout(() => {
        router.push(`/resultado/${data.inserted?.[0]?.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error saving results:", error);
      setStatus("error");
    }
  }

  async function handleSaveAndExit() {
    setStatus("saving");
    try {
      const dimensionResults = calculateDimensionResults(
        assessmentQuestions,
        answers
      );
      const score = calculateOverallScore(answers);
      const level = getMaturityLevel(score);

      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          level,
          dimensionScores: dimensionResults,
        }),
      });

      setStatus("saved");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error saving:", error);
      setStatus("error");
    }
  }

  function handleAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  function isCurrentDimensionComplete(): boolean {
    return dimensionQuestions.every((q) => answers[q.id] !== undefined);
  }

  function goToPreviousDimension() {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex((prev) => prev - 1);
    }
  }

  function goToNextDimension() {
    if (currentDimensionIndex < assessmentDimensions.length - 1) {
      setCurrentDimensionIndex((prev) => prev + 1);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
          <p className="mt-4 text-gray-600">Carregando assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AssessmentHeader
        currentDimension={currentDimensionIndex + 1}
        totalDimensions={assessmentDimensions.length}
        dimensionName={currentDimension}
        progress={progress}
        onSaveAndExit={handleSaveAndExit}
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {dimensionQuestions.map((question) => (
            <QuestionCard key={question.id} question={question}>
              <ScaleResponse
                levels={maturityLevels}
                value={answers[question.id]}
                onChange={(value) => handleAnswer(question.id, value)}
              />
            </QuestionCard>
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="sticky bottom-0 mt-12 pt-6 pb-6 bg-gradient-to-t from-gray-50 to-transparent">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousDimension}
              disabled={currentDimensionIndex === 0}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${
                  currentDimensionIndex === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              Dimensão anterior
            </button>

            <div className="text-sm text-gray-600">
              {totalAnswered} de {totalQuestions} perguntas respondidas
            </div>

            <button
              onClick={goToNextDimension}
              disabled={!isCurrentDimensionComplete()}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${
                  isCurrentDimensionComplete()
                    ? "bg-brand-primary text-white hover:opacity-90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {currentDimensionIndex === assessmentDimensions.length - 1
                ? "Finalizar"
                : "Próxima dimensão"}
            </button>
          </div>
        </div>
      </main>

      <SaveIndicator status={saveStatus} />
    </div>
  );
}
