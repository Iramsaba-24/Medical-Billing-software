

 
import { useEffect, useRef, useCallback } from "react";
import { UseFormReturn, FieldValues, DefaultValues } from "react-hook-form";
 
 
const GENERAL_SETTINGS_KEY = "generalSettings";
 
 
function isAutoSaveEnabled(): boolean {
  try {
    const settings = localStorage.getItem(GENERAL_SETTINGS_KEY);
    if (!settings) return false;
    const parsed = JSON.parse(settings);
    return parsed.autoSave === true;
  } catch {
    return false;
  }
}
 
interface UseAutoSaveOptions<T extends FieldValues> {
 
  storageKey: string;
 
  methods: UseFormReturn<T>;
  debounceMs?: number;
}
 
interface UseAutoSaveReturn<T extends FieldValues> {
 
  saveData: (data: T) => void;
 
  restoreData: () => T | null;
 
  clearData: () => void;
 
  isEnabled: () => boolean;
}
 
export function useAutoSave<T extends FieldValues>({
  storageKey,
  methods,
  debounceMs = 800,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn<T> {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 
 
  const saveData = useCallback(
    (data: T) => {
      if (!isAutoSaveEnabled()) return;
 
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
 
      debounceTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
          console.log(`[AutoSave] Saved: ${storageKey}`);
        } catch (error) {
          console.error(`[AutoSave] Failed to save ${storageKey}:`, error);
        }
      }, debounceMs);
    },
    [storageKey, debounceMs]
  );
 
 
  const restoreData = useCallback((): T | null => {
    if (!isAutoSaveEnabled()) return null;
 
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      const parsed = JSON.parse(saved) as T;
      console.log(`[AutoSave] Restored: ${storageKey}`);
      return parsed;
    } catch (error) {
      console.error(`[AutoSave] Failed to restore ${storageKey}:`, error);
      return null;
    }
  }, [storageKey]);
 
 
  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      console.log(`[AutoSave] Cleared: ${storageKey}`);
    } catch (error) {
      console.error(`[AutoSave] Failed to clear ${storageKey}:`, error);
    }
  }, [storageKey]);
 
 
  useEffect(() => {
    const subscription = methods.watch((data) => {
      saveData(data as T);
    });
 
    return () => {
      subscription.unsubscribe();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [methods, saveData]);
 
 
  useEffect(() => {
    const saved = restoreData();
    if (saved) {
      setTimeout(() => {
        methods.reset(saved as DefaultValues<T>);
        console.log(`[AutoSave] Form restored on page load: ${storageKey}`);
      }, 100);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
 
  return {
    saveData,
    restoreData,
    clearData,
    isEnabled: isAutoSaveEnabled,
  };
}
 
export function autoSaveData(key: string, data: unknown): void {
  if (!isAutoSaveEnabled()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("[AutoSave] Save failed:", error);
  }
}
 
export function autoRestoreData<T>(key: string): T | null {
  if (!isAutoSaveEnabled()) return null;
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : null;
  } catch {
    return null;
  }
}
 
 
 //Manually saved data clear karo
 
export function autoClearData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("[AutoSave] Clear failed:", error);
  }
}
 