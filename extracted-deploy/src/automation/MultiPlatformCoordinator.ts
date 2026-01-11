/**
 * Multi-Platform Coordinator
 *
 * Master orchestration system that coordinates ALL social media platforms.
 * Manages YouTube, Instagram, TikTok, Pinterest, and future platforms
 * in one unified automation system.
 *
 * @requires All individual platform automation classes
 */

import { YouTubeAutomation } from './YouTubeAutomation';
import { InstagramAutomation } from './InstagramAutomation';
import { TikTokAutomation } from './TikTokAutomation';
import { PinterestAutomation } from './PinterestAutomation';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Platform Types
 */
export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'pinterest' | 'facebook' | 'twitter' | 'reddit' | 'linkedin';

/**
 * Multi-Platform Configuration
 */
export interface MultiPlatformConfig {
  youtube?: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    accessToken?: string;
    refreshToken?: string;
  };
  instagram?: {
    accessToken: string;
    businessAccountId: string;
  };
  tiktok?: {
    clientKey: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
    redirectUri?: string;
  };
  pinterest?: {
    accessToken?: string;
    refreshToken?: string;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  };
}

/**
 * Universal Content Format
 */
export interface UniversalContent {
  title: string;
  description: string;
  media: {
    type: 'image' | 'video';
    url?: string;
    path?: string;
    width?: number;
    height?: number;
    duration?: number; // For videos
  };
  link?: string; // Website link
  tags?: string[]; // Universal tags
  category?: string;
  brand?: string;
  // E-commerce fields
  price?: number;
  currency?: string;
  availability?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';
  productId?: string;
}

/**
 * Platform-Specific Content Adaptation
 */
export interface PlatformContent {
  platform: Platform;
  content: any; // Platform-specific format
  adaptations: {
    title?: string;
    description?: string;
    hashtags?: string[];
    imageUrl?: string;
    videoUrl?: string;
  };
}

/**
 * Post Options for All Platforms
 */
export interface PostToAllOptions {
  content: UniversalContent;
  platforms?: Platform[]; // If not specified, posts to all enabled
  scheduleTime?: Date; // Post immediately or schedule
  crossPromote?: boolean; // Mention other platforms
  adaptContent?: boolean; // Auto-adapt for each platform
}

/**
 * Schedule Options
 */
export interface ScheduleAcrossAllOptions {
  content: UniversalContent;
  platforms: Platform[];
  schedules: Array<{
    platform: Platform;
    time: Date;
  }>;
  stagger?: number; // Minutes between posts
}

/**
 * Unified Metrics
 */
export interface UnifiedMetrics {
  platform: Platform;
  impressions: number;
  engagement: number;
  clicks: number;
  saves?: number;
  shares?: number;
  comments?: number;
  likes?: number;
  views?: number;
  followers?: number;
}

/**
 * Cross-Platform Analytics
 */
export interface CrossPlatformAnalytics {
  totalReach: number;
  totalEngagement: number;
  totalClicks: number;
  platforms: UnifiedMetrics[];
  topPlatform: Platform;
  averageEngagementRate: number;
  recommendations: string[];
}

/**
 * Content Performance
 */
export interface ContentPerformance {
  contentId: string;
  title: string;
  platforms: Array<{
    platform: Platform;
    postId: string;
    performance: UnifiedMetrics;
  }>;
  totalReach: number;
  bestPerformingPlatform: Platform;
}

/**
 * Platform Optimization Recommendations
 */
export interface PlatformOptimization {
  platform: Platform;
  recommendations: Array<{
    type: 'content' | 'timing' | 'hashtags' | 'format';
    suggestion: string;
    expectedImprovement: string;
  }>;
  currentPerformance: UnifiedMetrics;
  benchmarks: {
    industry: UnifiedMetrics;
    yourBest: UnifiedMetrics;
  };
}

// ============================================================================
// Multi-Platform Coordinator Class
// ============================================================================

