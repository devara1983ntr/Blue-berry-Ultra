import { useState, useEffect, useCallback, useRef } from 'react';

export interface SwipeState {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

export interface PinchState {
  scale: number;
  isActive: boolean;
}

export interface LongPressState {
  isActive: boolean;
  duration: number;
}

export interface DoubleTapState {
  isActive: boolean;
  position: { x: number; y: number } | null;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

interface GestureOptions {
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', distance: number, velocity: number) => void;
  onSwipeLeft?: (distance: number, velocity: number) => void;
  onSwipeRight?: (distance: number, velocity: number) => void;
  onSwipeUp?: (distance: number, velocity: number) => void;
  onSwipeDown?: (distance: number, velocity: number) => void;
  onPinch?: (scale: number) => void;
  onLongPress?: () => void;
  onDoubleTap?: (position: { x: number; y: number }) => void;
  onTap?: (position: { x: number; y: number }) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
}

export function useGestures(elementRef: React.RefObject<HTMLElement>, options: GestureOptions = {}) {
  const {
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onLongPress,
    onDoubleTap,
    onTap,
    onPan,
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({ direction: null, distance: 0, velocity: 0 });
  const [pinchState, setPinchState] = useState<PinchState>({ scale: 1, isActive: false });
  const [longPressState, setLongPressState] = useState<LongPressState>({ isActive: false, duration: 0 });
  const [doubleTapState, setDoubleTapState] = useState<DoubleTapState>({ isActive: false, position: null });

  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTap = useRef<{ time: number; position: { x: number; y: number } } | null>(null);
  const initialPinchDistance = useRef<number | null>(null);

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    return Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
  };

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setLongPressState({ isActive: false, duration: 0 });
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    clearLongPressTimer();

    if (e.touches.length === 2 && onPinch) {
      initialPinchDistance.current = getDistance(e.touches[0], e.touches[1]);
      setPinchState({ scale: 1, isActive: true });
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const now = Date.now();
      
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      };

      if (lastTap.current && now - lastTap.current.time < doubleTapDelay) {
        const position = { x: touch.clientX, y: touch.clientY };
        setDoubleTapState({ isActive: true, position });
        onDoubleTap?.(position);
        lastTap.current = null;
        setTimeout(() => setDoubleTapState({ isActive: false, position: null }), 200);
        return;
      }

      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          setLongPressState({ isActive: true, duration: longPressDelay });
          onLongPress();
        }, longPressDelay);
      }
    }
  }, [clearLongPressTimer, doubleTapDelay, longPressDelay, onDoubleTap, onLongPress, onPinch]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance.current && onPinch) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialPinchDistance.current;
      setPinchState({ scale, isActive: true });
      onPinch(scale);
      return;
    }

    if (e.touches.length === 1 && touchStart.current) {
      clearLongPressTimer();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      onPan?.(deltaX, deltaY);

      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    }
  }, [clearLongPressTimer, onPan, onPinch]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    clearLongPressTimer();

    if (pinchState.isActive) {
      setPinchState({ scale: 1, isActive: false });
      initialPinchDistance.current = null;
      return;
    }

    if (touchStart.current && touchEnd.current) {
      const deltaX = touchEnd.current.x - touchStart.current.x;
      const deltaY = touchEnd.current.y - touchStart.current.y;
      const deltaTime = touchEnd.current.time - touchStart.current.time;
      const velocity = Math.hypot(deltaX, deltaY) / deltaTime;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > swipeThreshold || absY > swipeThreshold) {
        let direction: 'left' | 'right' | 'up' | 'down';
        let distance: number;

        if (absX > absY) {
          direction = deltaX > 0 ? 'right' : 'left';
          distance = absX;
          if (direction === 'left') onSwipeLeft?.(distance, velocity);
          if (direction === 'right') onSwipeRight?.(distance, velocity);
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
          distance = absY;
          if (direction === 'up') onSwipeUp?.(distance, velocity);
          if (direction === 'down') onSwipeDown?.(distance, velocity);
        }

        setSwipeState({ direction, distance, velocity });
        onSwipe?.(direction, distance, velocity);
        
        setTimeout(() => setSwipeState({ direction: null, distance: 0, velocity: 0 }), 300);
      } else if (absX < 10 && absY < 10) {
        const now = Date.now();
        lastTap.current = {
          time: now,
          position: { x: touchStart.current.x, y: touchStart.current.y },
        };
        onTap?.({ x: touchStart.current.x, y: touchStart.current.y });
      }
    } else if (touchStart.current) {
      const now = Date.now();
      lastTap.current = {
        time: now,
        position: { x: touchStart.current.x, y: touchStart.current.y },
      };
      onTap?.({ x: touchStart.current.x, y: touchStart.current.y });
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [clearLongPressTimer, onSwipe, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp, onTap, pinchState.isActive, swipeThreshold]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      clearLongPressTimer();
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd, clearLongPressTimer]);

  return {
    swipeState,
    pinchState,
    longPressState,
    doubleTapState,
  };
}

