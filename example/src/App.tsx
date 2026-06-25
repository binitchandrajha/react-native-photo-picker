import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {
  pickImage,
  pickImages,
  type PhotoAsset,
} from 'react-native-modern-photo-picker';

function formatSize(bytes: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function App() {
  const [assets, setAssets] = useState<PhotoAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const onPickOne = async () => {
    try {
      setLoading(true);
      const asset = await pickImage();
      setAssets(asset ? [asset] : []);
    } catch (e) {
      console.warn('pickImage error:', e);
    } finally {
      setLoading(false);
    }
  };

  const onPickMany = async () => {
    try {
      setLoading(true);
      const result = await pickImages(5);
      setAssets(result);
    } catch (e) {
      console.warn('pickImages error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5B21B6" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🖼️</Text>
          <Text style={styles.title}>Modern Photo Picker</Text>
          <Text style={styles.subtitle}>
            Android's native picker — fast & private
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🔒 No permissions needed</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            activeOpacity={0.85}
            onPress={onPickOne}
            disabled={loading}
          >
            <Text style={styles.buttonEmoji}>🏞️</Text>
            <Text style={styles.buttonText}>Pick One</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            activeOpacity={0.85}
            onPress={onPickMany}
            disabled={loading}
          >
            <Text style={styles.buttonEmoji}>🎞️</Text>
            <Text style={styles.buttonText}>Pick Multiple</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>Opening picker…</Text>
          </View>
        )}

        {/* Empty state */}
        {!loading && assets.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📷</Text>
            <Text style={styles.emptyTitle}>No images yet</Text>
            <Text style={styles.emptyHint}>
              Tap a button above to choose photos
            </Text>
          </View>
        )}

        {/* Selected count */}
        {!loading && assets.length > 0 && (
          <Text style={styles.countText}>
            {assets.length} image{assets.length > 1 ? 's' : ''} selected
          </Text>
        )}

        {/* Grid of selected images */}
        <View style={styles.grid}>
          {assets.map((a) => (
            <View key={a.uri} style={styles.card}>
              <Image source={{ uri: a.uri }} style={styles.image} />
              <View style={styles.cardBody}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {a.fileName || 'image'}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>
                      {a.mimeType.replace('image/', '').toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.metaText}>{formatSize(a.fileSize)}</Text>
                </View>
                <Text style={styles.dimText}>
                  {a.width} × {a.height} px
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#5B21B6',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#DDD6FE',
    marginTop: 6,
  },
  badge: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -22,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonPrimary: {
    backgroundColor: '#7C3AED',
  },
  buttonSecondary: {
    backgroundColor: '#EC4899',
  },
  buttonEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 12,
    color: '#6D28D9',
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4C1D95',
  },
  emptyHint: {
    fontSize: 14,
    color: '#8B7FB0',
    marginTop: 4,
    textAlign: 'center',
  },
  countText: {
    marginTop: 24,
    marginHorizontal: 20,
    fontSize: 15,
    fontWeight: '700',
    color: '#4C1D95',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20 - CARD_GAP / 2,
    marginTop: 12,
  },
  card: {
    width: '50%',
    padding: CARD_GAP / 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: '#E9E4F5',
  },
  cardBody: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6D28D9',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  dimText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
