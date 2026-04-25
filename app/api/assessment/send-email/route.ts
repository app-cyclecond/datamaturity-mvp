import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailRequest {
  resultId: string;
  emails: string[];
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("📧 [SEND-EMAIL] Iniciando envio de email...");

    // 1. Verificar autenticação
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // 2. Parse do body
    const body: SendEmailRequest = await request.json();
    const { resultId, emails, message } = body;

    // Validar emails
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "Pelo menos um email é necessário" },
        { status: 400 }
      );
    }

    if (emails.length > 3) {
      return NextResponse.json(
        { error: "Máximo de 3 emails permitidos" },
        { status: 400 }
      );
    }

    // Validar formato dos emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: `Email inválido: ${email}` },
          { status: 400 }
        );
      }
    }

    // 3. Buscar resultado do assessment
    const supabase = await createClient();
    const { data: result, error: resultError } = await supabase
      .from("assessment_results")
      .select("*")
      .eq("id", resultId)
      .eq("user_id", user.id)
      .single();

    if (resultError || !result) {
      console.error("❌ [SEND-EMAIL] Resultado não encontrado:", resultError);
      return NextResponse.json(
        { error: "Resultado não encontrado" },
        { status: 404 }
      );
    }

    // 4. Buscar dados do usuário
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    // 5. Enviar email via API (usando SendGrid, Resend, ou similar)
    // TODO: Implementar integração com serviço de email
    // Por enquanto, vamos simular o envio

    const emailsToSend = emails.map((email) => ({
      to: email,
      subject: `Seu Diagnóstico de Maturidade de Dados - ${new Date(result.created_at).toLocaleDateString("pt-BR")}`,
      html: generateEmailHTML(result, userData, user, message),
    }));

    console.log("📧 [SEND-EMAIL] Emails a enviar:", emailsToSend.length);

    // Enviar via Resend
    const sendPromises = emailsToSend.map((emailData) =>
      resend.emails.send({
        from: "DataMaturity <noreply@datamaturity.com.br>",
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      })
    );

    const results = await Promise.allSettled(sendPromises);
    const failures = results.filter((r) => r.status === "rejected");

    if (failures.length > 0) {
      console.error("❌ [SEND-EMAIL] Falhas no envio:", failures);
      return NextResponse.json(
        { error: "Erro ao enviar alguns emails" },
        { status: 500 }
      );
    }

    console.log(`✅ [SEND-EMAIL] ${emails.length} email(s) enviado(s) com sucesso`);
    return NextResponse.json({
      success: true,
      message: `Email enviado para ${emails.length} destinatário(s)`,
      emails,
    });
  } catch (error) {
    console.error("❌ [SEND-EMAIL] Erro:", error);
    return NextResponse.json(
      {
        error: "Erro ao enviar email",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

function generateEmailHTML(
  result: any,
  userData: any,
  user: any,
  message?: string
): string {
  const scoreColor = getScoreColor(result.level);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 28px; border-radius: 8px; text-align: center; }
          .score-box { background: ${scoreColor}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .score-value { font-size: 48px; font-weight: bold; }
          .score-level { font-size: 18px; margin-top: 10px; }
          .section { margin: 20px 0; }
          .section-title { font-size: 16px; font-weight: bold; color: #6366f1; margin-bottom: 10px; }
          .dimension-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Seu Diagnóstico de Maturidade de Dados</h1>
            <p>${new Date(result.created_at).toLocaleDateString("pt-BR")}</p>
          </div>

          <div class="section">
            <p>Olá${userData?.name ? `, ${userData.name.split(' ')[0]}` : ''},</p>
            <p>Segue em anexo seu diagnóstico de maturidade de dados realizado em ${new Date(result.created_at).toLocaleDateString("pt-BR")}.</p>
            ${message ? `<p><strong>Mensagem:</strong> ${message}</p>` : ""}
          </div>

          <div class="score-box">
            <div class="score-value">${result.overall_score}</div>
            <div class="score-level">${result.level}</div>
          </div>

          <div class="section">
            <div class="section-title">Resultados por Dimensão</div>
            ${Object.entries(result.dimension_scores)
              .map(
                ([name, score]: [string, any]) =>
                  `<div class="dimension-item">
                    <span>${name}</span>
                    <strong>${score.toFixed(1)}/5.0</strong>
                  </div>`
              )
              .join("")}
          </div>

          <div class="section" style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/resultado/${result.id}" class="button">
              Ver Diagnóstico Completo
            </a>
          </div>

          <div class="footer">
            <p>Este é um email automático do sistema DataMaturity.</p>
            <p>© ${new Date().getFullYear()} DataMaturity. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getScoreColor(level: string): string {
  switch (level) {
    case "Inexistente":
      return "#ef4444";
    case "Inicial":
    case "Reativo":
      return "#f97316";
    case "Estruturado":
      return "#eab308";
    case "Proativo":
    case "Gerenciado":
      return "#3b82f6";
    case "Otimizado":
      return "#22c55e";
    default:
      return "#6366f1";
  }
}
