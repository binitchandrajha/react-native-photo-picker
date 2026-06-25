import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface PhotoAsset {
  uri: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
}

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;

  //Single Image
  pickImage(): Promise<PhotoAsset | null>;

  //Multiple Image
  pickImages(max: number): Promise<PhotoAsset[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ModernPhotoPicker');
