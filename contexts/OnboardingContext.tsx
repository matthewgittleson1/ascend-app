import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import { AnalysisResult, CapturedImages } from '@/types/analysis';

export type UserData = {
  name: string;
  gender?: 'male' | 'female';
  ageRange?: string;
  familiarity?: string;
  currentLooks?: string;
  reason?: string;
  lastHappy?: string;
  unhappyFrequency?: string;
  resultsSpeed?: string;
  focusAreas?: string[];
};

type OnboardingContextType = {
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => Promise<void>;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  // Image capture
  capturedImages: CapturedImages;
  setFrontImage: (base64: string | null) => void;
  setSideImage: (base64: string | null) => void;
  clearImages: () => void;
  // Analysis results
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
  analysisError: string | null;
  setAnalysisError: (error: string | null) => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'hasCompletedOnboarding';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData>({ name: '' });
  const [capturedImages, setCapturedImages] = useState<CapturedImages>({
    frontImage: null,
    sideImage: null,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (isOnboarded === null) return;

    const inAuthGroup = segments[0] === 'onboarding';

    if (!isOnboarded && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (isOnboarded && inAuthGroup) {
      router.replace('/');
    }
  }, [isOnboarded, segments]);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      setIsOnboarded(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboarded(false);
    }
  };

  const handleSetIsOnboarded = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(value));
      setIsOnboarded(value);
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const setFrontImage = (base64: string | null) => {
    setCapturedImages(prev => ({ ...prev, frontImage: base64 }));
  };

  const setSideImage = (base64: string | null) => {
    setCapturedImages(prev => ({ ...prev, sideImage: base64 }));
  };

  const clearImages = () => {
    setCapturedImages({ frontImage: null, sideImage: null });
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarded: isOnboarded ?? false,
        setIsOnboarded: handleSetIsOnboarded,
        userData,
        updateUserData,
        capturedImages,
        setFrontImage,
        setSideImage,
        clearImages,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        analysisError,
        setAnalysisError,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 
