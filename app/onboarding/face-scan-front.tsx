import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function FaceScanFrontScreen() {
  const router = useRouter();
  const [photoTaken, setPhotoTaken] = useState(false);

  const handleTakePhoto = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Mock photo taking - in production, use expo-camera or expo-image-picker
    setPhotoTaken(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRetake = () => {
    setPhotoTaken(false);
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
            {photoTaken ? (
               <View style={styles.photoPlaceholder}>
                 <Ionicons name="person" size={120} color={AscendColors.text} />
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
               </View>
            )}
          </View>

          <View style={styles.actions}>
            {!photoTaken ? (
              <>
                <TouchableOpacity style={styles.primaryButton} onPress={handleTakePhoto}>
                  <Ionicons name="camera" size={24} color={AscendColors.bg} />
                  <Text style={styles.primaryButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleTakePhoto}>
                  <Text style={styles.secondaryButtonText}>Upload from Library</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleRetake}>
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
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  secondaryButtonText: {
    color: AscendColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
