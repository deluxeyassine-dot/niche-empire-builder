import axios, { AxiosInstance } from 'axios';

/**
 * Pinterest API Integration
 *
 * Full integration with Pinterest for:
 * - Pin creation
 * - Board management
 * - Analytics and insights
 * - Catalog management
 * - Shopping integration
 *
 * Perfect for:
 * - Product marketing
 * - Visual content distribution
 * - E-commerce integration
 * - Traffic generation
 */

export interface PinterestConfig {
  accessToken: string;
  clientId?: string;
  clientSecret?: string;
}

export interface PinOptions {
  boardId: string;
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  imageBase64?: string;
  altText?: string;
  dominantColor?: string;
}

export interface BoardOptions {
  name: string;
  description?: string;
  privacy?: 'PUBLIC' | 'PROTECTED' | 'SECRET';
}

export interface PinterestPin {
  id: string;
  created_at: string;
  link: string;
  title: string;
  description: string;
  board_id: string;
  media: {
    media_type: string;
    images: any;
  };
  alt_text: string;
  dominant_color: string;
}

export interface PinterestBoard {
  id: string;
  name: string;
  description: string;
  privacy: string;
  created_at: string;
  pin_count: number;
  follower_count: number;
  image_thumbnail_url: string;
}

export class PinterestAPI {
  private client: AxiosInstance;
  private config: PinterestConfig;
  private baseURL = 'https://api.pinterest.com/v5';

