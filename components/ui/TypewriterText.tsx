import React, { useState, useEffect } from 'react';
import { Text, TextProps } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TypewriterTextProps extends TextProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
  startDelay?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 30, 
  startDelay = 0,
  onComplete,
  style, 
  ...props 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, delay, text, started, onComplete]);

  return (
    <Text style={style} {...props}>
      {displayedText}
    </Text>
  );
};

