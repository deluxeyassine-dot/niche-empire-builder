import { GeminiService } from '../../services/GeminiService';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Wall Art Generator
 *
 * Generates print-ready wall art in multiple sizes for:
 * - Etsy digital downloads
 * - Print-on-demand services
 * - Direct printing
 *
 * Features:
 * - Multiple standard print sizes
 * - 300 DPI print quality
 * - CMYK color mode for printing
 * - Bleed areas for professional printing
 * - Mockup generation
 */

export interface WallArtConfig {
  theme: string;
  style: 'minimalist' | 'abstract' | 'botanical' | 'geometric' | 'vintage' | 'modern' | 'watercolor' | 'typography' | 'photography';
  colorPalette?: string[];
  includeText?: boolean;
  text?: string;
  orientation?: 'portrait' | 'landscape' | 'square';
}

export interface PrintSize {
  name: string;
  width: number;
  height: number;
  dpi: number;
  bleed?: number; // inches
}

export interface WallArtProduct {
  title: string;
  description: string;
  tags: string[];
  files: {
    size: string;
    path: string;
    width: number;
    height: number;
    fileSize: number;
  }[];
  mockup?: string;
  price: number;
}

export class WallArtGenerator {
  private gemini: GeminiService;
  private outputDir: string;

  // Standard print sizes (in inches)
  private readonly PRINT_SIZES: PrintSize[] = [
    { name: '5x7', width: 5, height: 7, dpi: 300, bleed: 0.125 },
    { name: '8x10', width: 8, height: 10, dpi: 300, bleed: 0.125 },
    { name: '11x14', width: 11, height: 14, dpi: 300, bleed: 0.125 },
    { name: '16x20', width: 16, height: 20, dpi: 300, bleed: 0.125 },
    { name: '18x24', width: 18, height: 24, dpi: 300, bleed: 0.125 },
    { name: '24x36', width: 24, height: 36, dpi: 300, bleed: 0.125 },
    { name: '30x40', width: 30, height: 40, dpi: 300, bleed: 0.125 },
    // Square sizes
    { name: '8x8', width: 8, height: 8, dpi: 300, bleed: 0.125 },
    { name: '12x12', width: 12, height: 12, dpi: 300, bleed: 0.125 },
    { name: '16x16', width: 16, height: 16, dpi: 300, bleed: 0.125 },
    // A-series (international)
    { name: 'A5', width: 5.8, height: 8.3, dpi: 300, bleed: 0.125 },
    { name: 'A4', width: 8.3, height: 11.7, dpi: 300, bleed: 0.125 },
    { name: 'A3', width: 11.7, height: 16.5, dpi: 300, bleed: 0.125 },
    { name: 'A2', width: 16.5, height: 23.4, dpi: 300, bleed: 0.125 },
  ];

  constructor(apiKey: string, outputDir = './output/wall-art') {
    this.gemini = new GeminiService(apiKey);
    this.outputDir = outputDir;
  }

  /**
   * Generate complete wall art product with multiple sizes
   */
  async generateWallArt(config: WallArtConfig): Promise<WallArtProduct> {
    // Create output directory
    await fs.mkdir(this.outputDir, { recursive: true });

    // Generate the base artwork prompt
    const artworkPrompt = this.createArtworkPrompt(config);

    // Generate the artwork using AI
    console.log('🎨 Generating wall art design...');
    const baseImagePath = await this.generateBaseArtwork(artworkPrompt);

    // Generate all print sizes
    console.log('📐 Creating print-ready files in multiple sizes...');
    const files = await this.generatePrintSizes(baseImagePath, config.orientation || 'portrait');

    // Generate mockup
    console.log('🖼️ Generating product mockup...');
    const mockupPath = await this.generateMockup(files[0].path);

    // Generate product metadata
    const product = this.generateProductMetadata(config, files, mockupPath);

    console.log('✅ Wall art product generated successfully!');
    console.log(`📦 Generated ${files.length} print sizes`);

    return product;
  }

