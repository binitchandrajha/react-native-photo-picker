package com.modernphotopicker

import android.app.Activity
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.provider.MediaStore
import android.provider.OpenableColumns
import androidx.activity.result.contract.ActivityResultContracts.PickVisualMedia
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap

class ModernPhotoPickerModule(reactContext: ReactApplicationContext) :
  NativeModernPhotoPickerSpec(reactContext), ActivityEventListener {

  init {
    reactContext.addActivityEventListener(this)
  }

  private var pendingPromise: Promise? = null
  private var singleMode: Boolean = false

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  override fun pickImage(promise: Promise) {
    singleMode = true
    launchPicker(promise, 1)
  }

  override fun pickImages(max: Double, promise: Promise) {
    singleMode = false
    launchPicker(promise, max.toInt())
  }

  private fun launchPicker(promise: Promise, max: Int) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity not found")
      return
    }
    if (pendingPromise != null) {
      promise.reject("PICKER_BUSY", "Already processing")
      return
    }
    pendingPromise = promise

    val intent = if (PickVisualMedia.isPhotoPickerAvailable(reactApplicationContext)) {
      // Modern photo picker
      Intent(MediaStore.ACTION_PICK_IMAGES).apply {
        type = "image/*"
        if (max > 1) putExtra(MediaStore.EXTRA_PICK_IMAGES_MAX, max)
      }
    } else {
      // For older phones
      Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
        type = "image/*"
        addCategory(Intent.CATEGORY_OPENABLE)
        if (max != 1) putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
      }
    }

    try {
      activity.startActivityForResult(intent, PICK_REQUEST)
    } catch (e: Exception) {
      pendingPromise = null
      promise.reject("LAUNCH_FAILED", e)
    }
  }

  override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode != PICK_REQUEST) return
    val promise = pendingPromise ?: return
    pendingPromise = null

    if (resultCode != Activity.RESULT_OK || data == null) {
      if (singleMode) promise.resolve(null) else promise.resolve(Arguments.createArray())
      return
    }

    val uris = mutableListOf<Uri>()
    data.clipData?.let { clip ->
      for (i in 0 until clip.itemCount) uris.add(clip.getItemAt(i).uri)
    }
    if (uris.isEmpty()) data.data?.let { uris.add(it) }

    if (singleMode) {
      promise.resolve(uris.firstOrNull()?.let { buildAssetMap(it) })
    } else {
      val arr = Arguments.createArray()
      uris.forEach { arr.pushMap(buildAssetMap(it)) }
      promise.resolve(arr)
    }
  }

  override fun onNewIntent(intent: Intent) {
    // ActivityEventListener
  }

  private fun buildAssetMap(uri: Uri): WritableMap {
    val map = Arguments.createMap()
    val resolver = reactApplicationContext.contentResolver
    map.putString("uri", uri.toString())
    map.putString("mimeType", resolver.getType(uri) ?: "image/*")

    // fileName aur fileSize
    resolver.query(uri, null, null, null, null)?.use { c ->
      val nameIdx = c.getColumnIndex(OpenableColumns.DISPLAY_NAME)
      val sizeIdx = c.getColumnIndex(OpenableColumns.SIZE)
      if (c.moveToFirst()) {
        map.putString("fileName", if (nameIdx >= 0) c.getString(nameIdx) ?: "" else "")
        map.putDouble(
          "fileSize",
          if (sizeIdx >= 0 && !c.isNull(sizeIdx)) c.getLong(sizeIdx).toDouble() else 0.0
        )
      }
    }

    // width aur height
    try {
      resolver.openInputStream(uri)?.use { stream ->
        val opts = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeStream(stream, null, opts)
        map.putInt("width", opts.outWidth)
        map.putInt("height", opts.outHeight)
      }
    } catch (e: Exception) {
      map.putInt("width", 0)
      map.putInt("height", 0)
    }

    return map
  }

  companion object {
    const val NAME = NativeModernPhotoPickerSpec.NAME
    private const val PICK_REQUEST = 7654
  }
}
