'use client';

import { useEffect, useCallback } from 'react';

type KeyboardModifier = 'meta' | 'ctrl' | 'alt' | 'shift';

interface UseKeyboardShortcutOptions {
  key: string;
  modifier?: KeyboardModifier | KeyboardModifier[];
  callback: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  modifier,
  callback,
  enabled = true,
}: UseKeyboardShortcutOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if the key matches
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      // Check modifiers
      const modifiers = Array.isArray(modifier)
        ? modifier
        : modifier
        ? [modifier]
        : [];

      const modifierChecks = {
        meta: event.metaKey,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
      };

      // If modifiers are specified, check they're all pressed
      if (modifiers.length > 0) {
        const allModifiersPressed = modifiers.every(
          (mod) => modifierChecks[mod]
        );
        if (!allModifiersPressed) return;
      }

      // Prevent default and run callback
      event.preventDefault();
      callback();
    },
    [key, modifier, callback, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