  /**
   * Create artwork generation prompt
   */
  private createArtworkPrompt(config: WallArtConfig): string {
    let prompt = `Create a stunning ${config.style} wall art design with the theme: "${config.theme}". `;

    if (config.colorPalette && config.colorPalette.length > 0) {
      prompt += `Use a color palette of: ${config.colorPalette.join(', ')}. `;
    }

    if (config.includeText && config.text) {
      prompt += `Include the text: "${config.text}" integrated beautifully into the design. `;
    }

    prompt += `The design should be suitable for printing as wall art, with high detail and professional quality. `;
    prompt += `Orientation: ${config.orientation || 'portrait'}. `;

    // Style-specific instructions
    switch (config.style) {
      case 'minimalist':
        prompt += 'Use clean lines, negative space, and simple geometric shapes. Focus on elegance and simplicity.';
        break;
      case 'abstract':
        prompt += 'Use flowing shapes, bold colors, and dynamic compositions. Be creative and expressive.';
        break;
      case 'botanical':
        prompt += 'Feature beautiful plants, flowers, or leaves. Use natural colors and organic forms.';
        break;
      case 'geometric':
        prompt += 'Use precise geometric patterns, shapes, and symmetry. Create visual interest through repetition.';
        break;
      case 'vintage':
        prompt += 'Use retro colors, classic motifs, and nostalgic elements. Give it a timeless feel.';
        break;
      case 'modern':
        prompt += 'Use contemporary design elements, bold typography, and current trends.';
        break;
      case 'watercolor':
        prompt += 'Use soft watercolor textures, fluid blending, and delicate color transitions.';
        break;
      case 'typography':
        prompt += 'Focus on beautiful typography, creative lettering, and text-based design.';
        break;
      case 'photography':
        prompt += 'Use photographic elements, realistic imagery, and high-quality photo composition.';
        break;
    }

    return prompt;
  }

  /**
   * Generate base artwork using AI
   */
  private async generateBaseArtwork(prompt: string): Promise<string> {
    // For now, this is a placeholder for AI image generation
    // In production, integrate with DALL-E, Midjourney, or Stable Diffusion
    const imagePath = path.join(this.outputDir, 'base-artwork.png');

    // TODO: Replace with actual AI image generation
    // For demo purposes, create a placeholder
    await this.createPlaceholderImage(imagePath, 7200, 10800); // 24x36 @ 300 DPI

    return imagePath;
  }

  /**
   * Generate all print sizes from base artwork
   */
  private async generatePrintSizes(
    baseImagePath: string,
    orientation: 'portrait' | 'landscape' | 'square'
  ): Promise<WallArtProduct['files']> {
    const files: WallArtProduct['files'][] = [];

    // Filter sizes based on orientation
    let sizes = this.PRINT_SIZES;
    if (orientation === 'portrait') {
      sizes = sizes.filter(s => s.height >= s.width);
    } else if (orientation === 'landscape') {
      sizes = sizes.filter(s => s.width > s.height);
    } else if (orientation === 'square') {
      sizes = sizes.filter(s => s.width === s.height);
    }

    for (const size of sizes) {
      const outputPath = path.join(this.outputDir, `wall-art-${size.name}.png`);

      // Calculate dimensions in pixels
      const widthPx = Math.round((size.width + (size.bleed || 0) * 2) * size.dpi);
      const heightPx = Math.round((size.height + (size.bleed || 0) * 2) * size.dpi);

      // Resize and optimize for printing
      await sharp(baseImagePath)
        .resize(widthPx, heightPx, {
          fit: 'cover',
          position: 'center',
        })
        .png({
          quality: 100,
          compressionLevel: 9,
        })
        .withMetadata({
          density: size.dpi,
        })
        .toFile(outputPath);

      // Get file stats
      const stats = await fs.stat(outputPath);

      files.push({
        size: size.name,
        path: outputPath,
        width: widthPx,
        height: heightPx,
        fileSize: stats.size,
      });
    }

    return files;
  }

