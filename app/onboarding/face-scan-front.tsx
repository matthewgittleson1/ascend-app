import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function FaceScanFrontScreen() {
  const router = useRouter();
  const { capturedImages, setFrontImage } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const hasPhoto = !!capturedImages.frontImage;

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return {
      camera: cameraPermission.status === 'granted',
      media: mediaPermission.status === 'granted',
    };
  };

  const handleTakePhoto = async () => {
    setIsLoading(true);
    const permissions = await requestPermissions();
    
    if (!permissions.camera) {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in your device settings to take a photo.',
        [{ text: 'OK' }]
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.3, // Compressed for API upload (keeps under 4.5MB Edge limit)
        base64: true,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const asset = result.assets[0];
        // Store as data URI for API
        const base64Uri = `data:image/jpeg;base64,${asset.base64}`;
        setFrontImage(base64Uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickFromLibrary = async () => {
    setIsLoading(true);
    const permissions = await requestPermissions();
    
    if (!permissions.media) {
      Alert.alert(
        'Photo Library Permission Required',
        'Please enable photo library access in your device settings.',
        [{ text: 'OK' }]
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.3,
        base64: true,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const asset = result.assets[0];
        const base64Uri = `data:image/jpeg;base64,${asset.base64}`;
        setFrontImage(base64Uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Library error:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setFrontImage(null);
  };

  const handleContinue = () => {
    router.push('/onboarding/face-scan-side');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Front Profile</Text>
          <Text style={styles.subtitle}>
            Align your face within the frame. Ensure good lighting.
          </Text>

          <View style={styles.frameContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AscendColors.accent} />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            ) : hasPhoto ? (
              <View style={styles.photoContainer}>
                <Image 
                  source={{ uri: capturedImages.frontImage! }} 
                  style={styles.photo}
                  resizeMode="cover"
                />
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={24} color={AscendColors.bg} />
                </View>
              </View>
            ) : (
              <View style={styles.frame}>
                <View style={[styles.corner, styles.tl]} />
                <View style={[styles.corner, styles.tr]} />
                <View style={[styles.corner, styles.bl]} />
                <View style={[styles.corner, styles.br]} />
                <Ionicons name="person-outline" size={120} color="rgba(255,255,255,0.2)" />
                <Text style={styles.frameHint}>Face forward, neutral expression</Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            {!hasPhoto ? (
              <>
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={handleTakePhoto}
                  disabled={isLoading}
                >
                  <Ionicons name="camera" size={24} color={AscendColors.bg} />
                  <Text style={styles.primaryButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={handlePickFromLibrary}
                  disabled={isLoading}
                >
                  <Ionicons name="images-outline" size={20} color={AscendColors.text} />
                  <Text style={styles.secondaryButtonText}>Upload from Library</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleRetake}>
                  <Ionicons name="refresh-outline" size={20} color={AscendColors.text} />
                  <Text style={styles.secondaryButtonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={24} color={AscendColors.bg} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AscendColors.bg,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AscendColors.muted,
    textAlign: 'center',
    marginBottom: 40,
  },
  frameContainer: {
    width: 280,
    height: 360,
    marginBottom: 48,
  },
  frame: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21, 27, 40, 0.5)',
  },
  frameHint: {
    color: AscendColors.muted,
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21, 27, 40, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  loadingText: {
    color: AscendColors.muted,
    marginTop: 12,
    fontSize: 14,
  },
  photoContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AscendColors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: AscendColors.accent,
    borderWidth: 4,
  },
  tl: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 24 },
  tr: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 24 },
  bl: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 24 },
  br: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 24 },
  actions: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  secondaryButtonText: {
    color: AscendColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
