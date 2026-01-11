/**
 * YouTubeAutomation - Production-Ready YouTube Automation System
 *
 * Provides comprehensive YouTube automation using Google YouTube Data API v3
 * Includes: video uploads, scheduling, metadata management, playlists, monetization, and analytics
 *
 * @requires googleapis npm package: npm install googleapis
 * @requires OAuth2 credentials from Google Cloud Console
 */

import { google, youtube_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface YouTubeCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
  accessToken?: string;
}

export interface VideoUploadOptions {
  title: string;
  description: string;
  tags?: string[];
  categoryId?: string;
  privacyStatus: 'public' | 'private' | 'unlisted';
  publishAt?: Date;
  language?: string;
  defaultLanguage?: string;
  notifySubscribers?: boolean;
  madeForKids?: boolean;
  embeddable?: boolean;
  license?: 'youtube' | 'creativeCommon';
  publicStatsViewable?: boolean;
  selfDeclaredMadeForKids?: boolean;
  thumbnail?: string;
  playlist?: string;
}

export interface VideoMetadata {
  videoId: string;
  title?: string;
  description?: string;
  tags?: string[];
  categoryId?: string;
  defaultLanguage?: string;
}

export interface PlaylistOptions {
  title: string;
  description?: string;
  privacyStatus: 'public' | 'private' | 'unlisted';
  tags?: string[];
  defaultLanguage?: string;
}

export interface MonetizationOptions {
  videoId: string;
  enableMonetization: boolean;
  adFormats?: {
    skippableVideoAds?: boolean;
    nonSkippableVideoAds?: boolean;
    bumperAds?: boolean;
    overlayAds?: boolean;
    displayAds?: boolean;
  };
}

export interface VideoAnalytics {
  videoId: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  favorites: number;
  duration: string;
  publishedAt: string;
  averageViewDuration?: string;
  subscribersGained?: number;
  estimatedRevenue?: number;
}

export interface ScheduleOptions {
  videoId: string;
  publishAt: Date;
  notifySubscribers?: boolean;
}

export interface UploadProgress {
  bytesUploaded: number;
  totalBytes: number;
  percentage: number;
  videoId?: string;
}

// ============================================================================
// YouTube Automation Class
// ============================================================================

export class YouTubeAutomation {
  private oauth2Client: OAuth2Client;
  private youtube: youtube_v3.Youtube;
  private credentials: YouTubeCredentials;
  private uploadProgressCallback?: (progress: UploadProgress) => void;

  /**
   * Initialize YouTube Automation
   * @param credentials OAuth2 credentials from Google Cloud Console
   */
  constructor(credentials: YouTubeCredentials) {
    this.credentials = credentials;
    this.oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret,
      credentials.redirectUri
    );

