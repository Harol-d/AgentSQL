import React, { useState, useEffect } from 'react';

const TypingAnimation = ({ fullText, typingSpeed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!fullText || isComplete) return;

    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, fullText, typingSpeed, isComplete, onComplete]);

  // Resetear cuando cambie el texto completo
  useEffect(() => {
    if (fullText) {
      setDisplayedText('');
      setCurrentIndex(0);
      setIsComplete(false);
    }
  }, [fullText]);

  return (
    <div className="typing-animation">
      {displayedText}
      {!isComplete && fullText && <span className="typing-cursor">|</span>}
    </div>
  );
};

export default TypingAnimation;
