//Web/default fallback

import type { PhotoAsset } from './NativeModernPhotoPicker';

export function pickImage(): Promise<PhotoAsset | null> {
  throw new Error('Photo picker is only for native(Android/iOS)');
}

export function pickImages(_max: number = 0): Promise<PhotoAsset[]> {
  throw new Error('Photo picker is only for native(Android/iOS)');
}
