import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SubscriptionStatus } from '@superwall/react-native-superwall';
import { superwallService } from '@/services/superwall';

export function useSuperwall() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsLoading(false);
      return;
    }

    superwallService.initialize();
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const status = await superwallService.getSubscriptionStatus();
      setIsSubscribed(status === SubscriptionStatus.ACTIVE);
    } catch (error) {
      console.error('[Superwall] Hook subscription check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showPaywall = async (triggerId: string): Promise<{ userSubscribed: boolean }> => {
    if (isLoading || Platform.OS === 'web') {
      return { userSubscribed: false };
    }
    
    try {
      await superwallService.presentPaywall(triggerId);
      // Refresh subscription status after paywall interaction
      const status = await superwallService.getSubscriptionStatus();
      const subscribed = status === SubscriptionStatus.ACTIVE;
      setIsSubscribed(subscribed);
      return { userSubscribed: subscribed };
    } catch (error) {
      console.error('[Superwall] Hook failed to show paywall:', error);
      return { userSubscribed: false };
    }
  };

  return {
    isSubscribed,
    isLoading,
    showPaywall,
    checkSubscription,
  };
} 