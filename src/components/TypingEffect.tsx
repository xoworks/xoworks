'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TypingEffectProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  delay = 40,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (currentIndex >= text.length) {
      if (!completedRef.current && onComplete) {
        completedRef.current = true;
        setIsComplete(true);
        onComplete();
      }
      return;
    }

    const randomDelay = Math.max(20, delay - Math.random() * 15);
    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, randomDelay);

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, onComplete, text]);

  // Reset if text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
    completedRef.current = false;
  }, [text]);

  return (
    <span className="typing-effect-container">
      <span
        className={`typing-effect ${!isComplete ? 'typing-effect-active' : ''}`}
      >
        {displayedText}
      </span>
    </span>
  );
};

export default TypingEffect;
