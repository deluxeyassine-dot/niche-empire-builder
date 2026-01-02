import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';
import FormData from 'form-data';

/**
 * YouTube Data API v3 Integration
 *
 * Full integration with YouTube for:
 * - Video uploads
 * - Playlist management
 * - Channel management
 * - Comment management
 * - Analytics retrieval
 * - Live streaming
 *
 * Perfect for:
 * - Automated content posting
 * - Multi-channel management
 * - Analytics tracking
 * - Engagement automation
 */

export interface YouTubeConfig {
  apiKey: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface VideoUploadOptions {
  title: string;
  description: string;
  tags?: string[];
  categoryId?: string;
  privacyStatus: 'public' | 'private' | 'unlisted';
  publishAt?: string; // ISO 8601 timestamp for scheduled publishing
  thumbnail?: string; // Path to thumbnail image
  playlist?: string; // Playlist ID to add video to
  madeForKids?: boolean;
  selfDeclaredMadeForKids?: boolean;
}

export interface PlaylistOptions {
  title: string;
  description?: string;
  privacyStatus?: 'public' | 'private' | 'unlisted';
  tags?: string[];
}

export interface CommentOptions {
  text: string;
  videoId: string;
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    thumbnails: any;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  status: {
    uploadStatus: string;
    privacyStatus: string;
    publishAt?: string;
  };
}

export interface YouTubePlaylist {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
  };
  contentDetails: {
    itemCount: number;
  };
}

export class YouTubeAPI {
  private client: AxiosInstance;
  private config: YouTubeConfig;
  private baseURL = 'https://www.googleapis.com/youtube/v3';
  private uploadURL = 'https://www.googleapis.com/upload/youtube/v3';

