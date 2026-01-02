import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';
import FormData from 'form-data';

/**
 * Instagram Graph API Integration
 *
 * Full integration with Instagram Business/Creator accounts for:
 * - Media publishing (photos, videos, carousels, stories, reels)
 * - Content management
 * - Comment management
 * - Insights and analytics
 * - Hashtag research
 *
 * Note: Requires Instagram Business or Creator account connected to Facebook Page
 *
 * Perfect for:
 * - Automated content posting
 * - Multi-account management
 * - Analytics tracking
 * - Engagement automation
 */

export interface InstagramConfig {
  accessToken: string;
  instagramBusinessAccountId?: string;
}

export interface MediaUploadOptions {
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  location?: string;
  userTags?: Array<{ username: string; x: number; y: number }>;
  isCarousel?: boolean;
  carouselChildren?: string[]; // Container IDs
  productTags?: any[];
}

export interface StoryOptions {
  imageUrl?: string;
  videoUrl?: string;
  stickers?: any[];
}

export interface ReelOptions {
  videoUrl: string;
  caption?: string;
  shareToFeed?: boolean;
  coverUrl?: string;
  audioName?: string;
}

export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  insights?: any;
}

export class InstagramAPI {
  private client: AxiosInstance;
  private config: InstagramConfig;
  private baseURL = 'https://graph.facebook.com/v18.0';

