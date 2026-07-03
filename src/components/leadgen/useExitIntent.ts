// Exit intent context hook - separate file for Fast Refresh compatibility
import { createContext, useContext } from 'react';

export interface ExitIntentContextValue {
  showModal: boolean;
  triggerModal: () => void;
  dismissModal: () => void;
  hasTriggered: boolean;
}

export const ExitIntentContext = createContext<ExitIntentContextValue | null>(null);

export function useExitIntent() {
  const ctx = useContext(ExitIntentContext);
  if (!ctx) throw new Error('useExitIntent must be used within ExitIntentProvider');
  return ctx;
}