export class MultiPlatformCoordinator {
  private youtube?: YouTubeAutomation;
  private instagram?: InstagramAutomation;
  private tiktok?: TikTokAutomation;
  private pinterest?: PinterestAutomation;

  private enabledPlatforms: Set<Platform> = new Set();

  constructor(config: MultiPlatformConfig) {
    // Initialize YouTube
    if (config.youtube) {
      this.youtube = new YouTubeAutomation({
        clientId: config.youtube.clientId,
        clientSecret: config.youtube.clientSecret,
        redirectUri: config.youtube.redirectUri,
        accessToken: config.youtube.accessToken,
        refreshToken: config.youtube.refreshToken
      });
      this.enabledPlatforms.add('youtube');
    }

    // Initialize Instagram
    if (config.instagram) {
      this.instagram = new InstagramAutomation({
        accessToken: config.instagram.accessToken,
        businessAccountId: config.instagram.businessAccountId
      });
      this.enabledPlatforms.add('instagram');
    }

    // Initialize TikTok
    if (config.tiktok) {
      this.tiktok = new TikTokAutomation({
        clientKey: config.tiktok.clientKey,
        clientSecret: config.tiktok.clientSecret,
        accessToken: config.tiktok.accessToken,
        refreshToken: config.tiktok.refreshToken,
        redirectUri: config.tiktok.redirectUri
      });
      this.enabledPlatforms.add('tiktok');
    }

    // Initialize Pinterest
    if (config.pinterest) {
      this.pinterest = new PinterestAutomation({
        accessToken: config.pinterest.accessToken,
        refreshToken: config.pinterest.refreshToken,
        clientId: config.pinterest.clientId,
        clientSecret: config.pinterest.clientSecret,
        redirectUri: config.pinterest.redirectUri
      });
      this.enabledPlatforms.add('pinterest');
    }

    console.log(`MultiPlatformCoordinator initialized with ${this.enabledPlatforms.size} platforms:`);
    console.log([...this.enabledPlatforms].join(', '));
  }

  // ==========================================================================
  // Unified Posting Methods
  // ==========================================================================

  /**
   * Post content to all enabled platforms
   */
  public async postToAllPlatforms(options: PostToAllOptions): Promise<Map<Platform, string>> {
    const {
      content,
      platforms = [...this.enabledPlatforms],
      scheduleTime,
      crossPromote = false,
      adaptContent = true
    } = options;

    const results = new Map<Platform, string>();

    console.log(`\n📢 Posting to ${platforms.length} platforms...`);

    // Adapt content for each platform
    const adaptedContent = adaptContent
      ? this.adaptContentForPlatforms(content, platforms, crossPromote)
      : new Map();

    // Post to each platform
    for (const platform of platforms) {
      try {
        if (!this.enabledPlatforms.has(platform)) {
          console.warn(`⚠️  ${platform} not enabled, skipping...`);
          continue;
        }

        const platformContent = adaptedContent.get(platform) || content;
        let postId: string;

        switch (platform) {
          case 'youtube':
            postId = await this.postToYouTube(platformContent as UniversalContent, scheduleTime);
            break;

          case 'instagram':
            postId = await this.postToInstagram(platformContent as UniversalContent, scheduleTime);
            break;

          case 'tiktok':
            postId = await this.postToTikTok(platformContent as UniversalContent, scheduleTime);
            break;

          case 'pinterest':
            postId = await this.postToPinterest(platformContent as UniversalContent);
            break;

          default:
            console.warn(`Platform ${platform} not yet implemented`);
            continue;
        }

        results.set(platform, postId);
        console.log(`✅ ${platform}: Posted successfully (${postId})`);

        // Rate limiting between platforms
        await this.delay(2000);
      } catch (error: any) {
        console.error(`❌ ${platform}: Failed - ${error.message}`);
      }
    }

    console.log(`\n✅ Posted to ${results.size}/${platforms.length} platforms`);

    return results;
  }

