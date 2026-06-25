# react-native-modern-photo-picker

[![npm version](https://img.shields.io/npm/v/react-native-modern-photo-picker.svg)](https://www.npmjs.com/package/react-native-modern-photo-picker)
[![license](https://img.shields.io/npm/l/react-native-modern-photo-picker.svg)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-Android-3ddc84.svg)](https://developer.android.com/training/data-storage/shared/photo-picker)

A **Kotlin-based** React Native native module that gives you access to Android's modern [**Photo Picker**](https://developer.android.com/training/data-storage/shared/photo-picker) API — pick single or multiple images with a clean, system-provided UI.

> ✨ **No runtime permissions required.** The Android Photo Picker runs in its own secure system process and only shares the photos the user explicitly selects — so you never have to ask for `READ_MEDIA_IMAGES` or storage permissions.

Built on the **New Architecture (TurboModules)** for fast, type-safe JS ↔ native communication.

---

## 📸 Demo

| Pick One Image | Pick Multiple Images |
| :---: | :---: |
| <!-- Drag & drop your "pick one" video here on GitHub --> | <!-- Drag & drop your "pick multiple" video here on GitHub --> |


https://github.com/user-attachments/assets/21ec84d7-dba7-4ac8-bd52-ba26e67bfdfc


> **How to add your demo videos:** Open this README on GitHub → click **Edit (✏️)** → drag and drop your `.mp4` files into the cells above. GitHub will automatically upload them and insert a playable link. Then commit the change.

---

## ✨ Features

- 🖼️ **Single** and **multiple** image selection
- 🔒 **Zero permissions** — uses Android's privacy-friendly Photo Picker
- 📦 Returns rich **metadata**: `uri`, `fileName`, `mimeType`, `fileSize`, `width`, `height`
- ⚡ **New Architecture** (TurboModule) — type-safe bridge
- 🪶 **No file copying** — returns lightweight `content://` URIs that `<Image>` can render directly
- 🛡️ Graceful **fallback** to the document picker on older devices

---

## 📥 Installation

```sh
npm install react-native-modern-photo-picker
```

or with Yarn:

```sh
yarn add react-native-modern-photo-picker
```

Then rebuild your app:

```sh
npx react-native run-android
```

> Requires the **New Architecture** enabled (default in React Native 0.76+).

---

## 🚀 Usage

```tsx
import { pickImage, pickImages, type PhotoAsset } from 'react-native-modern-photo-picker';
import { Image } from 'react-native';

// Pick a single image
async function selectOne() {
  const asset = await pickImage();
  if (asset) {
    console.log(asset.uri, asset.fileName, asset.fileSize);
  }
  // asset is `null` if the user cancels
}

// Pick multiple images (max 5)
async function selectMany() {
  const assets = await pickImages(5);
  console.log(`Selected ${assets.length} images`);
  // returns an empty array if the user cancels
}
```

Render a selected image directly from its `content://` URI:

```tsx
<Image source={{ uri: asset.uri }} style={{ width: 200, height: 200 }} />
```

---

## 📚 API Reference

### `pickImage(): Promise<PhotoAsset | null>`

Opens the picker for a **single** image. Resolves with a [`PhotoAsset`](#photoasset), or `null` if the user cancels.

### `pickImages(max: number): Promise<PhotoAsset[]>`

Opens the picker for **multiple** images.

| Param | Type | Description |
| :--- | :--- | :--- |
| `max` | `number` | Maximum number of images the user can select. Pass `0` for the system default. |

Resolves with an array of [`PhotoAsset`](#photoasset). Returns an **empty array** if the user cancels.

### `PhotoAsset`

```ts
interface PhotoAsset {
  uri: string;        // content:// URI (use directly with <Image />)
  fileName: string;   // e.g. "IMG_2024.jpg"
  mimeType: string;   // e.g. "image/jpeg"
  fileSize: number;   // size in bytes
  width: number;      // pixel width
  height: number;     // pixel height
}
```

### Errors

The promise **rejects** with one of these codes:

| Code | Meaning |
| :--- | :--- |
| `NO_ACTIVITY` | The app's activity wasn't available (e.g. running in the background). |
| `PICKER_BUSY` | A pick request is already in progress. |
| `LAUNCH_FAILED` | The picker intent failed to launch. |

Always wrap calls in `try/catch`:

```tsx
try {
  const asset = await pickImage();
} catch (e) {
  console.warn(e);
}
```

---

## 📱 Platform Support

| Platform | Status |
| :--- | :--- |
| **Android** | ✅ Fully supported (API 24+) |
| **iOS** | 🚧 Not yet implemented |

On Android 13+ (or devices with the Google Play system update), the **modern Photo Picker** is used. On older devices, it automatically falls back to the document picker (`ACTION_OPEN_DOCUMENT`).

---

## 🛣️ Roadmap

- [ ] iOS support (`PHPickerViewController`)
- [ ] Video selection
- [ ] Optional copy-to-cache (`file://` paths) for uploads
- [ ] Configurable mime-type filtering

---

## 🤝 Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

---

## 📄 License

MIT © [Binit Chandra Jha](https://github.com/binitchandrajha)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
