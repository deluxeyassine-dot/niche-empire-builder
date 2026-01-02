import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

/**
 * KDP Interior Generator
 *
 * Generates print-ready interiors for Amazon KDP low-content books:
 * - Planners (daily, weekly, monthly)
 * - Journals (lined, dotted, blank)
 * - Notebooks
 * - Logbooks
 * - Workbooks
 * - Trackers
 *
 * Features:
 * - KDP-compliant formatting
 * - Multiple paper sizes
 * - Custom page layouts
 * - Bleed and margin settings
 */

export interface KDPInteriorConfig {
  type: 'planner' | 'journal' | 'notebook' | 'logbook' | 'tracker' | 'workbook';
  subtype?: 'daily' | 'weekly' | 'monthly' | 'lined' | 'dotted' | 'blank' | 'grid' | 'custom';
  pageCount: number;
  size: '6x9' | '8.5x11' | '8x10' | '7x10' | '5.5x8.5' | '5x8';
  paperType: 'white' | 'cream';
  includePageNumbers?: boolean;
  includeHeaders?: boolean;
  headerText?: string;
  customLayout?: any;
}

export interface KDPInterior {
  title: string;
  description: string;
  interiorPDF: string;
  pageCount: number;
  trimSize: string;
  bleedSetting: string;
  paperType: string;
  kdpCategories: string[];
  price: number;
}

export class KDPInteriorGenerator {
  private outputDir: string;

  private readonly PAGE_SIZES = {
    '6x9': { width: 6, height: 9 },
    '8.5x11': { width: 8.5, height: 11 },
    '8x10': { width: 8, height: 10 },
    '7x10': { width: 7, height: 10 },
    '5.5x8.5': { width: 5.5, height: 8.5 },
    '5x8': { width: 5, height: 8 },
  };

  private readonly BLEED = 0.125; // inches
  private readonly MARGIN = 0.5; // inches
  private readonly GUTTER = 0.25; // extra margin for binding side

  constructor(outputDir = './output/kdp-interiors') {
    this.outputDir = outputDir;
  }

  /**
   * Generate KDP interior
   */
  async generateInterior(config: KDPInteriorConfig): Promise<KDPInterior> {
    // Create output directory
    const bookDir = path.join(this.outputDir, this.sanitizeFilename(`${config.type}-${config.subtype || 'default'}`));
    await fs.mkdir(bookDir, { recursive: true });

    console.log(`📚 Generating KDP ${config.type} interior...`);
    console.log(`Type: ${config.type}${config.subtype ? ' - ' + config.subtype : ''}`);
    console.log(`Pages: ${config.pageCount}`);
    console.log(`Size: ${config.size}`);

    // Create PDF
    const pdfPath = await this.createInteriorPDF(config, bookDir);

    // Generate metadata
    const interior = this.generateMetadata(config, pdfPath);

    console.log('✅ KDP interior generated successfully!');

    return interior;
  }