  /**
   * Sync content across platforms (cross-post existing content)
   */
  public async syncContent(
    sourceContent: { platform: Platform; postId: string },
    targetPlatforms: Platform[]
  ): Promise<Map<Platform, string>> {
    console.log(`\n🔄 Syncing content from ${sourceContent.platform}...`);

    // Get content from source platform
    const content = await this.getContentFromPlatform(sourceContent);

    // Post to target platforms
    return this.postToAllPlatforms({
      content,
      platforms: targetPlatforms,
      adaptContent: true,
      crossPromote: true
    });
  }

  /**
   * Schedule content across all platforms with optimal timing
   */
  public async scheduleAcrossAll(options: ScheduleAcrossAllOptions): Promise<Map<Platform, string[]>> {
    const { content, platforms, schedules, stagger = 0 } = options;

    const results = new Map<Platform, string[]>();

    console.log(`\n📅 Scheduling content across ${platforms.length} platforms...`);

    // Group schedules by platform
    const platformSchedules = new Map<Platform, Date[]>();

    schedules.forEach(schedule => {
      const times = platformSchedules.get(schedule.platform) || [];
      times.push(schedule.time);
      platformSchedules.set(schedule.platform, times);
    });

    // Schedule on each platform
    for (const [platform, times] of platformSchedules.entries()) {
      try {
        const postIds = await this.schedulePlatform(platform, content, times, stagger);
        results.set(platform, postIds);

        console.log(`✅ ${platform}: Scheduled ${postIds.length} posts`);
      } catch (error: any) {
        console.error(`❌ ${platform}: Scheduling failed - ${error.message}`);
      }
    }

    return results;
  }

  // ==========================================================================
  // Cross-Promotion Methods
  // ==========================================================================

  /**
   * Cross-promote content between platforms
   */
  public async crossPromote(options: {
    mainPlatform: Platform;
    postId: string;
    promotionPlatforms: Platform[];
    message?: string;
  }): Promise<Map<Platform, string>> {
    const { mainPlatform, postId, promotionPlatforms, message } = options;

    console.log(`\n🔗 Cross-promoting ${mainPlatform} post across platforms...`);

    // Get platform-specific URLs
    const postUrl = this.getPostUrl(mainPlatform, postId);

    // Create promotion content
    const promotionContent: UniversalContent = {
      title: message || `New post on ${mainPlatform}!`,
      description: `Check out my latest ${mainPlatform} post! 🔥\n\n${postUrl}\n\nFollow me on all platforms for more content!`,
      media: {
        type: 'image',
        url: 'https://placeholder.com/cross-promo.jpg'
      },
      link: postUrl,
      tags: ['newpost', mainPlatform, 'followme']
    };

    // Post promotions
    return this.postToAllPlatforms({
      content: promotionContent,
      platforms: promotionPlatforms,
      crossPromote: false // Avoid recursive cross-promotion
    });
  }

  // ==========================================================================
  // Analytics & Tracking Methods
  // ==========================================================================

  /**
   * Track metrics across all platforms
   */
  public async trackAllMetrics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<CrossPlatformAnalytics> {
    console.log(`\n📊 Tracking metrics across all platforms (${timeframe})...`);

    const platformMetrics: UnifiedMetrics[] = [];

    // Collect metrics from each platform
    for (const platform of this.enabledPlatforms) {
      try {
        const metrics = await this.getPlatformMetrics(platform, timeframe);
        platformMetrics.push(metrics);
      } catch (error: any) {
        console.warn(`⚠️  Failed to get ${platform} metrics: ${error.message}`);
      }
    }

    // Calculate totals
    const totalReach = platformMetrics.reduce((sum, m) => sum + m.impressions, 0);
    const totalEngagement = platformMetrics.reduce((sum, m) => sum + m.engagement, 0);
    const totalClicks = platformMetrics.reduce((sum, m) => sum + m.clicks, 0);

    // Find top platform
    const topPlatform = platformMetrics.reduce((best, current) =>
      current.engagement > best.engagement ? current : best
    ).platform;

    // Calculate average engagement rate
    const averageEngagementRate = totalReach > 0
      ? totalEngagement / totalReach
      : 0;

    // Generate recommendations
    const recommendations = this.generateRecommendations(platformMetrics);

    return {
      totalReach,
      totalEngagement,
      totalClicks,
      platforms: platformMetrics,
      topPlatform,
      averageEngagementRate,
      recommendations
    };
  }

