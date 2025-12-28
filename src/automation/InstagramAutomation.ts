/**
 * InstagramAutomation - Production-Ready Instagram Automation System
 *
 * Provides comprehensive Instagram automation using Facebook Graph API (Instagram Graph API)
 * Includes: posts, reels, stories, scheduling, auto-reply, metrics, and hashtag management
 *
 * @requires axios for HTTP requests: npm install axios
 * @requires OAuth credentials from Facebook Developer Console
 */

import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface InstagramCredentials {
  accessToken: string;
  instagramBusinessAccountId: string;
  facebookPageId?: string;
}

export interface MediaPostOptions {
  caption?: string;
  imageUrl?: string;
  videoUrl?: string;
  location?: {
    id: string;
    name: string;
  };
  userTags?: Array<{
    username: string;
    x: number; // 0-1
    y: number; // 0-1
  }>;
  collaborators?: string[]; // Instagram user IDs
  productTags?: Array<{
    productId: string;
    x: number;
    y: number;
  }>;
}

export interface CarouselPostOptions {
  caption?: string;
  children: Array<{
    imageUrl?: string;
    videoUrl?: string;
  }>;
  location?: {
    id: string;
    name: string;
  };
}

export interface ReelPostOptions {
  videoUrl: string;
  caption?: string;
  coverUrl?: string;
  shareToFeed?: boolean;
  location?: {
    id: string;
    name: string;
  };
  audioName?: string;
}

export interface StoryPostOptions {
  imageUrl?: string;
  videoUrl?: string;
  link?: string;
  linkText?: string;
}

export interface SchedulePostOptions {
  caption?: string;
  imageUrl?: string;
  videoUrl?: string;
  scheduledTime: Date;
}

export interface AutoReplyRule {
  keyword: string;
  reply: string;
  caseSensitive?: boolean;
}

export interface MediaMetrics {
  mediaId: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REELS';
  likes: number;
  comments: number;
  saved: number;
  reach: number;
  impressions: number;
  engagement: number;
  shares?: number;
  plays?: number; // For videos/reels
  timestamp: string;
  permalink: string;
}

export interface AccountMetrics {
  followerCount: number;
  followsCount: number;
  mediaCount: number;
  profileViews?: number;
  websiteClicks?: number;
  emailContacts?: number;
  phoneCallClicks?: number;
  getDirectionsClicks?: number;
  impressions?: number;
  reach?: number;
  engagement?: number;
}

export interface Comment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  likeCount: number;
  replies?: Comment[];
}

export interface HashtagPerformance {
  hashtag: string;
  mediaCount: number;
  topPosts: number;
  recentPosts: number;
  averageEngagement?: number;
}

// ============================================================================
// Instagram Automation Class
// ============================================================================

export class InstagramAutomation {
  private credentials: InstagramCredentials;
  private apiClient: AxiosInstance;
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';
  private autoReplyRules: AutoReplyRule[] = [];

