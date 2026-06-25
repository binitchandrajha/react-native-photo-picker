import ModernPhotoPicker from './NativeModernPhotoPicker';
import type { PhotoAsset } from './NativeModernPhotoPicker';

export function pickImage(): Promise<PhotoAsset | null> {
  return ModernPhotoPicker.pickImage();
}

export function pickImages(max: number = 0): Promise<PhotoAsset[]> {
  return ModernPhotoPicker.pickImages(max);
}
