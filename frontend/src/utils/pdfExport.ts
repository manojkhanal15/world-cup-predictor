import { Prediction } from '../types';

export async function exportPredictionToPDF(prediction: Prediction, userName: string): Promise<void> {
  // Dynamic import to keep bundle size smaller
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const FIFA_BLUE = [0, 90, 170] as [number, number, number];
  const GOLD = [255, 193, 7] as [number, number, number];
  const DARK = [15, 23, 42] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];

  // Header
  doc.setFillColor(...FIFA_BLUE);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(...GOLD);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FIFA WORLD CUP 2026', 105, 18, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(...WHITE);
  doc.text(`Prediction: ${prediction.name}`, 105, 28, { align: 'center' });
  doc.text(`By ${userName}`, 105, 35, { align: 'center' });

  let y = 50;
  const lineH = 7;

  // Final Results
  if (prediction.champion) {
    doc.setFillColor(...GOLD);
    doc.rect(10, y - 5, 190, 10, 'F');
    doc.setTextColor(...DARK);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('🏆 CHAMPION', 15, y + 2);
    doc.text(prediction.champion, 140, y + 2);
    y += lineH + 3;
  }

  if (prediction.runner_up) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.text('🥈 Runner-Up:', 15, y);
    doc.text(prediction.runner_up, 140, y);
    y += lineH;
  }

  if (prediction.third_place) {
    doc.text('🥉 Third Place:', 15, y);
    doc.text(prediction.third_place, 140, y);
    y += lineH + 5;
  }

  // Group Results
  if (prediction.group_results) {
    doc.setFillColor(...FIFA_BLUE);
    doc.rect(10, y - 4, 190, 8, 'F');
    doc.setTextColor(...WHITE);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('GROUP STAGE RESULTS', 15, y + 1);
    y += 10;

    const groups = prediction.group_results;
    Object.entries(groups).forEach(([letter, result]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setTextColor(...DARK);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Group ${letter}`, 15, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Winner: ${result.winner || '—'}`, 50, y);
      doc.text(`Runner-up: ${result.runner_up || '—'}`, 120, y);
      y += lineH;
    });
  }

  y += 5;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} • World Cup 2026 Predictor`,
    105,
    290,
    { align: 'center' }
  );

  doc.save(`worldcup2026-prediction-${prediction.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}