  constructor(config: YouTubeConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 300000, // 5 minutes for uploads
    });
  }

  /**
   * AUTHENTICATION
   */

  /**
   * Get OAuth authorization URL
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl',
    ];

    const params = new URLSearchParams({
      client_id: this.config.clientId || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      state: state || '',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    this.config.accessToken = response.data.access_token;
    this.config.refreshToken = response.data.refresh_token;

    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.config.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('https://oauth2.googleapis.com/token', {
      refresh_token: this.config.refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'refresh_token',
    });

    this.config.accessToken = response.data.access_token;
    return response.data.access_token;
  }

  /**
   * VIDEO MANAGEMENT
   */

  /**
   * Upload video
   */
  async uploadVideo(videoPath: string, options: VideoUploadOptions): Promise<YouTubeVideo> {
    if (!this.config.accessToken) {
      throw new Error('Access token required for video upload');
    }

    // Step 1: Create video metadata
    const metadata = {
      snippet: {
        title: options.title,
        description: options.description,
        tags: options.tags || [],
        categoryId: options.categoryId || '22', // People & Blogs
      },
      status: {
        privacyStatus: options.privacyStatus,
        publishAt: options.publishAt,
        selfDeclaredMadeForKids: options.selfDeclaredMadeForKids || false,
        madeForKids: options.madeForKids || false,
      },
    };

    // Step 2: Upload video file
    const fileBuffer = await fs.readFile(videoPath);
    const form = new FormData();
    form.append('video', fileBuffer, { filename: 'video.mp4' });
    form.append('metadata', JSON.stringify(metadata), {
      contentType: 'application/json',
    });

    const response = await axios.post(`${this.uploadURL}/videos`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      params: {
        part: 'snippet,status',
        uploadType: 'multipart',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    const video = response.data;

    // Step 3: Upload thumbnail if provided
    if (options.thumbnail) {
      await this.uploadThumbnail(video.id, options.thumbnail);
    }

    // Step 4: Add to playlist if specified
    if (options.playlist) {
      await this.addVideoToPlaylist(options.playlist, video.id);
    }

    return video;
  }

  /**
   * Upload thumbnail
   */
  async uploadThumbnail(videoId: string, thumbnailPath: string): Promise<void> {
    const thumbnailBuffer = await fs.readFile(thumbnailPath);

    await axios.post(
      `${this.uploadURL}/thumbnails/set`,
      thumbnailBuffer,
      {
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          'Content-Type': 'image/jpeg',
        },
        params: {
          videoId,
        },
      }
    );
  }

  /**
   * Get video details
   */
  async getVideo(videoId: string): Promise<YouTubeVideo> {
    const response = await this.client.get('/videos', {
      params: {
        part: 'snippet,statistics,status',
        id: videoId,
        key: this.config.apiKey,
      },
    });

    return response.data.items[0];
  }

  /**
   * List channel videos
   */
  async getChannelVideos(channelId: string, maxResults = 50): Promise<YouTubeVideo[]> {
    const response = await this.client.get('/search', {
      params: {
        part: 'snippet',
        channelId,
        maxResults,
        order: 'date',
        type: 'video',
        key: this.config.apiKey,
      },
    });

    return response.data.items || [];
  }

  /**
   * Update video details
   */
  async updateVideo(videoId: string, updates: Partial<VideoUploadOptions>): Promise<YouTubeVideo> {
    const video = await this.getVideo(videoId);

    const updatedSnippet = {
      ...video.snippet,
      title: updates.title || video.snippet.title,
      description: updates.description || video.snippet.description,
      tags: updates.tags || video.snippet.tags,
      categoryId: updates.categoryId || video.snippet.categoryId,
    };

    const response = await this.client.put('/videos', {
      id: videoId,
      snippet: updatedSnippet,
      status: {
        ...video.status,
        privacyStatus: updates.privacyStatus || video.status.privacyStatus,
      },
    }, {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      params: {
        part: 'snippet,status',
      },
    });

    return response.data;
  }

  /**
   * Delete video
   */
  async deleteVideo(videoId: string): Promise<void> {
    await this.client.delete('/videos', {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      params: {
        id: videoId,
      },
    });
  }

  /**
   * PLAYLIST MANAGEMENT
   */

  /**
   * Create playlist
   */
  async createPlaylist(options: PlaylistOptions): Promise<YouTubePlaylist> {
    const response = await this.client.post('/playlists', {
      snippet: {
        title: options.title,
        description: options.description || '',
        tags: options.tags || [],
      },
      status: {
        privacyStatus: options.privacyStatus || 'public',
      },
    }, {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      params: {
        part: 'snippet,status',
      },
    });

    return response.data;
  }

  /**
   * Get playlist
   */
  async getPlaylist(playlistId: string): Promise<YouTubePlaylist> {
    const response = await this.client.get('/playlists', {
      params: {
        part: 'snippet,contentDetails',
        id: playlistId,
        key: this.config.apiKey,
      },
    });

    return response.data.items[0];
  }

  /**
   * List channel playlists
   */
  async getChannelPlaylists(channelId: string): Promise<YouTubePlaylist[]> {
    const response = await this.client.get('/playlists', {
      params: {
        part: 'snippet,contentDetails',
        channelId,
        maxResults: 50,
        key: this.config.apiKey,
      },
    });

    return response.data.items || [];
  }

  /**
   * Add video to playlist
   */
  async addVideoToPlaylist(playlistId: string, videoId: string): Promise<any> {
    const response = await this.client.post('/playlistItems', {
      snippet: {
        playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId,
        },
      },
    }, {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      params: {
        part: 'snippet',
      },
    });

    return response.data;
  }

  /**
   * Remove video from playlist
   */
  async removeVideoFromPlaylist(playlistItemId: string): Promise<void> {
    await this.client.delete('/playlistItems', {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      params: {
        id: playlistItemId,
      },
    });
  }

  /**
   * COMMENT MANAGEMENT
   */

  /**
   * Post comment
   */
  async postComment(options: CommentOptions): Promise<any> {
    const response = await this.client.post('/commentThreads', {
      snippet: {
        videoId: options.videoId,
        topLevelComment: {
          snippet: {
            textOriginal: options.text,
          },
        },
      },
    }, {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      params: {
        part: 'snippet',
      },
    });

    return response.data;
  }

  /**
   * Reply to comment
   */
  async replyToComment(commentId: string, text: string): Promise<any> {
    const response = await this.client.post('/comments', {
      snippet: {
        parentId: commentId,
        textOriginal: text,
      },
    }, {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      params: {
        part: 'snippet',
      },
    });

    return response.data;
  }

  /**
   * Get video comments
   */
  async getVideoComments(videoId: string, maxResults = 100): Promise<any[]> {
    const response = await this.client.get('/commentThreads', {
      params: {
        part: 'snippet',
        videoId,
        maxResults,
        order: 'relevance',
        key: this.config.apiKey,
      },
    });

    return response.data.items || [];
  }

  /**
   * CHANNEL MANAGEMENT
   */

  /**
   * Get channel info
   */
  async getChannelInfo(channelId?: string): Promise<any> {
    const response = await this.client.get('/channels', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: channelId,
        mine: !channelId,
        key: this.config.apiKey,
      },
      headers: channelId ? {} : {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
    });

    return response.data.items[0];
  }

  /**
   * Get channel analytics
   */
  async getChannelAnalytics(channelId: string, startDate: string, endDate: string): Promise<any> {
    // Note: Requires YouTube Analytics API
    const response = await axios.get('https://youtubeanalytics.googleapis.com/v2/reports', {
      params: {
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained',
        dimensions: 'day',
      },
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
    });

    return response.data;
  }

  /**
   * SEARCH
   */

  /**
   * Search videos
   */
  async searchVideos(query: string, maxResults = 50): Promise<any[]> {
    const response = await this.client.get('/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        order: 'relevance',
        key: this.config.apiKey,
      },
    });

    return response.data.items || [];
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Get video categories
   */
  async getVideoCategories(regionCode = 'US'): Promise<any[]> {
    const response = await this.client.get('/videoCategories', {
      params: {
        part: 'snippet',
        regionCode,
        key: this.config.apiKey,
      },
    });

    return response.data.items || [];
  }

  /**
   * Batch upload videos
   */
  async batchUploadVideos(
    videos: Array<{ path: string; options: VideoUploadOptions }>
  ): Promise<YouTubeVideo[]> {
    const uploadedVideos: YouTubeVideo[] = [];

    for (const video of videos) {
      try {
        const uploaded = await this.uploadVideo(video.path, video.options);
        uploadedVideos.push(uploaded);
        console.log(`✅ Uploaded: ${video.options.title}`);
      } catch (error: any) {
        console.error(`❌ Failed to upload ${video.options.title}:`, error.message);
      }
    }

    return uploadedVideos;
  }

  /**
   * Schedule video publish
   */
  async scheduleVideo(
    videoPath: string,
    options: VideoUploadOptions,
    publishAt: Date
  ): Promise<YouTubeVideo> {
    return this.uploadVideo(videoPath, {
      ...options,
      privacyStatus: 'private',
      publishAt: publishAt.toISOString(),
    });
  }
}

export default YouTubeAPI;
