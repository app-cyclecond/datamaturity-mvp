import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

type DimensionScore = {
  dimension: string;
  score: number;
  level: string;
};

type AssessmentResult = {
  id: string;
  overall_score: number | string;
  level: string;
  created_at: string;
  dimension_scores?: DimensionScore[] | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Não autenticado</div>;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: latestResult } = await supabase
    .from("assessment_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<AssessmentResult>();

  const { data: history } = await supabase
    .from("assessment_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(5);

  const orderedHistory: AssessmentResult[] = (history as AssessmentResult[]) || [];
  const trend = getTrend(orderedHistory);
  const latestDimensions = Array.isArray(latestResult?.dimension_scores)
    ? latestResult.dimension_scores
    : [];

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-black text-white p-6 rounded-xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Olá, {profile?.name || profile?.email}
          </h1>
          <p className="text-sm opacity-80">
            Fundação pronta. Próximo passo: evoluir seu diagnóstico.
          </p>
        </div>

        <form action={signOut}>
          <button className="bg-white text-black px-4 py-2 rounded">
            Logout
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4 rounded-xl bg-white">
          <h2 className="font-semibold mb-2">Empresa</h2>
          <p>{profile?.company || "-"}</p>
        </div>

        <div className="border p-4 rounded-xl bg-white">
          <h2 className="font-semibold mb-2">Cargo</h2>
          <p>{profile?.role || "-"}</p>
        </div>

        <div className="border p-4 rounded-xl bg-white">
          <h2 className="font-semibold mb-2">Plano</h2>
          <p>{profile?.plan || "-"}</p>
        </div>
      </div>

      <div className="border p-6 rounded-xl bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Último diagnóstico</h2>
            <p className="text-sm text-gray-500">
              Resultado mais recente do assessment
            </p>
          </div>

          <a
            href="/assessment"
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Novo diagnóstico
          </a>
        </div>

        {latestResult ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Score</p>
                <p className="text-3xl font-bold">
                  {Number(latestResult.overall_score).toFixed(1)}
                </p>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Nível</p>
                <p className="text-2xl font-semibold">{latestResult.level}</p>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Data</p>
                <p className="text-base font-medium">
                  {formatDate(latestResult.created_at)}
                </p>
              </div>
            </div>

            {latestDimensions.length > 0 && (
              <div className="space-y-3 pt-2">
                <div>
                  <h3 className="text-lg font-bold">Dimensões do último diagnóstico</h3>
                  <p className="text-sm text-gray-500">
                    Veja onde sua maturidade está mais forte e mais fraca
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {latestDimensions.map((item) => (
                    <div
                      key={item.dimension}
                      className="border rounded-xl p-4 bg-white"
                    >
                      <p className="text-sm text-gray-500 mb-1">{item.dimension}</p>
                      <p className="text-2xl font-bold">{Number(item.score).toFixed(1)}</p>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {item.level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-gray-600">
              Você ainda não possui diagnósticos salvos.
            </p>
          </div>
        )}
      </div>

      <div className="border p-6 rounded-xl bg-white space-y-5">
        <div>
          <h2 className="text-xl font-bold">Evolução recente</h2>
          <p className="text-sm text-gray-500">
            Tendência dos seus últimos diagnósticos em uma única visão
          </p>
        </div>

        {orderedHistory.length > 0 ? (
          <>
            <div className="border rounded-xl p-4 bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Leitura rápida</p>
              <p className="text-lg font-semibold">{trend.label}</p>
              <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
            </div>

            <TrendChart data={orderedHistory} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {orderedHistory.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Diagnóstico {index + 1}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">
                        {Number(item.overall_score).toFixed(1)}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {item.level}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 text-right">
                    {formatDate(item.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Ainda não há dados suficientes para mostrar evolução.
          </p>
        )}
      </div>
    </div>
  );
}

function TrendChart({ data }: { data: AssessmentResult[] }) {
  const width = 980;
  const height = 280;
  const paddingLeft = 150;
  const paddingRight = 30;
  const paddingTop = 24;
  const paddingBottom = 42;

  const scores = data.map((item) => Number(item.overall_score));
  const minScore = 0;
  const maxScore = 5;

  const levelLabels = [
    { value: 1, label: "Inexistente", color: "#ef4444" },
    { value: 2, label: "Inicial", color: "#f97316" },
    { value: 3, label: "Intermediário", color: "#eab308" },
    { value: 4, label: "Avançado", color: "#3b82f6" },
    { value: 5, label: "Otimizado", color: "#22c55e" },
  ];

  const plotHeight = height - paddingTop - paddingBottom;
  const plotWidth = width - paddingLeft - paddingRight;

  if (scores.length === 1) {
    const y =
      height -
      paddingBottom -
      ((scores[0] - minScore) / (maxScore - minScore)) * plotHeight;

    return (
      <div className="border rounded-xl p-4 bg-white">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72">
          {levelLabels.map((tick) => {
            const tickY =
              height -
              paddingBottom -
              ((tick.value - minScore) / (maxScore - minScore)) * plotHeight;

            return (
              <g key={tick.value}>
                <line
                  x1={paddingLeft}
                  y1={tickY}
                  x2={width - paddingRight}
                  y2={tickY}
                  stroke="#e5e7eb"
                  strokeDasharray="4 4"
                />
                <text x={12} y={tickY + 4} fontSize="12" fill={tick.color}>
                  {tick.value.toFixed(1)} {tick.label}
                </text>
              </g>
            );
          })}

          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#d1d5db"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="#d1d5db"
          />

          <circle cx={width / 2} cy={y} r="6" fill="black" />
          <text
            x={width / 2}
            y={y - 12}
            textAnchor="middle"
            fontSize="14"
            fill="#111827"
          >
            {scores[0].toFixed(1)}
          </text>
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7280"
          >
            {formatShortDate(data[0].created_at)}
          </text>
        </svg>
      </div>
    );
  }

  const xStep = plotWidth / (scores.length - 1);

  const points = scores.map((score, index) => {
    const x = paddingLeft + index * xStep;
    const y =
      height -
      paddingBottom -
      ((score - minScore) / (maxScore - minScore)) * plotHeight;

    return { x, y, score, index };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="border rounded-xl p-4 bg-white">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72">
        {levelLabels.map((tick) => {
          const y =
            height -
            paddingBottom -
            ((tick.value - minScore) / (maxScore - minScore)) * plotHeight;

          return (
            <g key={tick.value}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
              />
              <text x={12} y={y + 4} fontSize="12" fill={tick.color}>
                {tick.value.toFixed(1)} {tick.label}
              </text>
            </g>
          );
        })}

        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#d1d5db"
        />
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom}
          stroke="#d1d5db"
        />

        <polyline
          fill="none"
          stroke="black"
          strokeWidth="3"
          points={polylinePoints}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((point, idx) => (
          <g key={idx}>
            <circle cx={point.x} cy={point.y} r="5" fill="black" />
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              fontSize="12"
              fill="#111827"
            >
              {point.score.toFixed(1)}
            </text>
            <text
              x={point.x}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {formatShortDate(data[idx].created_at)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function getTrend(data: AssessmentResult[]) {
  if (data.length < 2) {
    return {
      label: "Histórico inicial",
      description:
        "Você ainda não tem dados suficientes para identificar uma tendência clara.",
    };
  }

  const last = Number(data[data.length - 1].overall_score);
  const previous = Number(data[data.length - 2].overall_score);

  if (last > previous) {
    return {
      label: "📈 Evolução positiva",
      description:
        "Seu resultado mais recente está acima do anterior. Há sinal de avanço na maturidade.",
    };
  }

  if (last < previous) {
    return {
      label: "📉 Queda no resultado",
      description:
        "Seu resultado mais recente ficou abaixo do anterior. Vale revisar o diagnóstico e entender a causa.",
    };
  }

  return {
    label: "➖ Estável",
    description:
      "Seu resultado permaneceu no mesmo patamar em relação ao diagnóstico anterior.",
    };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}