  /**
   * Track performance of specific content across all platforms
   */
  public async trackContentPerformance(contentId: string): Promise<ContentPerformance> {
    // This would track how the same content performs across different platforms
    // Implementation would require storing content IDs and mapping them across platforms

    return {
      contentId,
      title: 'Sample Content',
      platforms: [],
      totalReach: 0,
      bestPerformingPlatform: 'youtube'
    };
  }

  // ==========================================================================
  // Optimization Methods
  // ==========================================================================

  /**
   * Get optimization recommendations for each platform
   */
  public async optimizePerPlatform(): Promise<Map<Platform, PlatformOptimization>> {
    console.log('\n🎯 Generating platform-specific optimizations...');

    const optimizations = new Map<Platform, PlatformOptimization>();

    for (const platform of this.enabledPlatforms) {
      try {
        const optimization = await this.generatePlatformOptimization(platform);
        optimizations.set(platform, optimization);
      } catch (error: any) {
        console.warn(`⚠️  Failed to optimize ${platform}: ${error.message}`);
      }
    }

    return optimizations;
  }

  /**
   * Get best performing platform for content type
   */
  public async getBestPlatformFor(contentType: 'video' | 'image' | 'product'): Promise<Platform> {
    const metrics = await this.trackAllMetrics('month');

    // Platform recommendations by content type
    const recommendations: Record<string, Platform[]> = {
      video: ['youtube', 'tiktok', 'instagram'],
      image: ['pinterest', 'instagram'],
      product: ['pinterest', 'instagram', 'facebook']
    };

    const candidates = recommendations[contentType] || [...this.enabledPlatforms];
    const enabledCandidates = candidates.filter(p => this.enabledPlatforms.has(p));

    if (enabledCandidates.length === 0) {
      return metrics.topPlatform;
    }

    // Find best performing among candidates
    const candidateMetrics = metrics.platforms.filter(m =>
      enabledCandidates.includes(m.platform)
    );

    return candidateMetrics.reduce((best, current) =>
      current.engagement > best.engagement ? current : best
    ).platform;
  }

  // ==========================================================================
  // Content Adaptation Methods
  // ==========================================================================

  /**
   * Adapt content for each platform's requirements
   */
  private adaptContentForPlatforms(
    content: UniversalContent,
    platforms: Platform[],
    crossPromote: boolean
  ): Map<Platform, UniversalContent> {
    const adapted = new Map<Platform, UniversalContent>();

    for (const platform of platforms) {
      const platformContent = { ...content };

      // Platform-specific adaptations
      switch (platform) {
        case 'youtube':
          platformContent.title = this.adaptTitle(content.title, 100);
          platformContent.description = this.adaptDescription(content.description, 5000, crossPromote);
          platformContent.tags = this.adaptHashtags(content.tags, 500);
          break;

        case 'instagram':
          platformContent.title = this.adaptTitle(content.title, 2200);
          platformContent.description = this.adaptDescription(content.description, 2200, crossPromote);
          platformContent.tags = this.adaptHashtags(content.tags, 30);
          break;

        case 'tiktok':
          platformContent.title = this.adaptTitle(content.title, 100);
          platformContent.description = this.adaptDescription(content.description, 2200, crossPromote);
          platformContent.tags = this.adaptHashtags(content.tags, 30);
          break;

        case 'pinterest':
          platformContent.title = this.adaptTitle(content.title, 100);
          platformContent.description = this.adaptDescription(content.description, 500, crossPromote);
          platformContent.tags = this.adaptHashtags(content.tags, 20);
          break;
      }

      adapted.set(platform, platformContent);
    }

    return adapted;
  }

