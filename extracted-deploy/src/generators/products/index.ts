/**
 * Product Generators
 *
 * Export all product generators for creating digital products
 */

export { WallArtGenerator, type WallArtConfig, type WallArtProduct } from './WallArtGenerator';
export { ClipartGenerator, type ClipartConfig, type ClipartBundle, type ClipartElement } from './ClipartGenerator';
export { ColoringBookGenerator, type ColoringBookConfig, type ColoringBook, type ColoringPage } from './ColoringBookGenerator';
export { KDPInteriorGenerator, type KDPInteriorConfig, type KDPInterior } from './KDPInteriorGenerator';
export { KDPCoverGenerator, type KDPCoverConfig, type KDPCover } from './KDPCoverGenerator';

// Re-export all types
export type { PrintSize } from './WallArtGenerator';