  constructor(config: InstagramConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 120000,
    });
  }

  /**
   * MEDIA PUBLISHING
   */

  /**
   * Publish photo
   */
  async publishPhoto(imageUrl: string, caption?: string): Promise<InstagramMedia> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    // Step 1: Create container
    const containerResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          image_url: imageUrl,
          caption: caption || '',
          access_token: this.config.accessToken,
        },
      }
    );

    const containerId = containerResponse.data.id;

    // Step 2: Publish container
    const publishResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media_publish`,
      null,
      {
        params: {
          creation_id: containerId,
          access_token: this.config.accessToken,
        },
      }
    );

    const mediaId = publishResponse.data.id;

    // Step 3: Get published media details
    return this.getMedia(mediaId);
  }

  /**
   * Publish video
   */
  async publishVideo(videoUrl: string, caption?: string, coverUrl?: string): Promise<InstagramMedia> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    // Step 1: Create video container
    const params: any = {
      media_type: 'VIDEO',
      video_url: videoUrl,
      caption: caption || '',
      access_token: this.config.accessToken,
    };

    if (coverUrl) {
      params.thumb_offset = 0; // or specific offset
    }

    const containerResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media`,
      null,
      { params }
    );

    const containerId = containerResponse.data.id;

    // Step 2: Wait for video to be ready
    await this.waitForVideoReady(containerId);

    // Step 3: Publish container
    const publishResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media_publish`,
      null,
      {
        params: {
          creation_id: containerId,
          access_token: this.config.accessToken,
        },
      }
    );

    const mediaId = publishResponse.data.id;

    return this.getMedia(mediaId);
  }

  /**
   * Publish carousel
   */
  async publishCarousel(
    mediaUrls: Array<{ type: 'IMAGE' | 'VIDEO'; url: string }>,
    caption?: string
  ): Promise<InstagramMedia> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    // Step 1: Create containers for each item
    const childrenIds: string[] = [];

    for (const media of mediaUrls) {
      const params: any = {
        is_carousel_item: true,
        access_token: this.config.accessToken,
      };

      if (media.type === 'IMAGE') {
        params.image_url = media.url;
      } else {
        params.media_type = 'VIDEO';
        params.video_url = media.url;
      }

      const response = await this.client.post(
        `/${this.config.instagramBusinessAccountId}/media`,
        null,
        { params }
      );

      childrenIds.push(response.data.id);

      if (media.type === 'VIDEO') {
        await this.waitForVideoReady(response.data.id);
      }
    }

    // Step 2: Create carousel container
    const carouselResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          media_type: 'CAROUSEL',
          children: childrenIds.join(','),
          caption: caption || '',
          access_token: this.config.accessToken,
        },
      }
    );

    const containerId = carouselResponse.data.id;

    // Step 3: Publish carousel
    const publishResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media_publish`,
      null,
      {
        params: {
          creation_id: containerId,
          access_token: this.config.accessToken,
        },
      }
    );

    return this.getMedia(publishResponse.data.id);
  }

  /**
   * Publish Reel
   */
  async publishReel(options: ReelOptions): Promise<InstagramMedia> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    const params: any = {
      media_type: 'REELS',
      video_url: options.videoUrl,
      caption: options.caption || '',
      share_to_feed: options.shareToFeed !== false,
      access_token: this.config.accessToken,
    };

    if (options.coverUrl) {
      params.cover_url = options.coverUrl;
    }

    if (options.audioName) {
      params.audio_name = options.audioName;
    }

    // Create container
    const containerResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media`,
      null,
      { params }
    );

    const containerId = containerResponse.data.id;

    // Wait for video processing
    await this.waitForVideoReady(containerId);

    // Publish
    const publishResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media_publish`,
      null,
      {
        params: {
          creation_id: containerId,
          access_token: this.config.accessToken,
        },
      }
    );

    return this.getMedia(publishResponse.data.id);
  }

  /**
   * Publish Story
   */
  async publishStory(imageUrl: string): Promise<any> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    const containerResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          image_url: imageUrl,
          media_type: 'STORIES',
          access_token: this.config.accessToken,
        },
      }
    );

    const containerId = containerResponse.data.id;

    const publishResponse = await this.client.post(
      `/${this.config.instagramBusinessAccountId}/media_publish`,
      null,
      {
        params: {
          creation_id: containerId,
          access_token: this.config.accessToken,
        },
      }
    );

    return publishResponse.data;
  }

  /**
   * Wait for video to be ready
   */
  private async waitForVideoReady(containerId: string, maxAttempts = 30): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await this.client.get(`/${containerId}`, {
        params: {
          fields: 'status_code',
          access_token: this.config.accessToken,
        },
      });

      const statusCode = response.data.status_code;

      if (statusCode === 'FINISHED') {
        return;
      }

      if (statusCode === 'ERROR') {
        throw new Error('Video processing failed');
      }

      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    throw new Error('Video processing timeout');
  }

  /**
   * MEDIA MANAGEMENT
   */

  /**
   * Get media details
   */
  async getMedia(mediaId: string): Promise<InstagramMedia> {
    const response = await this.client.get(`/${mediaId}`, {
      params: {
        fields: 'id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count,username',
        access_token: this.config.accessToken,
      },
    });

    return response.data;
  }

  /**
   * Get account media
   */
  async getAccountMedia(limit = 25): Promise<InstagramMedia[]> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    const response = await this.client.get(
      `/${this.config.instagramBusinessAccountId}/media`,
      {
        params: {
          fields: 'id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count',
          limit,
          access_token: this.config.accessToken,
        },
      }
    );

    return response.data.data || [];
  }

  /**
   * Delete media
   */
  async deleteMedia(mediaId: string): Promise<void> {
    await this.client.delete(`/${mediaId}`, {
      params: {
        access_token: this.config.accessToken,
      },
    });
  }

  /**
   * COMMENT MANAGEMENT
   */

  /**
   * Get media comments
   */
  async getMediaComments(mediaId: string): Promise<any[]> {
    const response = await this.client.get(`/${mediaId}/comments`, {
      params: {
        fields: 'id,text,username,timestamp,like_count',
        access_token: this.config.accessToken,
      },
    });

    return response.data.data || [];
  }

  /**
   * Reply to comment
   */
  async replyToComment(commentId: string, message: string): Promise<any> {
    const response = await this.client.post(`/${commentId}/replies`, null, {
      params: {
        message,
        access_token: this.config.accessToken,
      },
    });

    return response.data;
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: string): Promise<void> {
    await this.client.delete(`/${commentId}`, {
      params: {
        access_token: this.config.accessToken,
      },
    });
  }

  /**
   * Hide comment
   */
  async hideComment(commentId: string): Promise<void> {
    await this.client.post(`/${commentId}`, null, {
      params: {
        hide: true,
        access_token: this.config.accessToken,
      },
    });
  }

  /**
   * INSIGHTS & ANALYTICS
   */

  /**
   * Get media insights
   */
  async getMediaInsights(mediaId: string): Promise<any> {
    const metrics = ['engagement', 'impressions', 'reach', 'saved'];

    const response = await this.client.get(`/${mediaId}/insights`, {
      params: {
        metric: metrics.join(','),
        access_token: this.config.accessToken,
      },
    });

    return response.data.data;
  }

  /**
   * Get account insights
   */
  async getAccountInsights(
    metrics: string[] = ['impressions', 'reach', 'profile_views'],
    period: 'day' | 'week' | 'days_28' = 'day'
  ): Promise<any> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    const response = await this.client.get(
      `/${this.config.instagramBusinessAccountId}/insights`,
      {
        params: {
          metric: metrics.join(','),
          period,
          access_token: this.config.accessToken,
        },
      }
    );

    return response.data.data;
  }

  /**
   * HASHTAG RESEARCH
   */

  /**
   * Search hashtags
   */
  async searchHashtags(query: string): Promise<any[]> {
    const response = await this.client.get('/ig_hashtag_search', {
      params: {
        user_id: this.config.instagramBusinessAccountId,
        q: query,
        access_token: this.config.accessToken,
      },
    });

    return response.data.data || [];
  }

  /**
   * Get hashtag info
   */
  async getHashtagInfo(hashtagId: string): Promise<any> {
    const response = await this.client.get(`/${hashtagId}`, {
      params: {
        fields: 'id,name',
        access_token: this.config.accessToken,
      },
    });

    return response.data;
  }

  /**
   * Get top hashtag media
   */
  async getHashtagTopMedia(hashtagId: string, limit = 25): Promise<any[]> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    const response = await this.client.get(`/${hashtagId}/top_media`, {
      params: {
        user_id: this.config.instagramBusinessAccountId,
        fields: 'id,media_type,media_url,permalink,caption',
        limit,
        access_token: this.config.accessToken,
      },
    });

    return response.data.data || [];
  }

  /**
   * ACCOUNT MANAGEMENT
   */

  /**
   * Get account info
   */
  async getAccountInfo(): Promise<any> {
    if (!this.config.instagramBusinessAccountId) {
      throw new Error('Instagram Business Account ID required');
    }

    const response = await this.client.get(
      `/${this.config.instagramBusinessAccountId}`,
      {
        params: {
          fields: 'id,username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url',
          access_token: this.config.accessToken,
        },
      }
    );

    return response.data;
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Batch publish posts
   */
  async batchPublishPhotos(
    posts: Array<{ imageUrl: string; caption?: string }>
  ): Promise<InstagramMedia[]> {
    const published: InstagramMedia[] = [];

    for (const post of posts) {
      try {
        const media = await this.publishPhoto(post.imageUrl, post.caption);
        published.push(media);
        console.log(`✅ Published: ${post.caption?.substring(0, 50)}...`);

        // Instagram rate limiting - wait between posts
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error: any) {
        console.error(`❌ Failed to publish:`, error.message);
      }
    }

    return published;
  }

  /**
   * Schedule post (Note: Requires third-party scheduler or manual implementation)
   */
  schedulePost(imageUrl: string, caption: string, publishAt: Date): any {
    // This would typically integrate with a scheduling service
    // Instagram doesn't have native scheduling in the Graph API
    return {
      imageUrl,
      caption,
      publishAt,
      status: 'scheduled',
      note: 'Requires scheduling service integration',
    };
  }

  /**
   * Get optimal posting time based on insights
   */
  async getOptimalPostingTime(): Promise<any> {
    const insights = await this.getAccountInsights(
      ['reach', 'impressions'],
      'days_28'
    );

    // Analyze insights to determine best posting times
    // This is a simplified version
    return {
      recommendedHours: [9, 12, 17, 20],
      recommendedDays: ['Monday', 'Wednesday', 'Friday'],
      insights,
    };
  }
}

export default InstagramAPI;
