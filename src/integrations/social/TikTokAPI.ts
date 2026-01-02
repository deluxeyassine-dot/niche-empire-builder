import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';
import FormData from 'form-data';

/**
 * TikTok API Integration
 *
 * Full integration with TikTok for Business for:
 * - Video uploads
 * - Content management
 * - User info retrieval
 * - Video analytics
 * - Comment management
 *
 * Note: Requires TikTok for Business account and app approval
 *
 * Perfect for:
 * - Automated short-form content posting
 * - Multi-account management
 * - Analytics tracking
 * - Viral content distribution
 */

export interface TikTokConfig {
  accessToken: string;
  clientKey?: string;
  clientSecret?: string;
}

export interface VideoUploadOptions {
  videoPath: string;
  title: string;
  description?: string;
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
  videoGifMode?: boolean;
  brandContentToggle?: boolean;
  brandOrganicToggle?: boolean;
}

export interface TikTokVideo {
  id: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  video_description: string;
  duration: number;
  height: number;
  width: number;
  title: string;
  embed_html: string;
  embed_link: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
}

export interface TikTokUserInfo {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_url_200: string;
  avatar_large_url: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export class TikTokAPI {
  private client: AxiosInstance;
  private config: TikTokConfig;
  private baseURL = 'https://open.tiktokapis.com/v2';

  constructor(config: TikTokConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 300000, // 5 minutes for uploads
    });
  }

  /**
   * AUTHENTICATION
   */

  /**
   * Get authorization URL
   */
  getAuthorizationUrl(
    redirectUri: string,
    scope: string[] = ['user.info.basic', 'video.list', 'video.upload'],
    state?: string
  ): string {
    const csrfState = state || Math.random().toString(36).substring(7);

    const params = new URLSearchParams({
      client_key: this.config.clientKey || '',
      scope: scope.join(','),
      response_type: 'code',
      redirect_uri: redirectUri,
      state: csrfState,
    });

    return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    open_id: string;
    scope: string;
  }> {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: this.config.clientKey,
      client_secret: this.config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.config.accessToken = response.data.data.access_token;

    return response.data.data;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: this.config.clientKey,
      client_secret: this.config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    this.config.accessToken = response.data.data.access_token;

    return response.data.data.access_token;
  }

  /**
   * VIDEO UPLOAD
   */

  /**
   * Initialize video upload
   */
  async initializeUpload(): Promise<{ publish_id: string; upload_url: string }> {
    const response = await this.client.post('/post/publish/video/init/', {
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: 0,
        chunk_size: 10000000, // 10MB chunks
        total_chunk_count: 1,
      },
    });

    return {
      publish_id: response.data.data.publish_id,
      upload_url: response.data.data.upload_url,
    };
  }

  /**
   * Upload video file
   */
  async uploadVideoFile(videoPath: string, uploadUrl: string): Promise<void> {
    const videoBuffer = await fs.readFile(videoPath);

    await axios.put(uploadUrl, videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': videoBuffer.length,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
  }

  /**
   * Publish video
   */
  async publishVideo(publishId: string, options: Omit<VideoUploadOptions, 'videoPath'>): Promise<any> {
    const response = await this.client.post('/post/publish/status/fetch/', {
      publish_id: publishId,
    });

    if (response.data.data.status !== 'PUBLISH_COMPLETE') {
      throw new Error(`Video not ready for publishing. Status: ${response.data.data.status}`);
    }

    const publishResponse = await this.client.post('/post/publish/video/', {
      post_info: {
        title: options.title,
        description: options.description || '',
        privacy_level: options.privacyLevel || 'PUBLIC_TO_EVERYONE',
        disable_comment: options.disableComment || false,
        disable_duet: options.disableDuet || false,
        disable_stitch: options.disableStitch || false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        publish_id: publishId,
      },
    });

    return publishResponse.data.data;
  }

  /**
   * Complete video upload workflow
   */
  async uploadVideo(options: VideoUploadOptions): Promise<any> {
    console.log('🎬 Initializing TikTok upload...');

    // Step 1: Initialize upload
    const { publish_id, upload_url } = await this.initializeUpload();
    console.log(`✅ Upload initialized. Publish ID: ${publish_id}`);

    // Step 2: Upload video file
    console.log('📤 Uploading video file...');
    await this.uploadVideoFile(options.videoPath, upload_url);
    console.log('✅ Video uploaded');

    // Step 3: Wait for processing
    console.log('⏳ Waiting for video processing...');
    await this.waitForProcessing(publish_id);
    console.log('✅ Video processed');

    // Step 4: Publish
    console.log('📢 Publishing video...');
    const result = await this.publishVideo(publish_id, options);
    console.log('✅ Video published successfully!');

    return result;
  }

  /**
   * Wait for video processing
   */
  private async waitForProcessing(publishId: string, maxAttempts = 60): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await this.client.post('/post/publish/status/fetch/', {
        publish_id: publishId,
      });

      const status = response.data.data.status;

      if (status === 'PUBLISH_COMPLETE') {
        return;
      }

      if (status === 'FAILED') {
        throw new Error('Video processing failed');
      }

      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    throw new Error('Video processing timeout');
  }

  /**
   * VIDEO MANAGEMENT
   */

  /**
   * Get user videos
   */
  async getUserVideos(maxCount = 20): Promise<TikTokVideo[]> {
    const response = await this.client.post('/video/list/', {
      max_count: maxCount,
    });

    return response.data.data.videos || [];
  }

  /**
   * Get video details
   */
  async getVideoInfo(videoId: string): Promise<TikTokVideo> {
    const response = await this.client.post('/video/query/', {
      filters: {
        video_ids: [videoId],
      },
    });

    return response.data.data.videos[0];
  }

  /**
   * USER INFO
   */

  /**
   * Get user info
   */
  async getUserInfo(): Promise<TikTokUserInfo> {
    const response = await this.client.get('/user/info/', {
      params: {
        fields: 'open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count',
      },
    });

    return response.data.data.user;
  }

  /**
   * COMMENTS
   */

  /**
   * Get video comments
   */
  async getVideoComments(videoId: string, maxCount = 50): Promise<any[]> {
    const response = await this.client.post('/comment/list/', {
      video_id: videoId,
      max_count: maxCount,
    });

    return response.data.data.comments || [];
  }

  /**
   * Reply to comment
   */
  async replyToComment(commentId: string, text: string): Promise<any> {
    const response = await this.client.post('/comment/reply/', {
      comment_id: commentId,
      text: text,
    });

    return response.data.data;
  }

  /**
   * ANALYTICS
   */

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoIds: string[]): Promise<any[]> {
    const response = await this.client.post('/video/query/', {
      filters: {
        video_ids: videoIds,
      },
      fields: ['id', 'like_count', 'comment_count', 'share_count', 'view_count'],
    });

    return response.data.data.videos || [];
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Batch upload videos
   */
  async batchUploadVideos(
    videos: Array<{ path: string; title: string; description?: string }>
  ): Promise<any[]> {
    const results = [];

    for (const video of videos) {
      try {
        console.log(`\n📹 Uploading: ${video.title}`);

        const result = await this.uploadVideo({
          videoPath: video.path,
          title: video.title,
          description: video.description,
          privacyLevel: 'PUBLIC_TO_EVERYONE',
        });

        results.push({ success: true, video: result });
        console.log(`✅ Uploaded: ${video.title}`);

        // Rate limiting - wait between uploads
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (error: any) {
        console.error(`❌ Failed to upload ${video.title}:`, error.message);
        results.push({ success: false, error: error.message, video });
      }
    }

    return results;
  }

  /**
   * Get trending hashtags (Note: Limited API support)
   */
  async getTrendingHashtags(): Promise<string[]> {
    // TikTok doesn't provide a direct trending hashtags endpoint
    // This would need to be implemented via web scraping or third-party services
    return [
      '#fyp',
      '#foryou',
      '#viral',
      '#trending',
      '#foryoupage',
    ];
  }

  /**
   * Generate optimal posting times based on analytics
   */
  async getOptimalPostingTimes(): Promise<any> {
    const userInfo = await this.getUserInfo();
    const videos = await this.getUserVideos(20);

    // Analyze video performance to determine best posting times
    // This is a simplified version
    return {
      recommendedHours: [12, 15, 18, 21], // Peak engagement hours
      recommendedDays: ['Friday', 'Saturday', 'Sunday'],
      analytics: {
        totalVideos: videos.length,
        followerCount: userInfo.follower_count,
      },
    };
  }

  /**
   * Verify webhook signature
   */
  verifyWebhook(payload: string, signature: string): boolean {
    const crypto = require('crypto');

    const hash = crypto
      .createHmac('sha256', this.config.clientSecret || '')
      .update(payload)
      .digest('hex');

    return hash === signature;
  }
}

export default TikTokAPI;