  /**
   * Initialize Instagram Automation
   * @param credentials Access token and Instagram Business Account ID
   */
  constructor(credentials: InstagramCredentials) {
    this.credentials = credentials;
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000,
      params: {
        access_token: credentials.accessToken
      }
    });
  }

  // ============================================================================
  // Authentication & Account Methods
  // ============================================================================

  /**
   * Get long-lived access token (60 days)
   * @param shortLivedToken Short-lived token from OAuth
   * @param appId Facebook App ID
   * @param appSecret Facebook App Secret
   */
  async getLongLivedToken(
    shortLivedToken: string,
    appId: string,
    appSecret: string
  ): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: appId,
          client_secret: appSecret,
          fb_exchange_token: shortLivedToken
        }
      });

      return response.data.access_token;
    } catch (error: any) {
      throw new Error(`Failed to get long-lived token: ${error.message}`);
    }
  }

  /**
   * Get Instagram Business Account ID from Facebook Page
   */
  async getInstagramAccountId(facebookPageId: string): Promise<string> {
    try {
      const response = await this.apiClient.get(`/${facebookPageId}`, {
        params: {
          fields: 'instagram_business_account'
        }
      });

      if (!response.data.instagram_business_account) {
        throw new Error('No Instagram Business Account linked to this Facebook Page');
      }

      return response.data.instagram_business_account.id;
    } catch (error: any) {
      throw new Error(`Failed to get Instagram Account ID: ${error.message}`);
    }
  }

  /**
   * Verify account permissions
   */
  async verifyPermissions(): Promise<{
    hasPublishPermission: boolean;
    hasInsightsPermission: boolean;
    hasMessagingPermission: boolean;
  }> {
    try {
      const response = await this.apiClient.get('/me/permissions');
      const permissions = response.data.data.map((p: any) => p.permission);

      return {
        hasPublishPermission: permissions.includes('instagram_basic') &&
                             permissions.includes('instagram_content_publish'),
        hasInsightsPermission: permissions.includes('instagram_manage_insights'),
        hasMessagingPermission: permissions.includes('instagram_manage_messages')
      };
    } catch (error: any) {
      throw new Error(`Failed to verify permissions: ${error.message}`);
    }
  }

  // ============================================================================
  // Feed Post Methods
  // ============================================================================

  /**
   * Post image or video to feed
   */
  async postFeed(options: MediaPostOptions): Promise<string> {
    try {
      // Step 1: Create media container
      const containerParams: any = {
        caption: this.formatCaption(options.caption),
        access_token: this.credentials.accessToken
      };

      if (options.imageUrl) {
        containerParams.image_url = options.imageUrl;
      } else if (options.videoUrl) {
        containerParams.media_type = 'VIDEO';
        containerParams.video_url = options.videoUrl;
      } else {
        throw new Error('Either imageUrl or videoUrl is required');
      }

      if (options.location) {
        containerParams.location_id = options.location.id;
      }

      if (options.userTags) {
        containerParams.user_tags = JSON.stringify(
          options.userTags.map(tag => ({
            username: tag.username,
            x: tag.x,
            y: tag.y
          }))
        );
      }

      if (options.collaborators) {
        containerParams.collaborators = JSON.stringify(options.collaborators);
      }

      if (options.productTags) {
        containerParams.product_tags = JSON.stringify(options.productTags);
      }

      console.log('Creating media container...');
      const containerResponse = await this.apiClient.post(
        `/${this.credentials.instagramBusinessAccountId}/media`,
        null,
        { params: containerParams }
      );

      const creationId = containerResponse.data.id;

      // Step 2: Wait for processing (videos take longer)
      if (options.videoUrl) {
        await this.waitForMediaProcessing(creationId);
      }

      // Step 3: Publish media
      console.log('Publishing media...');
      const publishResponse = await this.apiClient.post(
        `/${this.credentials.instagramBusinessAccountId}/media_publish`,
        null,
        { params: { creation_id: creationId } }
      );

      const mediaId = publishResponse.data.id;
      console.log(`✅ Media posted successfully! ID: ${mediaId}`);

      return mediaId;
    } catch (error: any) {
      throw new Error(`Failed to post feed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Post carousel (multiple images/videos)
   */
  async postCarousel(options: CarouselPostOptions): Promise<string> {
    try {
      if (options.children.length < 2 || options.children.length > 10) {
        throw new Error('Carousel must have 2-10 items');
      }

      console.log(`Creating carousel with ${options.children.length} items...`);

      // Step 1: Create containers for each item
      const childContainerIds: string[] = [];

      for (const [index, child] of options.children.entries()) {
        console.log(`Creating item ${index + 1}/${options.children.length}...`);

        const itemParams: any = {
          is_carousel_item: true
        };

        if (child.imageUrl) {
          itemParams.image_url = child.imageUrl;
        } else if (child.videoUrl) {
          itemParams.media_type = 'VIDEO';
          itemParams.video_url = child.videoUrl;
        }

        const itemResponse = await this.apiClient.post(
          `/${this.credentials.instagramBusinessAccountId}/media`,
          null,
          { params: itemParams }
        );

        childContainerIds.push(itemResponse.data.id);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 2: Create carousel container
      console.log('Creating carousel container...');
      const carouselParams: any = {
        media_type: 'CAROUSEL',
        children: childContainerIds.join(','),
        caption: this.formatCaption(options.caption)
      };

      if (options.location) {
        carouselParams.location_id = options.location.id;
      }

      const carouselResponse = await this.apiClient.post(
        `/${this.credentials.instagramBusinessAccountId}/media`,
        null,
        { params: carouselParams }
      );

      const creationId = carouselResponse.data.id;

      // Step 3: Publish carousel
      console.log('Publishing carousel...');
      const publishResponse = await this.apiClient.post(
        `/${this.credentials.instagramBusinessAccountId}/media_publish`,
        null,
        { params: { creation_id: creationId } }
      );

      const mediaId = publishResponse.data.id;
      console.log(`✅ Carousel posted successfully! ID: ${mediaId}`);

      return mediaId;
    } catch (error: any) {
      throw new Error(`Failed to post carousel: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // ============================================================================
  // Reel Methods
  // ============================================================================

  /**
   * Post Instagram Reel
   */
  async postReel(options: ReelPostOptions): Promise<string> {
    try {
      console.log('Creating reel...');

      // Create reel container
      const reelParams: any = {
        media_type: 'REELS',
        video_url: options.videoUrl,
        caption: this.formatCaption(options.caption),
        share_to_feed: options.shareToFeed !== false
      };

      if (options.coverUrl) {
        reelParams.cover_url = options.coverUrl;
      }

      if (options.location) {
        reelParams.location_id = options.location.id;
      }

      if (options.audioName) {
        reelParams.audio_name = options.audioName;
      }

      const containerResponse = await this.apiClient.post(
        `/${this.credentials.instagramBusinessAccountId}/media`,
        null,
        { params: reelParams }
      );

      const creationId = containerResponse.data.id;

      // Wait for video processing
      console.log('Processing reel...');
      await this.waitForMediaProcessing(creationId, 120000); // 2 minutes timeout

      // Publish reel
      console.log('Publishing reel...');
      const publishResponse = await this.apiClient.post(
        `/${this.credentials.instagramBusinessAccountId}/media_publish`,
        null,
        { params: { creation_id: creationId } }
      );

      const mediaId = publishResponse.data.id;
      console.log(`✅ Reel posted successfully! ID: ${mediaId}`);

      return mediaId;
    } catch (error: any) {
      throw new Error(`Failed to post reel: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // ============================================================================
  // Story Methods
  // ============================================================================

  /**
   * Post Instagram Story
   */
  async postStory(options: StoryPostOptions): Promise<string> {
    try {
      console.log('Creating story...');

      const storyParams: any = {
        media_type: 'STORIES'
      };

      if (options.imageUrl) {
        storyParams.image_url = options.imageUrl;
      } else if (options.videoUrl) {
        storyParams.video_url = options.videoUrl;
      } else {
        throw new Error('Either imageUrl or videoUrl is required for story');
      }

      // Add link sticker (only for verified accounts or accounts with 10k+ followers)
      if (options.link) {
        storyParams.link = options.link;
        if (options.linkText) {
          storyParams.link_text = options.linkText;
        }
      }

      const containerResponse = await this.apiClient.post(
        `/${this.credentials.instagramBusinessAccountId}/media`,
        null,
        { params: storyParams }
      );

      const creationId = containerResponse.data.id;

      // Wait for processing if video
      if (options.videoUrl) {
        await this.waitForMediaProcessing(creationId, 60000);
      }

      // Publish story
      const publishResponse = await this.apiClient.post(
        `/${this.credentials.instagramBusinessAccountId}/media_publish`,
        null,
        { params: { creation_id: creationId } }
      );

      const mediaId = publishResponse.data.id;
      console.log(`✅ Story posted successfully! ID: ${mediaId}`);

      return mediaId;
    } catch (error: any) {
      throw new Error(`Failed to post story: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // ============================================================================
  // Scheduling Methods
  // ============================================================================

  /**
   * Schedule post for later (using content publishing API)
   */
  async schedulePosts(schedules: SchedulePostOptions[]): Promise<string[]> {
    console.log(`Scheduling ${schedules.length} posts...`);

    const scheduledIds: string[] = [];

    for (const [index, schedule] of schedules.entries()) {
      try {
        console.log(`Scheduling post ${index + 1}/${schedules.length}...`);

        // Validate schedule time (must be at least 10 minutes in future, max 75 days)
        const now = new Date();
        const minTime = new Date(now.getTime() + 10 * 60 * 1000);
        const maxTime = new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000);

        if (schedule.scheduledTime < minTime) {
          throw new Error('Scheduled time must be at least 10 minutes in the future');
        }

        if (schedule.scheduledTime > maxTime) {
          throw new Error('Scheduled time cannot be more than 75 days in the future');
        }

        // Create container
        const containerParams: any = {
          caption: this.formatCaption(schedule.caption),
          published: false // Don't publish immediately
        };

        if (schedule.imageUrl) {
          containerParams.image_url = schedule.imageUrl;
        } else if (schedule.videoUrl) {
          containerParams.media_type = 'VIDEO';
          containerParams.video_url = schedule.videoUrl;
        }

        const containerResponse = await this.apiClient.post(
          `/${this.credentials.instagramBusinessAccountId}/media`,
          null,
          { params: containerParams }
        );

        const creationId = containerResponse.data.id;

        // Schedule for publication
        const unixTimestamp = Math.floor(schedule.scheduledTime.getTime() / 1000);

        const publishResponse = await this.apiClient.post(
          `/${this.credentials.instagramBusinessAccountId}/content_publishing_limit`,
          null,
          {
            params: {
              creation_id: creationId,
              published_timestamp: unixTimestamp
            }
          }
        );

        scheduledIds.push(creationId);
        console.log(`✅ Post scheduled for ${schedule.scheduledTime.toLocaleString()}`);

        // Delay between scheduling
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`Failed to schedule post ${index + 1}: ${error.message}`);
      }
    }

    console.log(`✅ Scheduled ${scheduledIds.length} posts`);
    return scheduledIds;
  }

  // ============================================================================
  // Auto-Reply Methods
  // ============================================================================

  /**
   * Set auto-reply rules
   */
  setAutoReplyRules(rules: AutoReplyRule[]): void {
    this.autoReplyRules = rules;
    console.log(`✅ Set ${rules.length} auto-reply rules`);
  }

  /**
   * Process comments and auto-reply based on rules
   */
  async autoReply(mediaId: string): Promise<number> {
    try {
      // Get comments
      const comments = await this.getComments(mediaId);
      let repliedCount = 0;

      for (const comment of comments) {
        // Check if we've already replied
        const hasReplied = comment.replies?.some(
          reply => reply.username === this.credentials.instagramBusinessAccountId
        );

        if (hasReplied) continue;

        // Check auto-reply rules
        for (const rule of this.autoReplyRules) {
          const matches = rule.caseSensitive
            ? comment.text.includes(rule.keyword)
            : comment.text.toLowerCase().includes(rule.keyword.toLowerCase());

          if (matches) {
            await this.replyToComment(comment.id, rule.reply);
            repliedCount++;
            console.log(`✅ Auto-replied to comment: ${comment.text.substring(0, 50)}...`);

            // Delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            break;
          }
        }
      }

      return repliedCount;
    } catch (error: any) {
      throw new Error(`Failed to auto-reply: ${error.message}`);
    }
  }

  /**
   * Reply to a specific comment
   */
  async replyToComment(commentId: string, message: string): Promise<string> {
    try {
      const response = await this.apiClient.post(
        `/${commentId}/replies`,
        null,
        { params: { message } }
      );

      return response.data.id;
    } catch (error: any) {
      throw new Error(`Failed to reply to comment: ${error.message}`);
    }
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: string): Promise<void> {
    try {
      await this.apiClient.delete(`/${commentId}`);
      console.log(`✅ Comment deleted: ${commentId}`);
    } catch (error: any) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }

  /**
   * Hide/unhide comment
   */
  async hideComment(commentId: string, hide: boolean = true): Promise<void> {
    try {
      await this.apiClient.post(`/${commentId}`, null, {
        params: { hide }
      });
      console.log(`✅ Comment ${hide ? 'hidden' : 'unhidden'}: ${commentId}`);
    } catch (error: any) {
      throw new Error(`Failed to hide comment: ${error.message}`);
    }
  }

  // ============================================================================
  // Metrics & Analytics Methods
  // ============================================================================

  /**
   * Get media metrics
   */
  async trackMetrics(mediaIds: string[]): Promise<MediaMetrics[]> {
    console.log(`Tracking metrics for ${mediaIds.length} posts...`);

    const metrics: MediaMetrics[] = [];

    for (const mediaId of mediaIds) {
      try {
        const response = await this.apiClient.get(`/${mediaId}`, {
          params: {
            fields: 'id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count,insights.metric(engagement,impressions,reach,saved,video_views,shares)'
          }
        });

        const data = response.data;
        const insights = data.insights?.data || [];

        const getInsightValue = (name: string) => {
          const insight = insights.find((i: any) => i.name === name);
          return insight?.values[0]?.value || 0;
        };

        metrics.push({
          mediaId: data.id,
          mediaType: data.media_type,
          likes: data.like_count || 0,
          comments: data.comments_count || 0,
          saved: getInsightValue('saved'),
          reach: getInsightValue('reach'),
          impressions: getInsightValue('impressions'),
          engagement: getInsightValue('engagement'),
          shares: getInsightValue('shares'),
          plays: getInsightValue('video_views'),
          timestamp: data.timestamp,
          permalink: data.permalink
        });

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error: any) {
        console.error(`Failed to get metrics for ${mediaId}: ${error.message}`);
      }
    }

    return metrics;
  }

  /**
   * Get account metrics
   */
  async getAccountMetrics(period: 'day' | 'week' | 'days_28' = 'week'): Promise<AccountMetrics> {
    try {
      // Get account info
      const accountResponse = await this.apiClient.get(
        `/${this.credentials.instagramBusinessAccountId}`,
        {
          params: {
            fields: 'followers_count,follows_count,media_count'
          }
        }
      );

      // Get insights
      const insightsResponse = await this.apiClient.get(
        `/${this.credentials.instagramBusinessAccountId}/insights`,
        {
          params: {
            metric: 'profile_views,reach,impressions,website_clicks,email_contacts,phone_call_clicks,get_directions_clicks',
            period
          }
        }
      );

      const insights = insightsResponse.data.data;
      const getInsightValue = (name: string) => {
        const insight = insights.find((i: any) => i.name === name);
        return insight?.values[0]?.value || 0;
      };

      return {
        followerCount: accountResponse.data.followers_count,
        followsCount: accountResponse.data.follows_count,
        mediaCount: accountResponse.data.media_count,
        profileViews: getInsightValue('profile_views'),
        websiteClicks: getInsightValue('website_clicks'),
        emailContacts: getInsightValue('email_contacts'),
        phoneCallClicks: getInsightValue('phone_call_clicks'),
        getDirectionsClicks: getInsightValue('get_directions_clicks'),
        impressions: getInsightValue('impressions'),
        reach: getInsightValue('reach')
      };
    } catch (error: any) {
      throw new Error(`Failed to get account metrics: ${error.message}`);
    }
  }

  /**
   * Get top performing posts
   */
  async getTopPosts(limit: number = 10, sortBy: 'engagement' | 'reach' | 'likes' = 'engagement'): Promise<MediaMetrics[]> {
    try {
      // Get recent media
      const response = await this.apiClient.get(
        `/${this.credentials.instagramBusinessAccountId}/media`,
        {
          params: {
            fields: 'id',
            limit: 50
          }
        }
      );

      const mediaIds = response.data.data.map((m: any) => m.id);
      const metrics = await this.trackMetrics(mediaIds);

      // Sort by specified metric
      metrics.sort((a, b) => {
        if (sortBy === 'engagement') return b.engagement - a.engagement;
        if (sortBy === 'reach') return b.reach - a.reach;
        return b.likes - a.likes;
      });

      return metrics.slice(0, limit);
    } catch (error: any) {
      throw new Error(`Failed to get top posts: ${error.message}`);
    }
  }

  // ============================================================================
  // Hashtag Methods
  // ============================================================================

  /**
   * Search hashtags
   */
  async searchHashtags(query: string): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await this.apiClient.get(
        `/ig_hashtag_search`,
        {
          params: {
            user_id: this.credentials.instagramBusinessAccountId,
            q: query.replace('#', '')
          }
        }
      );

      return response.data.data.map((tag: any) => ({
        id: tag.id,
        name: `#${tag.name}`
      }));
    } catch (error: any) {
      throw new Error(`Failed to search hashtags: ${error.message}`);
    }
  }

  /**
   * Get hashtag performance
   */
  async getHashtagPerformance(hashtagName: string): Promise<HashtagPerformance> {
    try {
      // Search for hashtag
      const hashtags = await this.searchHashtags(hashtagName);

      if (hashtags.length === 0) {
        throw new Error('Hashtag not found');
      }

      const hashtagId = hashtags[0].id;

      // Get hashtag info
      const response = await this.apiClient.get(`/${hashtagId}`, {
        params: {
          fields: 'id,name',
          user_id: this.credentials.instagramBusinessAccountId
        }
      });

      // Get top media count
      const topMediaResponse = await this.apiClient.get(
        `/${hashtagId}/top_media`,
        {
          params: {
            user_id: this.credentials.instagramBusinessAccountId,
            fields: 'id'
          }
        }
      );

      // Get recent media count
      const recentMediaResponse = await this.apiClient.get(
        `/${hashtagId}/recent_media`,
        {
          params: {
            user_id: this.credentials.instagramBusinessAccountId,
            fields: 'id'
          }
        }
      );

      return {
        hashtag: `#${response.data.name}`,
        mediaCount: 0, // Not available in API
        topPosts: topMediaResponse.data.data?.length || 0,
        recentPosts: recentMediaResponse.data.data?.length || 0
      };
    } catch (error: any) {
      throw new Error(`Failed to get hashtag performance: ${error.message}`);
    }
  }

  /**
   * Generate optimal hashtags based on caption
   */
  handleHashtags(caption: string, maxHashtags: number = 30): string[] {
    // Extract existing hashtags
    const existingHashtags = caption.match(/#\w+/g) || [];

    // Common high-performing hashtags by category
    const recommendedHashtags = [
      '#instagood', '#photooftheday', '#love', '#instagram',
      '#follow', '#like', '#instadaily', '#picoftheday',
      '#repost', '#fashion', '#beautiful', '#happy',
      '#art', '#photography', '#nature', '#style'
    ];

    // Combine and limit
    const allHashtags = [...new Set([...existingHashtags, ...recommendedHashtags])];
    return allHashtags.slice(0, maxHashtags);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Get comments for a media
   */
  private async getComments(mediaId: string): Promise<Comment[]> {
    try {
      const response = await this.apiClient.get(`/${mediaId}/comments`, {
        params: {
          fields: 'id,text,username,timestamp,like_count,replies{id,text,username,timestamp}'
        }
      });

      return response.data.data.map((c: any) => ({
        id: c.id,
        text: c.text,
        username: c.username,
        timestamp: c.timestamp,
        likeCount: c.like_count || 0,
        replies: c.replies?.data || []
      }));
    } catch (error: any) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
  }

  /**
   * Wait for media processing to complete
   */
  private async waitForMediaProcessing(
    creationId: string,
    timeout: number = 60000
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const response = await this.apiClient.get(`/${creationId}`, {
          params: { fields: 'status_code' }
        });

        const status = response.data.status_code;

        if (status === 'FINISHED') {
          console.log('✅ Media processing complete');
          return;
        }

        if (status === 'ERROR') {
          throw new Error('Media processing failed');
        }

        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error: any) {
        if (error.response?.status === 400) {
          // Container might not exist yet
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw error;
        }
      }
    }

    throw new Error('Media processing timeout');
  }

  /**
   * Format caption with hashtags
   */
  private formatCaption(caption?: string): string {
    if (!caption) return '';

    // Ensure caption doesn't exceed 2200 characters
    return caption.length > 2200
      ? caption.substring(0, 2197) + '...'
      : caption;
  }

  /**
   * Delete media
   */
  async deleteMedia(mediaId: string): Promise<void> {
    try {
      await this.apiClient.delete(`/${mediaId}`);
      console.log(`✅ Media deleted: ${mediaId}`);
    } catch (error: any) {
      throw new Error(`Failed to delete media: ${error.message}`);
    }
  }

  /**
   * Get media details
   */
  async getMediaDetails(mediaId: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/${mediaId}`, {
        params: {
          fields: 'id,media_type,media_url,permalink,caption,timestamp,username,like_count,comments_count'
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get media details: ${error.message}`);
    }
  }

  /**
   * Get user's recent media
   */
  async getRecentMedia(limit: number = 25): Promise<string[]> {
    try {
      const response = await this.apiClient.get(
        `/${this.credentials.instagramBusinessAccountId}/media`,
        {
          params: {
            fields: 'id',
            limit
          }
        }
      );

      return response.data.data.map((m: any) => m.id);
    } catch (error: any) {
      throw new Error(`Failed to get recent media: ${error.message}`);
    }
  }
}

export default InstagramAutomation;