  /**
   * Adapt title for platform character limits
   */
  private adaptTitle(title: string, maxLength: number): string {
    if (title.length <= maxLength) {
      return title;
    }

    return title.substring(0, maxLength - 3) + '...';
  }

  /**
   * Adapt description with cross-promotion
   */
  private adaptDescription(description: string, maxLength: number, crossPromote: boolean): string {
    let adapted = description;

    if (crossPromote) {
      const platforms = [...this.enabledPlatforms].join(', ');
      adapted += `\n\n🔗 Follow me on: ${platforms}`;
    }

    if (adapted.length > maxLength) {
      adapted = adapted.substring(0, maxLength - 3) + '...';
    }

    return adapted;
  }

  /**
   * Adapt hashtags for platform limits
   */
  private adaptHashtags(tags: string[] = [], maxTags: number): string[] {
    return tags.slice(0, maxTags);
  }

  // ==========================================================================
  // Platform-Specific Posting Methods
  // ==========================================================================

  /**
   * Post to YouTube
   */
  private async postToYouTube(content: UniversalContent, scheduleTime?: Date): Promise<string> {
    if (!this.youtube || !content.media.path) {
      throw new Error('YouTube not configured or no video file');
    }

    const videoId = await this.youtube.uploadVideo(
      content.media.path,
      {
        title: content.title,
        description: content.description,
        tags: content.tags,
        privacyStatus: 'public',
        madeForKids: false,
        categoryId: '22'
      }
    );

    return videoId;
  }

  /**
   * Post to Instagram
   */
  private async postToInstagram(content: UniversalContent, scheduleTime?: Date): Promise<string> {
    if (!this.instagram) {
      throw new Error('Instagram not configured');
    }

    const mediaId = await this.instagram.postFeed({
      imageUrl: content.media.url,
      caption: `${content.title}\n\n${content.description}`,
      link: content.link
    });

    return mediaId;
  }

  /**
   * Post to TikTok
   */
  private async postToTikTok(content: UniversalContent, scheduleTime?: Date): Promise<string> {
    if (!this.tiktok || !content.media.path) {
      throw new Error('TikTok not configured or no video file');
    }

    const publishId = await this.tiktok.uploadVideo({
      videoPath: content.media.path,
      title: content.title,
      description: content.description,
      hashtags: content.tags,
      privacyLevel: 'PUBLIC_TO_EVERYONE'
    });

    return publishId;
  }

  /**
   * Post to Pinterest
   */
  private async postToPinterest(content: UniversalContent): Promise<string> {
    if (!this.pinterest) {
      throw new Error('Pinterest not configured');
    }

    // Get or create default board
    const boards = await this.pinterest.getBoards();
    const boardId = boards[0]?.id || await this.pinterest.createBoard({
      name: 'All Posts',
      description: 'Automated posts',
      privacy: 'PUBLIC'
    });

    let pinId: string;

    if (content.price) {
      // Product pin
      pinId = await this.pinterest.optimizeForShopping({
        boardId,
        imageUrl: content.media.url,
        title: content.title,
        description: content.description,
        link: content.link,
        price: content.price,
        currency: content.currency || 'USD',
        availability: content.availability || 'IN_STOCK',
        productId: content.productId
      }, {
        usePriceInTitle: true,
        targetKeywords: content.tags
      });
    } else {
      // Regular pin
      pinId = await this.pinterest.createPin({
        boardId,
        imageUrl: content.media.url,
        title: content.title,
        description: content.description,
        link: content.link
      }, {
        keywords: content.tags || [],
        hashtags: content.tags
      });
    }

    return pinId;
  }

  // ==========================================================================
  // Scheduling Helper Methods
  // ==========================================================================

