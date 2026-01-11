/**
 * All Integrations Export
 *
 * Central export for all marketplace and service integrations
 */

// Marketplace Integrations
export { EtsyAPI, type EtsyConfig, type EtsyListing, type EtsyOrder } from './EtsyAPI';
export { GumroadAPI, type GumroadConfig, type GumroadProduct, type GumroadSale } from './GumroadAPI';
export { ShopifyAPI, type ShopifyConfig, type ShopifyProduct, type ShopifyOrder } from './ShopifyAPI';
export { PrintfulAPI, type PrintfulConfig, type PrintfulProduct, type PrintfulOrder } from './PrintfulAPI';

// Social Media Integrations
export {
  YouTubeAPI,
  InstagramAPI,
  TikTokAPI,
  PinterestAPI,
} from './social';

// Re-export social media types
export type {
  YouTubeConfig,
  InstagramConfig,
  TikTokConfig,
  PinterestConfig,
} from './social';

// Re-export additional marketplace types
export type {
  EtsyShippingProfile,
  EtsyTransaction,
} from './EtsyAPI';

export type {
  CustomField,
  ProductVariant,
  VariantOption,
  GumroadSubscriber,
  WebhookPayload,
} from './GumroadAPI';

export type {
  ShopifyVariant,
  ShopifyImage,
  ShopifyOption,
  ShopifyCollection,
} from './ShopifyAPI';

export type {
  PrintfulSyncProduct,
  PrintfulSyncVariant,
  PrintfulOrderItem,
} from './PrintfulAPI';
