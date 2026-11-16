import { jsPDF } from 'jspdf';
import { Note } from '@/types';

/**
 * Generates an official, beautifully formatted academic PDF document for a study resource
 * and triggers an immediate browser download of the .pdf file.
 */
export function generateStudyNotesPDF(note: Note): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  const bottomThreshold = pageHeight - 25; // 272mm

  let currentY = 0;

  // Helper to draw the top branding banner on page 1
  const drawMainHeader = () => {
    // Header background (NoteNest Indigo: #4f46e5)
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 24, 'F');

    // Title text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('NOTENEST ACADEMIC NETWORK', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(224, 231, 255);
    doc.text('OFFICIAL CURRICULUM REPOSITORY & STUDY COMPANION', margin, 18);

    // Right-aligned status in header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('VERIFIED RESOURCE', pageWidth - margin, 14, { align: 'right' });

    // Sub-bar (Light slate banner: #f1f5f9)
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 24, pageWidth, 9, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const breadcrumb = `${note.subject.toUpperCase()}  |  ${note.courseCode}  |  ${note.semester}`;
    doc.text(breadcrumb, margin, 30);

    const resourceId = `ID: #NN-${(note.id || 'ACAD').slice(0, 8).toUpperCase()}`;
    doc.text(resourceId, pageWidth - margin, 30, { align: 'right' });

    currentY = 40;
  };

  // Helper to draw continuation header on pages 2+
  const drawPageContinuationHeader = () => {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, 16, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(0, 16, pageWidth, 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(79, 70, 229);
    doc.text('NoteNest Academic Repository', margin, 10);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${note.courseCode} — ${note.title.slice(0, 50)}...`, margin + 50, 10);

    currentY = 24;
  };

  // Checks if adding `requiredHeight` mm would exceed page boundaries; if so, adds a page.
  const ensureSpace = (requiredHeight: number) => {
    if (currentY + requiredHeight > bottomThreshold) {
      doc.addPage();
      drawPageContinuationHeader();
    }
  };

  // Start with page 1 header
  drawMainHeader();

  // -------------------------------------------------------------
  // 1. TITLE & METADATA CARD
  // -------------------------------------------------------------
  const titleLines = doc.splitTextToSize(note.title, contentWidth - 10);
  const titleBoxHeight = 16 + titleLines.length * 6 + 18;

  ensureSpace(titleBoxHeight);

  // Background card for title
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, titleBoxHeight, 2.5, 2.5, 'FD');

  // Title text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(titleLines, margin + 6, currentY + 9);

  const metaStartY = currentY + 11 + titleLines.length * 6;

  // Metadata separator line
  doc.setDrawColor(241, 245, 249);
  doc.line(margin + 6, metaStartY - 2, margin + contentWidth - 6, metaStartY - 2);

  // Contributor / Verified Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(79, 70, 229);
  const uploaderDept = note.uploader.department || note.uploader.name;
  doc.text(`Contributor: ${uploaderDept}`, margin + 6, metaStartY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const statText = `Rating: ★ ${note.rating.toFixed(1)}/5.0 (${note.reviewsCount} reviews)   |   Pages: ${note.pageCount || 10}+   |   Downloads: ${note.downloadsCount || 120}+`;
  doc.text(statText, margin + 6, metaStartY + 10);

  currentY += titleBoxHeight + 8;

  // -------------------------------------------------------------
  // 2. SECTION: COURSE SUMMARY & OBJECTIVES
  // -------------------------------------------------------------
  const renderSectionHeader = (title: string) => {
    ensureSpace(14);
    // Accent indicator bar
    doc.setFillColor(79, 70, 229);
    doc.rect(margin, currentY, 3, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(title, margin + 6, currentY + 5);

    currentY += 10;
  };

  renderSectionHeader('1. Core Objectives & Conceptual Outline');

  const descLines = doc.splitTextToSize(
    note.description ||
      'These lecture review notes synthesize foundational theory with worked examination problems, algorithmic pseudocode, and step-by-step problem-solving templates.',
    contentWidth - 6
  );

  ensureSpace(descLines.length * 5 + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(descLines, margin + 2, currentY + 3);
  currentY += descLines.length * 5 + 8;

  // -------------------------------------------------------------
  // 3. SECTION: THEOREM & MAIN PRINCIPLES (CALLOUT BOX)
  // -------------------------------------------------------------
  renderSectionHeader('2. Key Theoretical Principles & Examination Invariants');

  const theoremText =
    'Theorem / Principle Invariant: Given input parameters, state transitions preserve invariance across asymptotic boundaries O(log n) and O(V + E). All dynamic programming recurrence states must be memorized to guarantee polynomial evaluation time.';

  const examChecklist = [
    '• Rigorous Formulation: Formulate core invariants before evaluating edge-case states.',
    '• Complexity Bounds: Benchmark asymptotic upper bound O(f(n)) and lower bound Omega(g(n)).',
    '• Examination Review: Cross-referenced with recommended university syllabus blueprints and textbook problem sets.',
  ];

  const theoremLines = doc.splitTextToSize(theoremText, contentWidth - 16);
  const calloutHeight = 12 + theoremLines.length * 4.5 + examChecklist.length * 5 + 6;

  ensureSpace(calloutHeight);

  // Callout background
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, calloutHeight, 2, 2, 'FD');

  // Accent vertical stripe
  doc.setFillColor(79, 70, 229);
  doc.rect(margin, currentY, 2.5, calloutHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Theoretical Summary & High-Yield Blueprint:', margin + 7, currentY + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(theoremLines, margin + 7, currentY + 12);

  let checklistY = currentY + 14 + theoremLines.length * 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  examChecklist.forEach((item) => {
    doc.text(item, margin + 7, checklistY);
    checklistY += 5;
  });

  currentY += calloutHeight + 8;

  // -------------------------------------------------------------
  // 4. SECTION: SYLLABUS TOPICS & TAGS
  // -------------------------------------------------------------
  if (note.tags && note.tags.length > 0) {
    renderSectionHeader('3. Syllabus Topics & Covered Concepts');

    ensureSpace(16);
    let tagX = margin + 2;
    let tagY = currentY + 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    note.tags.forEach((tag) => {
      const tagLabel = `#${tag}`;
      const tagTextWidth = doc.getTextWidth(tagLabel);
      const tagBoxWidth = tagTextWidth + 6;

      if (tagX + tagBoxWidth > margin + contentWidth) {
        tagX = margin + 2;
        tagY += 7;
        ensureSpace(10);
      }

      // Tag pill
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(tagX, tagY - 4, tagBoxWidth, 5.5, 1.5, 1.5, 'FD');

      doc.setTextColor(71, 85, 105);
      doc.text(tagLabel, tagX + 3, tagY);

      tagX += tagBoxWidth + 3;
    });

    currentY = tagY + 10;
  }

  // -------------------------------------------------------------
  // 5. SECTION: LECTURE VIDEO & EXTERNAL DIGITAL COMPANION
  // -------------------------------------------------------------
  if (note.videoUrl) {
    renderSectionHeader('4. Digital Video Lecture & Classroom Companion');

    const videoBoxHeight = 18;
    ensureSpace(videoBoxHeight);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, videoBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`Video Resource: ${note.videoPlatform || 'Online Lecture Session'}`, margin + 6, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Link: ${note.videoUrl}`, margin + 6, currentY + 12);

    currentY += videoBoxHeight + 8;
  }

  // -------------------------------------------------------------
  // 6. SECTION: ACADEMIC INTEGRITY & CITATION
  // -------------------------------------------------------------
  ensureSpace(22);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('ACADEMIC INTEGRITY & CITATION NOTICE', margin + 6, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const citationNotice =
    'Distributed under the NoteNest Academic Collaborative License. For peer revision, self-study, and curriculum preparation. All rights reserved by the respective university departments and student contributors.';
  const citationLines = doc.splitTextToSize(citationNotice, contentWidth - 12);
  doc.text(citationLines, margin + 6, currentY + 11);

  // -------------------------------------------------------------
  // 7. FOOTER PASS ACROSS ALL PAGES
  // -------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400

    doc.text('NoteNest Academic Resource Repository • https://notenest.academic', margin, pageHeight - 9);

    const pageNumText = `Page ${i} of ${totalPages}`;
    doc.text(pageNumText, pageWidth - margin, pageHeight - 9, { align: 'right' });
  }

  // -------------------------------------------------------------
  // 8. TRIGGER BROWSER DOWNLOAD (.PDF)
  // -------------------------------------------------------------
  const baseName = (note.fileName || note.title)
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const downloadFilename = `${baseName}.pdf`;
  doc.save(downloadFilename);
}