  /**
   * Schedule posts on a specific platform
   */
  private async schedulePlatform(
    platform: Platform,
    content: UniversalContent,
    times: Date[],
    stagger: number
  ): Promise<string[]> {
    const postIds: string[] = [];

    for (let i = 0; i < times.length; i++) {
      const scheduleTime = new Date(times[i]);

      if (stagger > 0 && i > 0) {
        scheduleTime.setMinutes(scheduleTime.getMinutes() + stagger * i);
      }

      // Platform-specific scheduling would go here
      // For now, we'll just log the schedule
      console.log(`  Scheduled for ${platform} at ${scheduleTime.toISOString()}`);

      postIds.push(`scheduled_${platform}_${i}`);
    }

    return postIds;
  }

  // ==========================================================================
  // Analytics Helper Methods
  // ==========================================================================

  /**
   * Get metrics from specific platform
   */
  private async getPlatformMetrics(platform: Platform, timeframe: string): Promise<UnifiedMetrics> {
    switch (platform) {
      case 'youtube':
        return this.getYouTubeMetrics(timeframe);

      case 'instagram':
        return this.getInstagramMetrics(timeframe);

      case 'tiktok':
        return this.getTikTokMetrics(timeframe);

      case 'pinterest':
        return this.getPinterestMetrics(timeframe);

      default:
        throw new Error(`Platform ${platform} not implemented`);
    }
  }

  private async getYouTubeMetrics(timeframe: string): Promise<UnifiedMetrics> {
    if (!this.youtube) {
      throw new Error('YouTube not configured');
    }

    const stats = await this.youtube.getChannelStatistics();

    return {
      platform: 'youtube',
      impressions: stats.viewCount,
      engagement: stats.commentCount + stats.likeCount,
      clicks: 0,
      views: stats.viewCount,
      likes: stats.likeCount,
      comments: stats.commentCount,
      followers: stats.subscriberCount
    };
  }

  private async getInstagramMetrics(timeframe: string): Promise<UnifiedMetrics> {
    if (!this.instagram) {
      throw new Error('Instagram not configured');
    }

    const stats = await this.instagram.getAccountMetrics(timeframe as any);

    return {
      platform: 'instagram',
      impressions: stats.reach,
      engagement: Math.round(stats.avgEngagement * stats.reach),
      clicks: stats.websiteClicks,
      followers: stats.followers
    };
  }

  private async getTikTokMetrics(timeframe: string): Promise<UnifiedMetrics> {
    if (!this.tiktok) {
      throw new Error('TikTok not configured');
    }

    const stats = await this.tiktok.getAccountAnalytics(timeframe as any);

    return {
      platform: 'tiktok',
      impressions: stats.totalViews,
      engagement: Math.round(stats.avgEngagement * stats.totalViews),
      clicks: 0,
      views: stats.totalViews,
      likes: stats.totalLikes,
      followers: stats.followers
    };
  }

  private async getPinterestMetrics(timeframe: string): Promise<UnifiedMetrics> {
    if (!this.pinterest) {
      throw new Error('Pinterest not configured');
    }

    const traffic = await this.pinterest.driveTrafficToWebsite('yourstore.com');

    return {
      platform: 'pinterest',
      impressions: traffic.totalImpressions,
      engagement: traffic.totalSaves,
      clicks: traffic.totalClicks,
      saves: traffic.totalSaves
    };
  }

  // ==========================================================================
  // Optimization Helper Methods
  // ==========================================================================

  /**
   * Generate platform-specific optimization recommendations
   */
  private async generatePlatformOptimization(platform: Platform): Promise<PlatformOptimization> {
    const currentPerformance = await this.getPlatformMetrics(platform, 'month');

    const recommendations = this.getOptimizationRecommendations(platform, currentPerformance);

    return {
      platform,
      recommendations,
      currentPerformance,
      benchmarks: {
        industry: this.getIndustryBenchmarks(platform),
        yourBest: currentPerformance // Would be actual best from history
      }
    };
  }