  /**
   * Create interior PDF
   */
  private async createInteriorPDF(config: KDPInteriorConfig, outputDir: string): Promise<string> {
    const pdfPath = path.join(outputDir, 'interior.pdf');
    const pdfDoc = await PDFDocument.create();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Generate pages based on type
    for (let i = 0; i < config.pageCount; i++) {
      const page = this.addKDPPage(pdfDoc, config);

      // Add page content based on type and subtype
      await this.addPageContent(page, config, i + 1, font, boldFont);
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(pdfPath, pdfBytes);

    return pdfPath;
  }

  /**
   * Add KDP-formatted page
   */
  private addKDPPage(pdfDoc: PDFDocument, config: KDPInteriorConfig): PDFPage {
    const pageSize = this.PAGE_SIZES[config.size];

    // Add bleed
    const width = (pageSize.width + this.BLEED * 2) * 72;
    const height = (pageSize.height + this.BLEED * 2) * 72;

    return pdfDoc.addPage([width, height]);
  }

  /**
   * Add content to page
   */
  private async addPageContent(
    page: PDFPage,
    config: KDPInteriorConfig,
    pageNumber: number,
    font: PDFFont,
    boldFont: PDFFont
  ): Promise<void> {
    const { width, height } = page.getSize();
    const bleedPx = this.BLEED * 72;
    const marginPx = this.MARGIN * 72;

    // Determine if this is a left or right page
    const isLeftPage = pageNumber % 2 === 0;
    const gutterPx = this.GUTTER * 72;

    // Calculate content area
    const leftMargin = bleedPx + marginPx + (isLeftPage ? gutterPx : 0);
    const rightMargin = bleedPx + marginPx + (!isLeftPage ? gutterPx : 0);
    const topMargin = bleedPx + marginPx;
    const bottomMargin = bleedPx + marginPx;

    const contentWidth = width - leftMargin - rightMargin;
    const contentHeight = height - topMargin - bottomMargin;

    // Add header if requested
    if (config.includeHeaders && config.headerText) {
      page.drawText(config.headerText, {
        x: leftMargin,
        y: height - topMargin + 20,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Add page number if requested
    if (config.includePageNumbers) {
      const pageNumText = pageNumber.toString();
      const textWidth = font.widthOfTextAtSize(pageNumText, 9);

      page.drawText(pageNumText, {
        x: isLeftPage ? leftMargin : width - rightMargin - textWidth,
        y: bottomMargin - 30,
        size: 9,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Add type-specific content
    switch (config.type) {
      case 'planner':
        await this.addPlannerContent(page, config, leftMargin, topMargin, contentWidth, contentHeight, font, boldFont);
        break;
      case 'journal':
        await this.addJournalContent(page, config, leftMargin, topMargin, contentWidth, contentHeight, font);
        break;
      case 'notebook':
        await this.addNotebookContent(page, config, leftMargin, topMargin, contentWidth, contentHeight);
        break;
      case 'logbook':
        await this.addLogbookContent(page, config, leftMargin, topMargin, contentWidth, contentHeight, font);
        break;
      case 'tracker':
        await this.addTrackerContent(page, config, leftMargin, topMargin, contentWidth, contentHeight, font, boldFont);
        break;
      case 'workbook':
        await this.addWorkbookContent(page, config, leftMargin, topMargin, contentWidth, contentHeight, font, boldFont);
        break;
    }
  }

  /**
   * Add planner content
   */
  private async addPlannerContent(
    page: PDFPage,
    config: KDPInteriorConfig,
    x: number,
    y: number,
    width: number,
    height: number,
    font: PDFFont,
    boldFont: PDFFont
  ): Promise<void> {
    const startY = page.getHeight() - y - 40;

    if (config.subtype === 'daily') {
      // Daily planner layout
      page.drawText('Date: _________________', { x, y: startY, size: 11, font: boldFont });

      // Time slots
      const timeSlots = [
        '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
        '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
      ];

      const slotHeight = Math.min(35, (height - 100) / timeSlots.length);

      timeSlots.forEach((time, index) => {
        const yPos = startY - 40 - index * slotHeight;
        page.drawText(time, { x, y: yPos, size: 9, font });
        page.drawLine({
          start: { x: x + 70, y: yPos - 5 },
          end: { x: x + width - 10, y: yPos - 5 },
          color: rgb(0.8, 0.8, 0.8),
        });
      });

    } else if (config.subtype === 'weekly') {
      // Weekly planner layout
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const dayHeight = (height - 60) / days.length;

      days.forEach((day, index) => {
        const yPos = startY - index * dayHeight;
        page.drawText(day, { x, y: yPos, size: 10, font: boldFont });

        // Draw lines for notes
        for (let i = 1; i < 4; i++) {
          page.drawLine({
            start: { x, y: yPos - i * 15 },
            end: { x: x + width, y: yPos - i * 15 },
            color: rgb(0.9, 0.9, 0.9),
          });
        }
      });

    } else if (config.subtype === 'monthly') {
      // Monthly calendar grid
      page.drawText('Month: _________________', { x, y: startY, size: 11, font: boldFont });

      const gridY = startY - 40;
      const cellWidth = width / 7;
      const cellHeight = (height - 100) / 6;

      // Draw grid
      for (let row = 0; row <= 6; row++) {
        const y1 = gridY - row * cellHeight;
        page.drawLine({
          start: { x, y: y1 },
          end: { x: x + width, y: y1 },
          color: rgb(0.7, 0.7, 0.7),
        });
      }

      for (let col = 0; col <= 7; col++) {
        const x1 = x + col * cellWidth;
        page.drawLine({
          start: { x: x1, y: gridY },
          end: { x: x1, y: gridY - 6 * cellHeight },
          color: rgb(0.7, 0.7, 0.7),
        });
      }

      // Day headers
      const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      dayHeaders.forEach((day, index) => {
        const dayX = x + index * cellWidth + cellWidth / 2 - font.widthOfTextAtSize(day, 9) / 2;
        page.drawText(day, { x: dayX, y: gridY + 10, size: 9, font: boldFont });
      });
    }
  }

  /**
   * Add journal content
   */
  private async addJournalContent(
    page: PDFPage,
    config: KDPInteriorConfig,
    x: number,
    y: number,
    width: number,
    height: number,
    font: PDFFont
  ): Promise<void> {
    const startY = page.getHeight() - y - 20;

    if (config.subtype === 'lined') {
      // Lined journal pages
      const lineSpacing = 20;
      const numLines = Math.floor((height - 40) / lineSpacing);

      for (let i = 0; i < numLines; i++) {
        const yPos = startY - i * lineSpacing;
        page.drawLine({
          start: { x, y: yPos },
          end: { x: x + width, y: yPos },
          color: rgb(0.85, 0.85, 0.85),
          thickness: 0.5,
        });
      }

    } else if (config.subtype === 'dotted') {
      // Dotted journal pages
      const dotSpacing = 15;
      const dotsWide = Math.floor(width / dotSpacing);
      const dotsHigh = Math.floor((height - 40) / dotSpacing);

      for (let row = 0; row < dotsHigh; row++) {
        for (let col = 0; col < dotsWide; col++) {
          page.drawCircle({
            x: x + col * dotSpacing,
            y: startY - row * dotSpacing,
            size: 1,
            color: rgb(0.7, 0.7, 0.7),
          });
        }
      }

    } else if (config.subtype === 'grid') {
      // Grid journal pages
      const gridSpacing = 20;
      const linesWide = Math.floor(width / gridSpacing);
      const linesHigh = Math.floor((height - 40) / gridSpacing);

      // Vertical lines
      for (let i = 0; i <= linesWide; i++) {
        const xPos = x + i * gridSpacing;
        page.drawLine({
          start: { x: xPos, y: startY },
          end: { x: xPos, y: startY - linesHigh * gridSpacing },
          color: rgb(0.9, 0.9, 0.9),
          thickness: 0.5,
        });
      }

      // Horizontal lines
      for (let i = 0; i <= linesHigh; i++) {
        const yPos = startY - i * gridSpacing;
        page.drawLine({
          start: { x, y: yPos },
          end: { x: x + linesWide * gridSpacing, y: yPos },
          color: rgb(0.9, 0.9, 0.9),
          thickness: 0.5,
        });
      }
    }
    // 'blank' subtype has no content added
  }

  /**
   * Add notebook content
   */
  private async addNotebookContent(
    page: PDFPage,
    config: KDPInteriorConfig,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    // Wide-ruled notebook lines
    const lineSpacing = 22;
    const startY = page.getHeight() - y - 20;
    const numLines = Math.floor((height - 40) / lineSpacing);

    for (let i = 0; i < numLines; i++) {
      const yPos = startY - i * lineSpacing;
      page.drawLine({
        start: { x, y: yPos },
        end: { x: x + width, y: yPos },
        color: rgb(0.85, 0.85, 0.85),
        thickness: 0.5,
      });
    }

    // Add margin line
    page.drawLine({
      start: { x: x + 50, y: startY + 10 },
      end: { x: x + 50, y: startY - numLines * lineSpacing },
      color: rgb(1, 0.7, 0.7),
      thickness: 1,
    });
  }

  /**
   * Add logbook content
   */
  private async addLogbookContent(
    page: PDFPage,
    config: KDPInteriorConfig,
    x: number,
    y: number,
    width: number,
    height: number,
    font: PDFFont
  ): Promise<void> {
    const startY = page.getHeight() - y - 20;

    // Simple table format
    const headers = ['Date', 'Time', 'Event/Entry', 'Notes'];
    const colWidths = [width * 0.15, width * 0.15, width * 0.35, width * 0.35];
    const rowHeight = 30;

    // Draw headers
    let currentX = x;
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: currentX + 5,
        y: startY - 5,
        size: 9,
        font: font,
      });
      currentX += colWidths[index];
    });

    // Draw table grid
    const numRows = Math.floor((height - 50) / rowHeight);

    for (let row = 0; row <= numRows; row++) {
      const yPos = startY - 15 - row * rowHeight;
      page.drawLine({
        start: { x, y: yPos },
        end: { x: x + width, y: yPos },
        color: rgb(0.7, 0.7, 0.7),
        thickness: 0.5,
      });
    }

    currentX = x;
    for (let col = 0; col <= headers.length; col++) {
      page.drawLine({
        start: { x: currentX, y: startY },
        end: { x: currentX, y: startY - 15 - numRows * rowHeight },
        color: rgb(0.7, 0.7, 0.7),
        thickness: 0.5,
      });
      if (col < headers.length) {
        currentX += colWidths[col];
      }
    }
  }

  /**
   * Add tracker content
   */
  private async addTrackerContent(
    page: PDFPage,
    config: KDPInteriorConfig,
    x: number,
    y: number,
    width: number,
    height: number,
    font: PDFFont,
    boldFont: PDFFont
  ): Promise<void> {
    const startY = page.getHeight() - y - 20;

    // Habit tracker style - 31 days
    page.drawText('Habit: _______________  Month: _______________', {
      x,
      y: startY,
      size: 10,
      font: boldFont,
    });

    const gridY = startY - 40;
    const cellSize = Math.min(width / 31, 20);
    const cols = 31;
    const rows = 10;

    // Draw grid for tracking
    for (let row = 0; row <= rows; row++) {
      const yPos = gridY - row * cellSize;
      page.drawLine({
        start: { x, y: yPos },
        end: { x: x + cols * cellSize, y: yPos },
        color: rgb(0.7, 0.7, 0.7),
        thickness: 0.5,
      });
    }

    for (let col = 0; col <= cols; col++) {
      const xPos = x + col * cellSize;
      page.drawLine({
        start: { x: xPos, y: gridY },
        end: { x: xPos, y: gridY - rows * cellSize },
        color: rgb(0.7, 0.7, 0.7),
        thickness: 0.5,
      });
    }

    // Add day numbers
    for (let day = 1; day <= 31; day++) {
      const dayStr = day.toString();
      const textWidth = font.widthOfTextAtSize(dayStr, 7);
      const xPos = x + (day - 1) * cellSize + cellSize / 2 - textWidth / 2;

      page.drawText(dayStr, {
        x: xPos,
        y: gridY + 5,
        size: 7,
        font: font,
      });
    }
  }

  /**
   * Add workbook content
   */
  private async addWorkbookContent(
    page: PDFPage,
    config: KDPInteriorConfig,
    x: number,
    y: number,
    width: number,
    height: number,
    font: PDFFont,
    boldFont: PDFFont
  ): Promise<void> {
    const startY = page.getHeight() - y - 20;

    // Exercise/worksheet style
    page.drawText('Exercise: ___', {
      x,
      y: startY,
      size: 10,
      font: boldFont,
    });

    // Lined area for answers
    const lineSpacing = 25;
    const numLines = Math.floor((height - 80) / lineSpacing);

    for (let i = 0; i < numLines; i++) {
      const yPos = startY - 40 - i * lineSpacing;
      page.drawLine({
        start: { x, y: yPos },
        end: { x: x + width, y: yPos },
        color: rgb(0.85, 0.85, 0.85),
        thickness: 0.5,
      });
    }
  }

  /**
   * Generate metadata
   */
  private generateMetadata(config: KDPInteriorConfig, pdfPath: string): KDPInterior {
    return {
      title: this.generateTitle(config),
      description: this.generateDescription(config),
      interiorPDF: pdfPath,
      pageCount: config.pageCount,
      trimSize: config.size,
      bleedSetting: 'With Bleed',
      paperType: config.paperType,
      kdpCategories: this.generateCategories(config),
      price: this.calculatePrice(config),
    };
  }

  /**
   * Generate title
   */
  private generateTitle(config: KDPInteriorConfig): string {
    const typeCapitalized = config.type.charAt(0).toUpperCase() + config.type.slice(1);
    const subtype = config.subtype ? ` - ${config.subtype.charAt(0).toUpperCase() + config.subtype.slice(1)}` : '';

    return `${typeCapitalized}${subtype} - ${config.pageCount} Pages`;
  }

  /**
   * Generate description
   */
  private generateDescription(config: KDPInteriorConfig): string {
    return `
High-quality ${config.type} interior with ${config.pageCount} pages.

Specifications:
- Size: ${config.size} inches
- Pages: ${config.pageCount}
- Paper: ${config.paperType === 'white' ? 'White' : 'Cream'}
- With bleed for professional printing
- KDP-ready format

Perfect for Amazon KDP publishing!
    `.trim();
  }

  /**
   * Generate KDP categories
   */
  private generateCategories(config: KDPInteriorConfig): string[] {
    const baseCategories = ['Books > Self-Help'];

    const typeCategories: Record<string, string[]> = {
      planner: ['Books > Calendars > Planners', 'Books > Business & Money > Skills'],
      journal: ['Books > Self-Help > Journals', 'Books > Literature & Fiction > Essays & Correspondence'],
      notebook: ['Books > Education & Teaching', 'Office Products > Notebooks & Pads'],
      logbook: ['Books > Business & Money > Management', 'Books > Professional & Technical'],
      tracker: ['Books > Health, Fitness & Dieting', 'Books > Self-Help > Personal Transformation'],
      workbook: ['Books > Education & Teaching > Studying & Workbooks', 'Books > Test Preparation'],
    };

    return [...baseCategories, ...(typeCategories[config.type] || [])];
  }

  /**
   * Calculate KDP pricing
   */
  private calculatePrice(config: KDPInteriorConfig): number {
    const basePrices: Record<number, number> = {
      50: 2.99,
      100: 4.99,
      120: 5.99,
      150: 6.99,
      200: 8.99,
    };

    // Find closest page count
    const pageCounts = Object.keys(basePrices).map(Number).sort((a, b) => a - b);
    const closestPageCount = pageCounts.find(count => config.pageCount <= count) || pageCounts[pageCounts.length - 1];

    return basePrices[closestPageCount];
  }

  /**
   * Helper: Sanitize filename
   */
  private sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export default KDPInteriorGenerator;
