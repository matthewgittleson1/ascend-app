import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

export default function ScanningScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push('/onboarding/results');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.statusText}>PROCESSING BIOMETRICS...</Text>
          
          <View style={styles.scanContainer}>
             {/* Mock Face */}
             <Ionicons name="person" size={200} color="#334155" />
             
             {/* Geometric Overlay */}
             <View style={StyleSheet.absoluteFill}>
               <Svg height="100%" width="100%" viewBox="0 0 300 300">
                  {/* Facial landmarks simulation */}
                  <Circle cx="150" cy="100" r="3" fill={AscendColors.accent} opacity="0.8" />
                  <Circle cx="110" cy="110" r="3" fill={AscendColors.accent} opacity="0.8" />
                  <Circle cx="190" cy="110" r="3" fill={AscendColors.accent} opacity="0.8" />
                  <Circle cx="150" cy="160" r="3" fill={AscendColors.accent} opacity="0.8" />
                  <Circle cx="120" cy="200" r="3" fill={AscendColors.accent} opacity="0.8" />
                  <Circle cx="180" cy="200" r="3" fill={AscendColors.accent} opacity="0.8" />
                  
                  {/* Connecting lines */}
                  <Line x1="110" y1="110" x2="190" y2="110" stroke={AscendColors.accent} strokeWidth="1" opacity="0.5" />
                  <Line x1="150" y1="100" x2="150" y2="160" stroke={AscendColors.accent} strokeWidth="1" opacity="0.5" />
                  <Line x1="120" y1="200" x2="180" y2="200" stroke={AscendColors.accent} strokeWidth="1" opacity="0.5" />
                  <Polygon points="110,110 150,160 190,110" stroke={AscendColors.emerald} strokeWidth="1" fill="none" opacity="0.4" />
                  
                  {/* Scanning Grid effects */}
                  <Line x1="0" y1="150" x2="300" y2="150" stroke={AscendColors.border} strokeWidth="1" strokeDasharray="5, 5" />
                  <Line x1="150" y1="0" x2="150" y2="300" stroke={AscendColors.border} strokeWidth="1" strokeDasharray="5, 5" />
               </Svg>
             </View>

             {/* Scanning Line */}
             <ScanLine />
          </View>

          <View style={styles.dataLog}>
            <Text style={styles.logText}>> Mapping facial landmarks...</Text>
            <Text style={styles.logText}>> Calculating symmetry indices...</Text>
            <Text style={styles.logText}>> Measuring canthal tilt...</Text>
            <Text style={styles.logText}>> Analyzing skin texture depth...</Text>
            <Text style={styles.logText}>> Generating potential projection...</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function ScanLine() {
  const [top, setTop] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTop(prev => (prev + 1) % 100);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.scanLine, { top: `${top}%` }]} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: AscendColors.accent,
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 40,
    fontWeight: '700',
  },
  scanContainer: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: AscendColors.border,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21, 27, 40, 0.5)',
    marginBottom: 40,
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: AscendColors.emerald,
    shadowColor: AscendColors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    zIndex: 10,
  },
  dataLog: {
    width: 300,
    gap: 8,
  },
  logText: {
    color: AscendColors.muted,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
