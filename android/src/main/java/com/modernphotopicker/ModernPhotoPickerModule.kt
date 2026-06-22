package com.modernphotopicker

import com.facebook.react.bridge.ReactApplicationContext

class ModernPhotoPickerModule(reactContext: ReactApplicationContext) :
  NativeModernPhotoPickerSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeModernPhotoPickerSpec.NAME
  }
}