  private getOptimizationRecommendations(
    platform: Platform,
    performance: UnifiedMetrics
  ): Array<{ type: string; suggestion: string; expectedImprovement: string }> {
    const recommendations: Array<{ type: string; suggestion: string; expectedImprovement: string }> = [];

    // Platform-specific recommendations
    switch (platform) {
      case 'youtube':
        recommendations.push({
          type: 'content',
          suggestion: 'Create 8-12 minute videos for better retention',
          expectedImprovement: '+25% watch time'
        });
        recommendations.push({
          type: 'timing',
          suggestion: 'Post at 2-4 PM on weekdays',
          expectedImprovement: '+15% initial views'
        });
        break;

      case 'pinterest':
        recommendations.push({
          type: 'content',
          suggestion: 'Use vertical images (2:3 ratio, 1000x1500px)',
          expectedImprovement: '+40% engagement'
        });
        recommendations.push({
          type: 'hashtags',
          suggestion: 'Use 5-10 specific keywords in description',
          expectedImprovement: '+30% discovery'
        });
        break;
    }

    return recommendations;
  }

  private getIndustryBenchmarks(platform: Platform): UnifiedMetrics {
    // Industry benchmark data
    const benchmarks: Record<Platform, Partial<UnifiedMetrics>> = {
      youtube: { impressions: 10000, engagement: 500 },
      instagram: { impressions: 5000, engagement: 250 },
      tiktok: { impressions: 15000, engagement: 750 },
      pinterest: { impressions: 8000, engagement: 400 },
      facebook: { impressions: 3000, engagement: 150 },
      twitter: { impressions: 2000, engagement: 100 },
      reddit: { impressions: 5000, engagement: 300 },
      linkedin: { impressions: 1000, engagement: 50 }
    };

    return {
      platform,
      impressions: 0,
      engagement: 0,
      clicks: 0,
      ...benchmarks[platform]
    };
  }

  /**
   * Generate general recommendations based on all metrics
   */
  private generateRecommendations(metrics: UnifiedMetrics[]): string[] {
    const recommendations: string[] = [];

    // Find underperforming platforms
    const avgEngagement = metrics.reduce((sum, m) => sum + m.engagement, 0) / metrics.length;

    metrics.forEach(m => {
      if (m.engagement < avgEngagement * 0.7) {
        recommendations.push(
          `Focus on improving ${m.platform} engagement (currently ${((m.engagement / m.impressions) * 100).toFixed(1)}%)`
        );
      }
    });

    // Content type recommendations
    recommendations.push('Diversify content types across platforms');
    recommendations.push('Cross-promote top content from best-performing platform');
    recommendations.push('Post during peak engagement hours for each platform');

    return recommendations;
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Get content from a platform
   */
  private async getContentFromPlatform(source: { platform: Platform; postId: string }): Promise<UniversalContent> {
    // This would fetch content from the source platform
    // For now, return a placeholder

    return {
      title: 'Synced Content',
      description: 'Content synced from ' + source.platform,
      media: {
        type: 'image',
        url: 'https://placeholder.com/image.jpg'
      }
    };
  }

  /**
   * Get platform-specific post URL
   */
  private getPostUrl(platform: Platform, postId: string): string {
    const urls: Record<Platform, string> = {
      youtube: `https://www.youtube.com/watch?v=${postId}`,
      instagram: `https://www.instagram.com/p/${postId}/`,
      tiktok: `https://www.tiktok.com/@username/video/${postId}`,
      pinterest: `https://www.pinterest.com/pin/${postId}/`,
      facebook: `https://www.facebook.com/${postId}`,
      twitter: `https://twitter.com/status/${postId}`,
      reddit: `https://reddit.com/r/comments/${postId}`,
      linkedin: `https://www.linkedin.com/posts/${postId}`
    };

    return urls[platform] || '';
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get enabled platforms
   */
  public getEnabledPlatforms(): Platform[] {
    return [...this.enabledPlatforms];
  }

  /**
   * Check if platform is enabled
   */
  public isPlatformEnabled(platform: Platform): boolean {
    return this.enabledPlatforms.has(platform);
  }
}