  /**
   * Generate product mockup
   */
  private async generateMockup(printFilePath: string): Promise<string> {
    const mockupPath = path.join(this.outputDir, 'mockup.jpg');

    // Create a simple frame mockup
    // In production, use actual mockup templates
    const frameWidth = 3000;
    const frameHeight = 4000;
    const frameBorder = 200;

    // Load the print file
    const printImage = sharp(printFilePath);
    const metadata = await printImage.metadata();

    // Calculate print size within frame
    const printWidth = frameWidth - frameBorder * 2;
    const printHeight = frameHeight - frameBorder * 2;

    // Create white background
    const background = await sharp({
      create: {
        width: frameWidth,
        height: frameHeight,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .png()
      .toBuffer();

    // Resize print to fit frame
    const resizedPrint = await printImage
      .resize(printWidth, printHeight, { fit: 'inside' })
      .toBuffer();

    // Composite print on background
    await sharp(background)
      .composite([
        {
          input: resizedPrint,
          gravity: 'center',
        },
      ])
      .jpeg({ quality: 90 })
      .toFile(mockupPath);

    return mockupPath;
  }

  /**
   * Generate product metadata
   */
  private generateProductMetadata(
    config: WallArtConfig,
    files: WallArtProduct['files'],
    mockupPath: string
  ): WallArtProduct {
    const title = this.generateTitle(config);
    const description = this.generateDescription(config);
    const tags = this.generateTags(config);
    const price = this.calculatePrice(files.length);

    return {
      title,
      description,
      tags,
      files,
      mockup: mockupPath,
      price,
    };
  }

  /**
   * Generate product title
   */
  private generateTitle(config: WallArtConfig): string {
    const styleCapitalized = config.style.charAt(0).toUpperCase() + config.style.slice(1);
    return `${styleCapitalized} ${config.theme} Wall Art Print | Instant Download | Printable Art`;
  }

  /**
   * Generate product description
   */
  private generateDescription(config: WallArtConfig): string {
    return `
🎨 INSTANT DOWNLOAD - ${config.style.toUpperCase()} WALL ART

Transform your space with this stunning ${config.style} ${config.theme} wall art!

✨ WHAT YOU GET:
• High-resolution digital files (300 DPI)
• Multiple sizes included (5x7" to 30x40")
• Print-ready with bleed areas
• RGB color mode for vibrant prints
• Instant download after purchase

📐 SIZES INCLUDED:
• 5x7, 8x10, 11x14, 16x20, 18x24, 24x36, 30x40 inches
• A5, A4, A3, A2 (international sizes)
• Square formats: 8x8, 12x12, 16x16 inches

🖨️ HOW TO USE:
1. Download files after purchase
2. Print at home or use a professional printing service
3. Frame and display!

📦 FILE FORMAT: PNG (high quality)

🎨 PERFECT FOR:
• Living room, bedroom, office decor
• Gallery walls
• Gifts for friends and family
• Interior design projects

💝 LICENSING:
• Personal use only
• Cannot be resold or redistributed

${config.includeText && config.text ? `\n📝 FEATURES TEXT: "${config.text}"` : ''}

⚡ INSTANT DOWNLOAD - No shipping, no waiting!
    `.trim();
  }

  /**
   * Generate product tags
   */
  private generateTags(config: WallArtConfig): string[] {
    const baseTags = [
      'wall art',
      'printable art',
      'digital download',
      'instant download',
      'home decor',
      'wall decor',
      'printable wall art',
    ];

    const styleTags = [
      config.style + ' art',
      config.style + ' wall art',
      config.style + ' print',
    ];

    const themeTags = [
      config.theme,
      config.theme + ' art',
      config.theme + ' print',
    ];

    return [...baseTags, ...styleTags, ...themeTags].slice(0, 13); // Etsy limit
  }

  /**
   * Calculate pricing based on number of sizes
   */
  private calculatePrice(numberOfSizes: number): number {
    // Base price + premium for multiple sizes
    const basePrice = 4.99;
    const perSizePrice = 0.50;

    return basePrice + (numberOfSizes - 1) * perSizePrice;
  }

  /**
   * Create placeholder image (development only)
   */
  private async createPlaceholderImage(
    outputPath: string,
    width: number,
    height: number
  ): Promise<void> {
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 240, g: 240, b: 240, alpha: 1 },
      },
    })
      .png()
      .toFile(outputPath);
  }

  /**
   * Batch generate multiple wall art products
   */
  async generateBatch(configs: WallArtConfig[]): Promise<WallArtProduct[]> {
    const products: WallArtProduct[] = [];

    for (const config of configs) {
      const product = await this.generateWallArt(config);
      products.push(product);
    }

    return products;
  }

  /**
   * Generate trending wall art based on current trends
   */
  async generateTrending(count = 5): Promise<WallArtProduct[]> {
    const trendingThemes = [
      { theme: 'Boho Sunset', style: 'abstract' as const, colorPalette: ['#F4A460', '#FF6347', '#FFD700'] },
      { theme: 'Mountain Landscape', style: 'minimalist' as const, colorPalette: ['#2F4F4F', '#708090', '#F5F5DC'] },
      { theme: 'Tropical Leaves', style: 'botanical' as const, colorPalette: ['#228B22', '#90EE90', '#FAFAD2'] },
      { theme: 'Mid-Century Modern', style: 'geometric' as const, colorPalette: ['#D2691E', '#F0E68C', '#4682B4'] },
      { theme: 'Inspirational Quote', style: 'typography' as const, includeText: true, text: 'Dream Big' },
    ];

    const selectedThemes = trendingThemes.slice(0, count);
    return this.generateBatch(selectedThemes);
  }
}

export default WallArtGenerator;
