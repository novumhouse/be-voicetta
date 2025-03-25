
import { useEffect, useState } from 'react';

// Custom hook for staggered animations
export const useStaggeredAnimation = (
  totalItems: number, 
  staggerDelay: number = 50
) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  useEffect(() => {
    const newVisibleItems = Array(totalItems).fill(false);
    let count = 0;

    const interval = setInterval(() => {
      if (count < totalItems) {
        newVisibleItems[count] = true;
        setVisibleItems([...newVisibleItems]);
        count++;
      } else {
        clearInterval(interval);
      }
    }, staggerDelay);

    return () => clearInterval(interval);
  }, [totalItems, staggerDelay]);

  return visibleItems;
};

// Custom hook for progressive number animation
export const useCountAnimation = (
  targetValue: number,
  duration: number = 1000,
  startDelay: number = 0
) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Wait for the delay before starting animation
    const delayTimeout = setTimeout(() => {
      // Divide the duration into steps
      const steps = 20;
      const increment = targetValue / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep >= steps) {
          setCount(targetValue);
          clearInterval(interval);
        } else {
          setCount(Math.floor(increment * currentStep));
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }, startDelay);
    
    return () => clearTimeout(delayTimeout);
  }, [targetValue, duration, startDelay]);
  
  return count;
};

// Custom hook for typewriter effect
export const useTypewriter = (
  text: string,
  typingSpeed: number = 50,
  startDelay: number = 0
) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let currentIndex = 0;
    
    const startTyping = () => {
      timer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(timer);
        }
      }, typingSpeed);
    };
    
    const delayTimer = setTimeout(startTyping, startDelay);
    
    return () => {
      clearTimeout(delayTimer);
      clearInterval(timer);
    };
  }, [text, typingSpeed, startDelay]);
  
  return displayedText;
};

// Custom hook for fade-in effect
export const useFadeIn = (delay: number = 0, duration: number = 500) => {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return {
    style: {
      opacity,
      transition: `opacity ${duration}ms ease-in-out`
    }
  };
};