    // Set credentials if available
    if (credentials.accessToken || credentials.refreshToken) {
      this.oauth2Client.setCredentials({
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken
      });
    }

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client
    });
  }

  // ============================================================================
  // Authentication Methods
  // ============================================================================

  /**
   * Generate OAuth2 authorization URL
   * User must visit this URL to authorize the application
   */
  getAuthorizationUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtubepartner',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   * @param code Authorization code from OAuth redirect
   */
  async authorize(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      return {
        accessToken: tokens.access_token || '',
        refreshToken: tokens.refresh_token || ''
      };
    } catch (error: any) {
      throw new Error(`Authorization failed: ${error.message}`);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
      return credentials.access_token || '';
    } catch (error: any) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Set access token manually
   */
  setAccessToken(accessToken: string, refreshToken?: string): void {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }

  // ============================================================================
  // Video Upload Methods
  // ============================================================================

  /**
   * Upload video to YouTube
   * @param videoPath Path to video file
   * @param options Upload options
   * @param onProgress Optional progress callback
   */
  async uploadVideo(
    videoPath: string,
    options: VideoUploadOptions,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      // Validate file exists
      if (!fs.existsSync(videoPath)) {
        throw new Error(`Video file not found: ${videoPath}`);
      }

      const fileSize = fs.statSync(videoPath).size;
      const videoStream = fs.createReadStream(videoPath);

      // Prepare video metadata
      const requestBody: youtube_v3.Schema$Video = {
        snippet: {
          title: options.title,
          description: options.description,
          tags: options.tags,
          categoryId: options.categoryId,
          defaultLanguage: options.defaultLanguage || 'en'
        },
        status: {
          privacyStatus: options.privacyStatus,
          publishAt: options.publishAt?.toISOString(),
          selfDeclaredMadeForKids: options.madeForKids || false,
          embeddable: options.embeddable !== false,
          license: options.license || 'youtube',
          publicStatsViewable: options.publicStatsViewable !== false
        }
      };

      console.log(`Uploading video: ${options.title}`);
      console.log(`File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

      // Upload video
      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        notifySubscribers: options.notifySubscribers !== false,
        requestBody,
        media: {
          body: videoStream
        }
      });

      const videoId = response.data.id!;

      // Upload custom thumbnail if provided
      if (options.thumbnail && fs.existsSync(options.thumbnail)) {
        await this.setThumbnail(videoId, options.thumbnail);
      }

      // Add to playlist if specified
      if (options.playlist) {
        await this.addVideoToPlaylist(options.playlist, videoId);
      }

      console.log(`Video uploaded successfully! ID: ${videoId}`);
      console.log(`Watch URL: https://www.youtube.com/watch?v=${videoId}`);

      return videoId;
    } catch (error: any) {
      if (error.code === 403) {
        throw new Error('YouTube API quota exceeded or insufficient permissions');
      }
      throw new Error(`Video upload failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple videos in batch
   */
  async uploadVideoBatch(
    videos: Array<{ path: string; options: VideoUploadOptions }>,
    delayMs: number = 5000
  ): Promise<string[]> {
    const videoIds: string[] = [];

    for (let i = 0; i < videos.length; i++) {
      const { path, options } = videos[i];
      console.log(`\nUploading video ${i + 1}/${videos.length}...`);

      try {
        const videoId = await this.uploadVideo(path, options);
        videoIds.push(videoId);

        // Delay between uploads to avoid rate limiting
        if (i < videos.length - 1) {
          console.log(`Waiting ${delayMs}ms before next upload...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error: any) {
        console.error(`Failed to upload video ${i + 1}: ${error.message}`);
        throw error;
      }
    }

    return videoIds;
  }

  // ============================================================================
  // Video Scheduling Methods
  // ============================================================================

  /**
   * Schedule video for future publication
   */
  async scheduleVideo(options: ScheduleOptions): Promise<void> {
    try {
      await this.youtube.videos.update({
        part: ['status'],
        requestBody: {
          id: options.videoId,
          status: {
            privacyStatus: 'private',
            publishAt: options.publishAt.toISOString()
          }
        }
      });

      console.log(`Video ${options.videoId} scheduled for ${options.publishAt.toISOString()}`);
    } catch (error: any) {
      throw new Error(`Failed to schedule video: ${error.message}`);
    }
  }

  /**
   * Schedule multiple videos
   */
  async scheduleVideos(schedules: ScheduleOptions[]): Promise<void> {
    for (const schedule of schedules) {
      await this.scheduleVideo(schedule);
    }
    console.log(`Scheduled ${schedules.length} videos`);
  }

  /**
   * Cancel scheduled publication (set to private)
   */
  async cancelSchedule(videoId: string): Promise<void> {
    try {
      await this.youtube.videos.update({
        part: ['status'],
        requestBody: {
          id: videoId,
          status: {
            privacyStatus: 'private',
            publishAt: undefined
          }
        }
      });

      console.log(`Schedule cancelled for video ${videoId}`);
    } catch (error: any) {
      throw new Error(`Failed to cancel schedule: ${error.message}`);
    }
  }

  // ============================================================================
  // Metadata Management Methods
  // ============================================================================

  /**
   * Update video metadata
   */
  async updateMetadata(metadata: VideoMetadata): Promise<void> {
    try {
      // Get current video data
      const videoResponse = await this.youtube.videos.list({
        part: ['snippet'],
        id: [metadata.videoId]
      });

      if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
        throw new Error('Video not found');
      }

      const currentSnippet = videoResponse.data.items[0].snippet!;

      // Update with new metadata
      await this.youtube.videos.update({
        part: ['snippet'],
        requestBody: {
          id: metadata.videoId,
          snippet: {
            ...currentSnippet,
            title: metadata.title || currentSnippet.title,
            description: metadata.description || currentSnippet.description,
            tags: metadata.tags || currentSnippet.tags,
            categoryId: metadata.categoryId || currentSnippet.categoryId,
            defaultLanguage: metadata.defaultLanguage || currentSnippet.defaultLanguage
          }
        }
      });

      console.log(`Metadata updated for video ${metadata.videoId}`);
    } catch (error: any) {
      throw new Error(`Failed to update metadata: ${error.message}`);
    }
  }

  /**
   * Update metadata for multiple videos
   */
  async setBulkMetadata(metadataList: VideoMetadata[]): Promise<void> {
    console.log(`Updating metadata for ${metadataList.length} videos...`);

    for (let i = 0; i < metadataList.length; i++) {
      const metadata = metadataList[i];
      try {
        await this.updateMetadata(metadata);
        console.log(`Progress: ${i + 1}/${metadataList.length}`);

        // Small delay to avoid rate limiting
        if (i < metadataList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        console.error(`Failed to update video ${metadata.videoId}: ${error.message}`);
      }
    }

    console.log('Bulk metadata update complete');
  }

  /**
   * Set custom thumbnail for video
   */
  async setThumbnail(videoId: string, thumbnailPath: string): Promise<void> {
    try {
      if (!fs.existsSync(thumbnailPath)) {
        throw new Error(`Thumbnail file not found: ${thumbnailPath}`);
      }

      const thumbnailStream = fs.createReadStream(thumbnailPath);

      await this.youtube.thumbnails.set({
        videoId,
        media: {
          body: thumbnailStream
        }
      });

      console.log(`Thumbnail set for video ${videoId}`);
    } catch (error: any) {
      throw new Error(`Failed to set thumbnail: ${error.message}`);
    }
  }

  // ============================================================================
  // Playlist Management Methods
  // ============================================================================

  /**
   * Create new playlist
   */
  async createPlaylist(options: PlaylistOptions): Promise<string> {
    try {
      const response = await this.youtube.playlists.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: options.title,
            description: options.description || '',
            tags: options.tags,
            defaultLanguage: options.defaultLanguage || 'en'
          },
          status: {
            privacyStatus: options.privacyStatus
          }
        }
      });

      const playlistId = response.data.id!;
      console.log(`Playlist created: ${playlistId}`);
      console.log(`URL: https://www.youtube.com/playlist?list=${playlistId}`);

      return playlistId;
    } catch (error: any) {
      throw new Error(`Failed to create playlist: ${error.message}`);
    }
  }

  /**
   * Add video to playlist
   */
  async addVideoToPlaylist(playlistId: string, videoId: string, position?: number): Promise<void> {
    try {
      await this.youtube.playlistItems.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            playlistId,
            resourceId: {
              kind: 'youtube#video',
              videoId
            },
            position
          }
        }
      });

      console.log(`Video ${videoId} added to playlist ${playlistId}`);
    } catch (error: any) {
      throw new Error(`Failed to add video to playlist: ${error.message}`);
    }
  }

  /**
   * Add multiple videos to playlist
   */
  async addToPlaylist(playlistId: string, videoIds: string[]): Promise<void> {
    console.log(`Adding ${videoIds.length} videos to playlist ${playlistId}...`);

    for (let i = 0; i < videoIds.length; i++) {
      await this.addVideoToPlaylist(playlistId, videoIds[i], i);

      // Small delay to avoid rate limiting
      if (i < videoIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('All videos added to playlist');
  }

  /**
   * Remove video from playlist
   */
  async removeFromPlaylist(playlistItemId: string): Promise<void> {
    try {
      await this.youtube.playlistItems.delete({
        id: playlistItemId
      });

      console.log(`Video removed from playlist`);
    } catch (error: any) {
      throw new Error(`Failed to remove video from playlist: ${error.message}`);
    }
  }

  /**
   * Get all videos in playlist
   */
  async getPlaylistVideos(playlistId: string): Promise<string[]> {
    try {
      const videoIds: string[] = [];
      let pageToken: string | undefined;

      do {
        const response = await this.youtube.playlistItems.list({
          part: ['snippet'],
          playlistId,
          maxResults: 50,
          pageToken
        });

        response.data.items?.forEach(item => {
          if (item.snippet?.resourceId?.videoId) {
            videoIds.push(item.snippet.resourceId.videoId);
          }
        });

        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return videoIds;
    } catch (error: any) {
      throw new Error(`Failed to get playlist videos: ${error.message}`);
    }
  }

  // ============================================================================
  // Monetization Methods
  // ============================================================================

  /**
   * Enable monetization for video
   * Note: Requires YouTube Partner Program eligibility
   */
  async enableMonetization(options: MonetizationOptions): Promise<void> {
    try {
      // Note: Direct monetization API is limited to YouTube partners
      // This requires YouTube Content ID API access
      console.log(`Monetization settings are managed through YouTube Studio`);
      console.log(`Video ${options.videoId} must be monetized manually or via Content ID API`);
      console.log(`Ensure your channel is part of YouTube Partner Program`);

      // For partners with Content ID API access, you would use:
      // const youtube = google.youtube('v3');
      // await youtube.videos.update({...monetization settings...});

      throw new Error(
        'Monetization API requires YouTube Content ID API access. ' +
        'Please enable monetization through YouTube Studio or contact YouTube Partner support.'
      );
    } catch (error: any) {
      throw new Error(`Monetization setup failed: ${error.message}`);
    }
  }

  /**
   * Check if video is monetized
   */
  async checkMonetizationStatus(videoId: string): Promise<boolean> {
    try {
      const response = await this.youtube.videos.list({
        part: ['contentDetails', 'status'],
        id: [videoId]
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      // Monetization status is only available to content owners
      console.log('Monetization status must be checked in YouTube Studio');
      return false;
    } catch (error: any) {
      throw new Error(`Failed to check monetization status: ${error.message}`);
    }
  }

  // ============================================================================
  // Analytics & Performance Tracking Methods
  // ============================================================================

  /**
   * Get video statistics
   */
  async getVideoStatistics(videoId: string): Promise<VideoAnalytics> {
    try {
      const response = await this.youtube.videos.list({
        part: ['statistics', 'contentDetails', 'snippet'],
        id: [videoId]
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      const video = response.data.items[0];
      const stats = video.statistics!;
      const contentDetails = video.contentDetails!;
      const snippet = video.snippet!;

      return {
        videoId,
        views: parseInt(stats.viewCount || '0'),
        likes: parseInt(stats.likeCount || '0'),
        dislikes: parseInt(stats.dislikeCount || '0'),
        comments: parseInt(stats.commentCount || '0'),
        favorites: parseInt(stats.favoriteCount || '0'),
        duration: contentDetails.duration || '',
        publishedAt: snippet.publishedAt || ''
      };
    } catch (error: any) {
      throw new Error(`Failed to get video statistics: ${error.message}`);
    }
  }

  /**
   * Track performance of multiple videos
   */
  async trackPerformance(videoIds: string[]): Promise<VideoAnalytics[]> {
    console.log(`Tracking performance for ${videoIds.length} videos...`);

    const analytics: VideoAnalytics[] = [];

    for (const videoId of videoIds) {
      try {
        const stats = await this.getVideoStatistics(videoId);
        analytics.push(stats);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error: any) {
        console.error(`Failed to get stats for video ${videoId}: ${error.message}`);
      }
    }

    return analytics;
  }

  /**
   * Get channel statistics
   */
  async getChannelStatistics(): Promise<{
    subscribers: number;
    views: number;
    videos: number;
  }> {
    try {
      const response = await this.youtube.channels.list({
        part: ['statistics'],
        mine: true
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const stats = response.data.items[0].statistics!;

      return {
        subscribers: parseInt(stats.subscriberCount || '0'),
        views: parseInt(stats.viewCount || '0'),
        videos: parseInt(stats.videoCount || '0')
      };
    } catch (error: any) {
      throw new Error(`Failed to get channel statistics: ${error.message}`);
    }
  }

  /**
   * Get top performing videos
   */
  async getTopVideos(maxResults: number = 10): Promise<VideoAnalytics[]> {
    try {
      // Get all videos
      const response = await this.youtube.search.list({
        part: ['id'],
        forMine: true,
        type: ['video'],
        maxResults: 50,
        order: 'viewCount'
      });

      const videoIds = response.data.items
        ?.map(item => item.id?.videoId)
        .filter(Boolean) as string[];

      if (!videoIds || videoIds.length === 0) {
        return [];
      }

      // Get statistics for videos
      const analytics = await this.trackPerformance(videoIds.slice(0, maxResults));

      // Sort by views
      return analytics.sort((a, b) => b.views - a.views);
    } catch (error: any) {
      throw new Error(`Failed to get top videos: ${error.message}`);
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Get video details
   */
  async getVideoDetails(videoId: string): Promise<youtube_v3.Schema$Video> {
    try {
      const response = await this.youtube.videos.list({
        part: ['snippet', 'contentDetails', 'status', 'statistics'],
        id: [videoId]
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      return response.data.items[0];
    } catch (error: any) {
      throw new Error(`Failed to get video details: ${error.message}`);
    }
  }

  /**
   * Delete video
   */
  async deleteVideo(videoId: string): Promise<void> {
    try {
      await this.youtube.videos.delete({
        id: videoId
      });

      console.log(`Video ${videoId} deleted`);
    } catch (error: any) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }

  /**
   * Update video privacy status
   */
  async updatePrivacy(videoId: string, privacyStatus: 'public' | 'private' | 'unlisted'): Promise<void> {
    try {
      await this.youtube.videos.update({
        part: ['status'],
        requestBody: {
          id: videoId,
          status: {
            privacyStatus
          }
        }
      });

      console.log(`Video ${videoId} privacy updated to ${privacyStatus}`);
    } catch (error: any) {
      throw new Error(`Failed to update privacy: ${error.message}`);
    }
  }

  /**
   * Get available video categories
   */
  async getCategories(regionCode: string = 'US'): Promise<Array<{ id: string; title: string }>> {
    try {
      const response = await this.youtube.videoCategories.list({
        part: ['snippet'],
        regionCode
      });

      return response.data.items?.map(item => ({
        id: item.id || '',
        title: item.snippet?.title || ''
      })) || [];
    } catch (error: any) {
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }

  /**
   * Search for videos
   */
  async searchVideos(query: string, maxResults: number = 10): Promise<string[]> {
    try {
      const response = await this.youtube.search.list({
        part: ['id'],
        q: query,
        type: ['video'],
        maxResults
      });

      return response.data.items
        ?.map(item => item.id?.videoId)
        .filter(Boolean) as string[];
    } catch (error: any) {
      throw new Error(`Failed to search videos: ${error.message}`);
    }
  }
}

export default YouTubeAutomation;
