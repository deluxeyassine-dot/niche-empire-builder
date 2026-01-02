import { GeminiService } from '../../services/GeminiService';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Clipart Generator
 *
 * Generates high-quality transparent PNG clipart for:
 * - Digital scrapbooking
 * - Crafting projects
 * - Commercial use bundles
 * - Print-on-demand designs
 *
 * Features:
 * - Transparent backgrounds
 * - Multiple resolutions
 * - Bundle generation
 * - Commercial license options
 */

export interface ClipartConfig {
  theme: string;
  style: 'cute' | 'realistic' | 'watercolor' | 'hand-drawn' | 'cartoon' | 'vintage' | 'modern' | 'doodle';
  count: number; // Number of clipart elements to generate
  colorScheme?: string[];
  includeVariations?: boolean; // Generate color variations
  resolution?: 'standard' | 'high' | 'ultra'; // 2000px, 4000px, 6000px
  subjects?: string[]; // Specific subjects to include
}

export interface ClipartElement {
  id: string;
  name: string;
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  fileSize: number;
  variations?: string[]; // Paths to color variations
}

export interface ClipartBundle {
  title: string;
  description: string;
  tags: string[];
  elements: ClipartElement[];
  previewImage: string;
  totalElements: number;
  price: number;
  licenseType: 'personal' | 'commercial';
}

export class ClipartGenerator {
  private gemini: GeminiService;
  private outputDir: string;

  private readonly RESOLUTIONS = {
    standard: 2000,
    high: 4000,
    ultra: 6000,
  };

  constructor(apiKey: string, outputDir = './output/clipart') {
    this.gemini = new GeminiService(apiKey);
    this.outputDir = outputDir;
  }

  /**
   * Generate complete clipart bundle
   */
  async generateClipartBundle(config: ClipartConfig): Promise<ClipartBundle> {
    // Create output directory
    const bundleDir = path.join(this.outputDir, this.sanitizeFilename(config.theme));
    await fs.mkdir(bundleDir, { recursive: true });

    console.log(`🎨 Generating ${config.count} clipart elements...`);

    // Generate individual clipart elements
    const elements: ClipartElement[] = [];

    for (let i = 0; i < config.count; i++) {
      console.log(`  Creating element ${i + 1}/${config.count}...`);

      const elementConfig = this.createElementConfig(config, i);
      const element = await this.generateClipartElement(elementConfig, bundleDir, i + 1);

      elements.push(element);

      // Generate color variations if requested
      if (config.includeVariations && config.colorScheme && config.colorScheme.length > 1) {
        element.variations = await this.generateColorVariations(
          element.path,
          config.colorScheme,
          bundleDir,
          i + 1
        );
      }
    }

    // Generate preview/showcase image
    console.log('📸 Creating bundle preview...');
    const previewImage = await this.generatePreview(elements, bundleDir);

    // Generate bundle metadata
    const bundle = this.generateBundleMetadata(config, elements, previewImage);

    console.log('✅ Clipart bundle generated successfully!');
    console.log(`📦 Total elements: ${elements.length}`);
    console.log(`🎨 Variations: ${elements.reduce((sum, e) => sum + (e.variations?.length || 0), 0)}`);

    return bundle;
  }

  /**
   * Create configuration for individual element
   */
  private createElementConfig(config: ClipartConfig, index: number): string {
    let prompt = `Create a ${config.style} style clipart illustration of `;

    // Use specific subject if provided
    if (config.subjects && config.subjects[index]) {
      prompt += config.subjects[index];
    } else {
      prompt += `a ${config.theme} element (variation ${index + 1})`;
    }

    prompt += `. `;

    // Style-specific instructions
    switch (config.style) {
      case 'cute':
        prompt += 'Make it adorable with big eyes, soft features, and kawaii aesthetics. ';
        break;
      case 'realistic':
        prompt += 'Create with realistic details, accurate proportions, and natural textures. ';
        break;
      case 'watercolor':
        prompt += 'Use soft watercolor textures, gentle blending, and artistic brush strokes. ';
        break;
      case 'hand-drawn':
        prompt += 'Give it a hand-drawn appearance with sketch lines and artistic imperfections. ';
        break;
      case 'cartoon':
        prompt += 'Make it playful with bold outlines, bright colors, and exaggerated features. ';
        break;
      case 'vintage':
        prompt += 'Style with retro colors, classic motifs, and nostalgic elements. ';
        break;
      case 'modern':
        prompt += 'Use clean lines, contemporary aesthetics, and minimalist design. ';
        break;
      case 'doodle':
        prompt += 'Create with simple doodle style, whimsical lines, and fun details. ';
        break;
    }

    prompt += 'IMPORTANT: The image must have a completely transparent background. ';
    prompt += 'The subject should be centered and clearly defined. ';

    if (config.colorScheme && config.colorScheme.length > 0) {
      prompt += `Use colors from this palette: ${config.colorScheme.join(', ')}. `;
    }

    const resolution = this.RESOLUTIONS[config.resolution || 'high'];
    prompt += `Create at ${resolution}px resolution for high-quality printing.`;

    return prompt;
  }

