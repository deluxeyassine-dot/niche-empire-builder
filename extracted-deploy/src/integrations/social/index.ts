/**
 * Social Media Integrations
 *
 * Export all social media API integrations
 */

export { YouTubeAPI, type YouTubeConfig, type VideoUploadOptions, type YouTubeVideo } from './YouTubeAPI';
export { InstagramAPI, type InstagramConfig, type MediaUploadOptions, type InstagramMedia } from './InstagramAPI';
export { TikTokAPI, type TikTokConfig, type VideoUploadOptions as TikTokVideoOptions, type TikTokVideo } from './TikTokAPI';
export { PinterestAPI, type PinterestConfig, type PinOptions, type PinterestPin, type PinterestBoard } from './PinterestAPI';

// Re-export additional types
export type { PlaylistOptions, CommentOptions, YouTubePlaylist } from './YouTubeAPI';
export type { StoryOptions, ReelOptions } from './InstagramAPI';
export type { TikTokUserInfo } from './TikTokAPI';
export type { BoardOptions } from './PinterestAPI';