export function useSwipe(
  elementRef: React.RefObject<HTMLElement>,
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void,
  threshold = 50
) {
  return useGestures(elementRef, {
    swipeThreshold: threshold,
    onSwipe: (direction) => onSwipe(direction),
  });
}

export function usePullToRefresh(
  elementRef: React.RefObject<HTMLElement>,
  onRefresh: () => Promise<void>,
  threshold = 100
) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    if (deltaY > 0 && !isRefreshing) {
      setPullDistance(Math.min(deltaY, threshold * 1.5));
    }
  }, [isRefreshing, threshold]);

  const handleSwipeDown = useCallback(async (distance: number) => {
    if (distance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  }, [threshold, isRefreshing, onRefresh]);

  useGestures(elementRef, {
    onPan: handlePan,
    onSwipeDown: handleSwipeDown,
  });

  return { isRefreshing, pullDistance, progress: Math.min(pullDistance / threshold, 1) };
}

export function useInfiniteScroll(
  containerRef: React.RefObject<HTMLElement>,
  onLoadMore: () => void,
  options: { threshold?: number; enabled?: boolean } = {}
) {
  const { threshold = 200, enabled = true } = options;
  const isLoading = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const handleScroll = () => {
      if (isLoading.current) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < threshold) {
        isLoading.current = true;
        onLoadMore();
        setTimeout(() => {
          isLoading.current = false;
        }, 1000);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, onLoadMore, threshold, enabled]);
}

export function useHorizontalSwipe(
  elementRef: React.RefObject<HTMLElement>,
  callbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
  }
) {
  return useGestures(elementRef, {
    onSwipeLeft: callbacks.onSwipeLeft ? () => callbacks.onSwipeLeft!() : undefined,
    onSwipeRight: callbacks.onSwipeRight ? () => callbacks.onSwipeRight!() : undefined,
  });
}

export function useVideoGestures(
  elementRef: React.RefObject<HTMLElement>,
  callbacks: {
    onSeekForward?: () => void;
    onSeekBackward?: () => void;
    onVolumeChange?: (delta: number) => void;
    onBrightnessChange?: (delta: number) => void;
    onTogglePlay?: () => void;
    onDoubleTapLeft?: () => void;
    onDoubleTapRight?: () => void;
    onLongPress?: () => void;
    onPinchZoom?: (scale: number) => void;
  }
) {
  const containerWidth = useRef(0);
  
  useEffect(() => {
    if (elementRef.current) {
      containerWidth.current = elementRef.current.clientWidth;
    }
  }, [elementRef]);

  return useGestures(elementRef, {
    onDoubleTap: (position) => {
      if (containerWidth.current > 0) {
        const isLeftSide = position.x < containerWidth.current / 2;
        if (isLeftSide) {
          callbacks.onDoubleTapLeft?.();
        } else {
          callbacks.onDoubleTapRight?.();
        }
      }
    },
    onSwipeLeft: () => callbacks.onSeekForward?.(),
    onSwipeRight: () => callbacks.onSeekBackward?.(),
    onSwipeUp: (distance) => {
      const delta = distance / 100;
      callbacks.onVolumeChange?.(delta);
      callbacks.onBrightnessChange?.(delta * 10);
    },
    onSwipeDown: (distance) => {
      const delta = -distance / 100;
      callbacks.onVolumeChange?.(delta);
      callbacks.onBrightnessChange?.(delta * 10);
    },
    onTap: callbacks.onTogglePlay ? () => callbacks.onTogglePlay!() : undefined,
    onLongPress: callbacks.onLongPress,
    onPinch: callbacks.onPinchZoom,
  });
}