  /**
   * Generate single clipart element
   */
  private async generateClipartElement(
    prompt: string,
    outputDir: string,
    index: number
  ): Promise<ClipartElement> {
    const filename = `clipart-${String(index).padStart(3, '0')}.png`;
    const filepath = path.join(outputDir, filename);

    // TODO: Replace with actual AI image generation
    // For demo, create placeholder
    const size = 4000;
    await this.createPlaceholderImage(filepath, size, size, true);

    // Create thumbnail
    const thumbnailPath = path.join(outputDir, `thumb-${String(index).padStart(3, '0')}.png`);
    await sharp(filepath)
      .resize(500, 500, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(thumbnailPath);

    // Get file info
    const metadata = await sharp(filepath).metadata();
    const stats = await fs.stat(filepath);

    return {
      id: `element-${index}`,
      name: `Clipart ${index}`,
      path: filepath,
      thumbnail: thumbnailPath,
      width: metadata.width || size,
      height: metadata.height || size,
      fileSize: stats.size,
    };
  }

  /**
   * Generate color variations of an element
   */
  private async generateColorVariations(
    originalPath: string,
    colorScheme: string[],
    outputDir: string,
    index: number
  ): Promise<string[]> {
    const variations: string[] = [];

    for (let i = 0; i < Math.min(colorScheme.length, 3); i++) {
      const color = colorScheme[i];
      const variationPath = path.join(
        outputDir,
        `clipart-${String(index).padStart(3, '0')}-var${i + 1}.png`
      );

      // Apply color tint to create variation
      await sharp(originalPath)
        .tint(this.hexToRgb(color))
        .toFile(variationPath);

      variations.push(variationPath);
    }

    return variations;
  }

  /**
   * Generate bundle preview image
   */
  private async generatePreview(elements: ClipartElement[], outputDir: string): Promise<string> {
    const previewPath = path.join(outputDir, 'preview.jpg');

    // Create a grid layout of elements
    const gridSize = Math.ceil(Math.sqrt(Math.min(elements.length, 16)));
    const elementSize = 500;
    const padding = 50;
    const canvasSize = gridSize * (elementSize + padding) + padding;

    // Create white background
    const background = await sharp({
      create: {
        width: canvasSize,
        height: canvasSize,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .png()
      .toBuffer();

    // Composite elements
    const composites = [];
    for (let i = 0; i < Math.min(elements.length, gridSize * gridSize); i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      const resized = await sharp(elements[i].path)
        .resize(elementSize, elementSize, { fit: 'inside', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .toBuffer();

      composites.push({
        input: resized,
        top: padding + row * (elementSize + padding),
        left: padding + col * (elementSize + padding),
      });
    }

    await sharp(background)
      .composite(composites)
      .jpeg({ quality: 90 })
      .toFile(previewPath);

    return previewPath;
  }

  /**
   * Generate bundle metadata
   */
  private generateBundleMetadata(
    config: ClipartConfig,
    elements: ClipartElement[],
    previewImage: string
  ): ClipartBundle {
    const totalElements = elements.length + elements.reduce((sum, e) => sum + (e.variations?.length || 0), 0);

    return {
      title: this.generateTitle(config, totalElements),
      description: this.generateDescription(config, totalElements),
      tags: this.generateTags(config),
      elements,
      previewImage,
      totalElements,
      price: this.calculatePrice(totalElements, config.resolution || 'high'),
      licenseType: 'commercial',
    };
  }

  /**
   * Generate bundle title
   */
  private generateTitle(config: ClipartConfig, totalElements: number): string {
    const styleCapitalized = config.style.charAt(0).toUpperCase() + config.style.slice(1);
    const themeCapitalized = config.theme.charAt(0).toUpperCase() + config.theme.slice(1);

    return `${styleCapitalized} ${themeCapitalized} Clipart Bundle - ${totalElements} PNG Elements - Commercial Use`;
  }

  /**
   * Generate bundle description
   */
  private generateDescription(config: ClipartConfig, totalElements: number): string {
    const resolution = this.RESOLUTIONS[config.resolution || 'high'];

    return `
🎨 ${config.style.toUpperCase()} ${config.theme.toUpperCase()} CLIPART BUNDLE

Perfect for crafters, designers, and small business owners!

✨ WHAT'S INCLUDED:
• ${totalElements} high-quality PNG files
• Transparent backgrounds
• ${resolution}px high-resolution images
• Perfect for printing and digital use
${config.includeVariations ? '• Multiple color variations included' : ''}

📐 SPECIFICATIONS:
• Format: PNG with transparent background
• Resolution: ${resolution}x${resolution}px (300 DPI)
• Color Mode: RGB
• File Size: Optimized for easy download

🎯 PERFECT FOR:
• Digital scrapbooking
• Card making and invitations
• Party decorations
• Print-on-demand products
• Social media graphics
• Web design
• Crafting projects
• Small business branding

💼 COMMERCIAL LICENSE:
• Use in unlimited personal and commercial projects
• Create physical products to sell
• Use in client work
• No attribution required
• Cannot resell or redistribute as digital files

🎨 STYLE: ${config.style}

📦 INSTANT DOWNLOAD
No physical items will be shipped. Files are available immediately after purchase.

⚡ EASY TO USE:
Simply download, unzip, and start creating! Compatible with all major design software including Photoshop, Illustrator, Canva, Cricut Design Space, and more.

🌟 HIGH QUALITY GUARANTEE:
All clipart elements are carefully created to ensure crisp, clear images that look amazing in any project.
    `.trim();
  }

  /**
   * Generate bundle tags
   */
  private generateTags(config: ClipartConfig): string[] {
    const baseTags = [
      'clipart',
      'png clipart',
      'transparent png',
      'digital download',
      'instant download',
      'commercial use',
      'clipart bundle',
    ];

    const styleTags = [
      config.style + ' clipart',
      config.style + ' art',
    ];

    const themeTags = [
      config.theme + ' clipart',
      config.theme,
      config.theme + ' png',
    ];

    const useTags = [
      'scrapbooking',
      'crafting',
      'diy',
    ];

    return [...baseTags, ...styleTags, ...themeTags, ...useTags].slice(0, 13);
  }

  /**
   * Calculate bundle price
   */
  private calculatePrice(totalElements: number, resolution: string): number {
    let basePrice = 4.99;

    // Price per element
    const perElementPrice = 0.30;

    // Resolution multiplier
    const resolutionMultiplier = {
      standard: 1.0,
      high: 1.3,
      ultra: 1.5,
    }[resolution];

    return Math.max(
      basePrice,
      Math.round((basePrice + totalElements * perElementPrice) * resolutionMultiplier * 100) / 100
    );
  }

  /**
   * Batch generate multiple clipart bundles
   */
  async generateMultipleBundles(configs: ClipartConfig[]): Promise<ClipartBundle[]> {
    const bundles: ClipartBundle[] = [];

    for (const config of configs) {
      const bundle = await this.generateClipartBundle(config);
      bundles.push(bundle);
    }

    return bundles;
  }

  /**
   * Generate trending clipart bundles
   */
  async generateTrendingBundles(count = 3): Promise<ClipartBundle[]> {
    const trendingConfigs: ClipartConfig[] = [
      {
        theme: 'Spring Flowers',
        style: 'watercolor',
        count: 20,
        colorScheme: ['#FFB6C1', '#FF69B4', '#98FB98'],
        includeVariations: true,
        resolution: 'high',
        subjects: ['rose', 'tulip', 'daisy', 'sunflower', 'lily'],
      },
      {
        theme: 'Cute Animals',
        style: 'cute',
        count: 15,
        colorScheme: ['#FFC0CB', '#87CEEB', '#FFD700'],
        includeVariations: false,
        resolution: 'high',
        subjects: ['bunny', 'cat', 'dog', 'bear', 'fox'],
      },
      {
        theme: 'Boho Elements',
        style: 'hand-drawn',
        count: 25,
        colorScheme: ['#D2691E', '#F5DEB3', '#8B4513'],
        includeVariations: true,
        resolution: 'ultra',
        subjects: ['feather', 'dreamcatcher', 'arrow', 'moon', 'sun'],
      },
    ];

    return this.generateMultipleBundles(trendingConfigs.slice(0, count));
  }

  /**
   * Helper: Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
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

  /**
   * Helper: Create placeholder image
   */
  private async createPlaceholderImage(
    outputPath: string,
    width: number,
    height: number,
    transparent = true
  ): Promise<void> {
    const background = transparent
      ? { r: 0, g: 0, b: 0, alpha: 0 }
      : { r: 240, g: 240, b: 240, alpha: 1 };

    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background,
      },
    })
      .png()
      .toFile(outputPath);
  }
}

export default ClipartGenerator;
