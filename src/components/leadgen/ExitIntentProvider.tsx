import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ExitIntentContext } from './useExitIntent';

interface Props {
  children: ReactNode;
  enabled?: boolean;
  scrollThreshold?: number;
  delayMs?: number;
}

export default function ExitIntentProvider({
  children,
  enabled = true,
  scrollThreshold = 0.5,
  delayMs = 5000,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const dismissModal = useCallback(() => {
    setShowModal(false);
    sessionStorage.setItem('ndn_exit_intent_dismissed', 'true');
  }, []);

  const triggerModal = useCallback(() => {
    if (!hasTriggered && !sessionStorage.getItem('ndn_exit_intent_dismissed')) {
      setShowModal(true);
      setHasTriggered(true);
    }
  }, [hasTriggered]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => setIsReady(true), delayMs);
    return () => clearTimeout(timer);
  }, [enabled, delayMs]);

  useEffect(() => {
    if (!enabled || !isReady || hasTriggered) return;

    let hasScrolledEnough = false;

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent >= scrollThreshold) {
        hasScrolledEnough = true;
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && hasScrolledEnough) {
        triggerModal();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && hasScrolledEnough) {
        triggerModal();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, isReady, hasTriggered, scrollThreshold, triggerModal]);

  return (
    <ExitIntentContext.Provider value={{ showModal, triggerModal, dismissModal, hasTriggered }}>
      {children}
    </ExitIntentContext.Provider>
  );
}