  constructor(config: PinterestConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });
  }

  /**
   * AUTHENTICATION
   */

  /**
   * Get authorization URL
   */
  getAuthorizationUrl(redirectUri: string, scope?: string[], state?: string): string {
    const defaultScope = [
      'boards:read',
      'boards:write',
      'pins:read',
      'pins:write',
      'user_accounts:read',
      'catalogs:read',
      'catalogs:write',
    ];

    const params = new URLSearchParams({
      client_id: this.config.clientId || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: (scope || defaultScope).join(','),
      state: state || Math.random().toString(36).substring(7),
    });

    return `https://www.pinterest.com/oauth/?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  }> {
    const response = await axios.post('https://api.pinterest.com/v5/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }, {
      auth: {
        username: this.config.clientId || '',
        password: this.config.clientSecret || '',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.config.accessToken = response.data.access_token;

    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await axios.post('https://api.pinterest.com/v5/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }, {
      auth: {
        username: this.config.clientId || '',
        password: this.config.clientSecret || '',
      },
    });

    this.config.accessToken = response.data.access_token;

    return response.data.access_token;
  }

  /**
   * PIN MANAGEMENT
   */

  /**
   * Create a pin
   */
  async createPin(options: PinOptions): Promise<PinterestPin> {
    const pinData: any = {
      board_id: options.boardId,
      title: options.title,
      description: options.description || '',
      link: options.link,
      alt_text: options.altText,
      dominant_color: options.dominantColor,
    };

    if (options.imageUrl) {
      pinData.media_source = {
        source_type: 'image_url',
        url: options.imageUrl,
      };
    } else if (options.imageBase64) {
      pinData.media_source = {
        source_type: 'image_base64',
        data: options.imageBase64,
      };
    }

    const response = await this.client.post('/pins', pinData);

    return response.data;
  }

  /**
   * Get pin details
   */
  async getPin(pinId: string): Promise<PinterestPin> {
    const response = await this.client.get(`/pins/${pinId}`);
    return response.data;
  }

  /**
   * Update pin
   */
  async updatePin(pinId: string, updates: Partial<PinOptions>): Promise<PinterestPin> {
    const response = await this.client.patch(`/pins/${pinId}`, {
      title: updates.title,
      description: updates.description,
      link: updates.link,
      alt_text: updates.altText,
    });

    return response.data;
  }

  /**
   * Delete pin
   */
  async deletePin(pinId: string): Promise<void> {
    await this.client.delete(`/pins/${pinId}`);
  }

  /**
   * Get user's pins
   */
  async getUserPins(pageSize = 25): Promise<PinterestPin[]> {
    const response = await this.client.get('/pins', {
      params: {
        page_size: pageSize,
      },
    });

    return response.data.items || [];
  }

  /**
   * BOARD MANAGEMENT
   */

  /**
   * Create board
   */
  async createBoard(options: BoardOptions): Promise<PinterestBoard> {
    const response = await this.client.post('/boards', {
      name: options.name,
      description: options.description || '',
      privacy: options.privacy || 'PUBLIC',
    });

    return response.data;
  }

  /**
   * Get board
   */
  async getBoard(boardId: string): Promise<PinterestBoard> {
    const response = await this.client.get(`/boards/${boardId}`);
    return response.data;
  }

  /**
   * Get board pins
   */
  async getBoardPins(boardId: string, pageSize = 25): Promise<PinterestPin[]> {
    const response = await this.client.get(`/boards/${boardId}/pins`, {
      params: {
        page_size: pageSize,
      },
    });

    return response.data.items || [];
  }

  /**
   * Update board
   */
  async updateBoard(boardId: string, updates: Partial<BoardOptions>): Promise<PinterestBoard> {
    const response = await this.client.patch(`/boards/${boardId}`, {
      name: updates.name,
      description: updates.description,
      privacy: updates.privacy,
    });

    return response.data;
  }

  /**
   * Delete board
   */
  async deleteBoard(boardId: string): Promise<void> {
    await this.client.delete(`/boards/${boardId}`);
  }

  /**
   * List user boards
   */
  async getUserBoards(pageSize = 25): Promise<PinterestBoard[]> {
    const response = await this.client.get('/boards', {
      params: {
        page_size: pageSize,
      },
    });

    return response.data.items || [];
  }

  /**
   * ANALYTICS
   */

  /**
   * Get pin analytics
   */
  async getPinAnalytics(
    pinId: string,
    startDate: string,
    endDate: string,
    metricTypes: string[] = ['IMPRESSION', 'SAVE', 'PIN_CLICK', 'OUTBOUND_CLICK']
  ): Promise<any> {
    const response = await this.client.get(`/pins/${pinId}/analytics`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        metric_types: metricTypes.join(','),
      },
    });

    return response.data;
  }

  /**
   * Get board analytics
   */
  async getBoardAnalytics(
    boardId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const response = await this.client.get(`/boards/${boardId}/analytics`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });

    return response.data;
  }

  /**
   * Get user account analytics
   */
  async getUserAnalytics(startDate: string, endDate: string): Promise<any> {
    const response = await this.client.get('/user_account/analytics', {
      params: {
        start_date: startDate,
        end_date: endDate,
        metric_types: 'IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK,ENGAGEMENT',
      },
    });

    return response.data;
  }

  /**
   * Get top pins
   */
  async getTopPins(
    startDate: string,
    endDate: string,
    sortBy: 'IMPRESSION' | 'SAVE' | 'OUTBOUND_CLICK' = 'IMPRESSION'
  ): Promise<any[]> {
    const response = await this.client.get('/user_account/analytics/top_pins', {
      params: {
        start_date: startDate,
        end_date: endDate,
        sort_by: sortBy,
        from_claimed_content: 'Both',
        pin_format: 'all',
      },
    });

    return response.data.items || [];
  }

  /**
   * USER ACCOUNT
   */

  /**
   * Get user account info
   */
  async getUserAccount(): Promise<any> {
    const response = await this.client.get('/user_account');
    return response.data;
  }

  /**
   * CATALOG MANAGEMENT (For Shopping)
   */

  /**
   * Create catalog
   */
  async createCatalog(name: string, catalogType: 'RETAIL' | 'HOTEL' = 'RETAIL'): Promise<any> {
    const response = await this.client.post('/catalogs', {
      name,
      catalog_type: catalogType,
    });

    return response.data;
  }

  /**
   * Get catalogs
   */
  async getCatalogs(): Promise<any[]> {
    const response = await this.client.get('/catalogs');
    return response.data.items || [];
  }

  /**
   * Upload catalog feed
   */
  async uploadCatalogFeed(catalogId: string, feedUrl: string, format: 'TSV' | 'CSV' | 'XML' = 'TSV'): Promise<any> {
    const response = await this.client.post(`/catalogs/${catalogId}/feeds`, {
      name: 'Product Feed',
      format,
      location: feedUrl,
    });

    return response.data;
  }

  /**
   * SEARCH
   */

  /**
   * Search pins
   */
  async searchPins(query: string, pageSize = 25): Promise<any[]> {
    const response = await this.client.get('/search/pins', {
      params: {
        query,
        page_size: pageSize,
      },
    });

    return response.data.items || [];
  }

  /**
   * Search boards
   */
  async searchBoards(query: string, pageSize = 25): Promise<any[]> {
    const response = await this.client.get('/search/boards', {
      params: {
        query,
        page_size: pageSize,
      },
    });

    return response.data.items || [];
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Batch create pins
   */
  async batchCreatePins(pins: PinOptions[]): Promise<PinterestPin[]> {
    const createdPins: PinterestPin[] = [];

    for (const pinOptions of pins) {
      try {
        const pin = await this.createPin(pinOptions);
        createdPins.push(pin);
        console.log(`✅ Created pin: ${pinOptions.title}`);

        // Rate limiting - Pinterest has strict limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error: any) {
        console.error(`❌ Failed to create pin ${pinOptions.title}:`, error.message);
      }
    }

    return createdPins;
  }

  /**
   * Create pins from product catalog
   */
  async createPinsFromCatalog(
    boardId: string,
    products: Array<{
      title: string;
      description: string;
      imageUrl: string;
      link: string;
    }>
  ): Promise<PinterestPin[]> {
    const pins = products.map(product => ({
      boardId,
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
      link: product.link,
    }));

    return this.batchCreatePins(pins);
  }

  /**
   * Get trending topics (Pinterest Trends API)
   */
  async getTrendingTopics(region = 'US'): Promise<any[]> {
    try {
      const response = await this.client.get('/trends/keywords', {
        params: {
          region,
          trend_type: 'growing',
        },
      });

      return response.data.trends || [];
    } catch (error) {
      // Trends API may not be available for all accounts
      return [];
    }
  }

  /**
   * Get optimal pin dimensions
   */
  getOptimalPinDimensions(): { width: number; height: number }[] {
    return [
      { width: 1000, height: 1500 }, // Standard pin
      { width: 1000, height: 2100 }, // Long pin
      { width: 600, height: 900 },   // Square-ish
    ];
  }

  /**
   * Schedule pin (Note: Requires third-party scheduler)
   */
  schedulePin(options: PinOptions, publishAt: Date): any {
    // Pinterest doesn't have native scheduling
    // This would integrate with scheduling services
    return {
      ...options,
      publishAt,
      status: 'scheduled',
      note: 'Requires scheduling service integration',
    };
  }
}

export default PinterestAPI;
