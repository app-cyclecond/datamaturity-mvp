import { jsPDF } from "jspdf";

interface AssessmentData {
  id: string;
  overall_score: number;
  level: string;
  dimension_scores: Record<string, number>;
  created_at: string;
  user?: {
    name: string;
    email: string;
    company: string;
  };
}

const getLevelColor = (level: string): [number, number, number] => {
  switch (level) {
    case "Inexistente":
      return [239, 68, 68]; // red
    case "Inicial":
      return [249, 115, 22]; // orange
    case "Estruturado":
      return [234, 179, 8]; // yellow
    case "Gerenciado":
      return [59, 130, 246]; // blue
    case "Otimizado":
      return [34, 197, 94]; // green
    default:
      return [107, 114, 128]; // gray
  }
};

const getLevelDescription = (level: string): string => {
  switch (level) {
    case "Inexistente":
      return "A prática não existe ou ocorre de forma totalmente informal";
    case "Inicial":
      return "A prática existe de forma pontual e não estruturada";
    case "Estruturado":
      return "A prática está definida e documentada";
    case "Gerenciado":
      return "A prática é monitorada e executada de forma consistente";
    case "Otimizado":
      return "A prática é continuamente aprimorada e integrada à estratégia";
    default:
      return "";
  }
};

export async function generateAssessmentPDF(data: AssessmentData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // HEADER
  doc.setFillColor(99, 102, 241); // brand-primary
  doc.rect(15, 10, pageWidth - 30, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Diagnóstico de Maturidade de Dados", 20, 30);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`DataMaturity - ${new Date(data.created_at).toLocaleDateString("pt-BR")}`, 20, 42);

  yPosition = 55;

  // USER INFO
  if (data.user) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Informações do Usuário", 15, yPosition);

    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${data.user.name}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Email: ${data.user.email}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Empresa: ${data.user.company}`, 15, yPosition);
    yPosition += 10;
  }

  // OVERALL SCORE
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Score Geral", 15, yPosition);

  yPosition += 10;

  // Score Box
  const [r, g, b] = getLevelColor(data.level);
  doc.setFillColor(r, g, b);
  doc.rect(15, yPosition - 5, 60, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(data.overall_score.toString(), 25, yPosition + 12);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(data.level, 25, yPosition + 20);

  yPosition += 35;

  // LEVEL DESCRIPTION
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  const description = getLevelDescription(data.level);
  const descriptionLines = doc.splitTextToSize(description, pageWidth - 30);
  doc.text(descriptionLines, 15, yPosition);
  yPosition += descriptionLines.length * 4 + 10;

  // DIMENSION SCORES TABLE
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Resultados por Dimensão", 15, yPosition);

  yPosition += 8;

  // TABLE HEADER
  doc.setFillColor(99, 102, 241);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  
  const tableTop = yPosition;
  const colWidth = (pageWidth - 30) / 3;
  
  doc.rect(15, tableTop, colWidth, 7, "F");
  doc.rect(15 + colWidth, tableTop, colWidth, 7, "F");
  doc.rect(15 + colWidth * 2, tableTop, colWidth, 7, "F");
  
  doc.text("Dimensão", 17, tableTop + 5);
  doc.text("Score", 15 + colWidth + 5, tableTop + 5);
  doc.text("Progresso", 15 + colWidth * 2 + 5, tableTop + 5);

  yPosition += 10;

  // TABLE ROWS
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const dimensionEntries = Object.entries(data.dimension_scores).sort((a, b) => b[1] - a[1]);

  dimensionEntries.forEach((entry, index) => {
    const [name, score] = entry;
    const rowHeight = 6;
    
    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 4, pageWidth - 30, rowHeight, "F");
    }

    doc.setTextColor(0, 0, 0);
    
    // Truncate long dimension names
    const truncatedName = name.length > 25 ? name.substring(0, 22) + "..." : name;
    doc.text(truncatedName, 17, yPosition);
    doc.text(score.toFixed(1), 15 + colWidth + 5, yPosition);
    doc.text(`${Math.round((score / 5) * 100)}%`, 15 + colWidth * 2 + 5, yPosition);

    yPosition += rowHeight;

    // Check if we need a new page
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  });

  yPosition += 5;

  // FOOTER NOTE
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Este documento foi gerado automaticamente pelo sistema DataMaturity.",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Convert to Blob
  const pdf = doc.output("arraybuffer");
  return new Blob([pdf], { type: "application/pdf" });
}

export async function downloadAssessmentPDF(data: AssessmentData): Promise<void> {
  const blob = await generateAssessmentPDF(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `diagnostico-${data.id.slice(0, 8)}-${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function printAssessmentPDF(data: AssessmentData): Promise<void> {
  const blob = await generateAssessmentPDF(data);
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 1000);
  };
}
