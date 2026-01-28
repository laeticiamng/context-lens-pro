import { useState, useCallback, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface LoginAttempt {
  timestamp: number;
  email: string;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY = 'cl_login_attempts';

export function useLoginRateLimiter() {
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS);

  // Load attempts from storage
  const loadAttempts = useCallback((): LoginAttempt[] => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const attempts: LoginAttempt[] = JSON.parse(stored);
      // Filter out old attempts
      const now = Date.now();
      return attempts.filter(a => now - a.timestamp < LOCKOUT_DURATION);
    } catch {
      return [];
    }
  }, []);

  // Save attempts to storage
  const saveAttempts = useCallback((attempts: LoginAttempt[]) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  }, []);

  // Check if currently locked
  const checkLockout = useCallback(() => {
    const attempts = loadAttempts();
    const now = Date.now();
    
    if (attempts.length >= MAX_ATTEMPTS) {
      const oldestAttempt = attempts[0];
      const unlockTime = oldestAttempt.timestamp + LOCKOUT_DURATION;
      
      if (now < unlockTime) {
        setIsLocked(true);
        setLockoutEndTime(unlockTime);
        setRemainingAttempts(0);
        return true;
      }
    }
    
    setIsLocked(false);
    setLockoutEndTime(null);
    setRemainingAttempts(MAX_ATTEMPTS - attempts.length);
    return false;
  }, [loadAttempts]);

  // Record a failed attempt
  const recordFailedAttempt = useCallback((email: string) => {
    const attempts = loadAttempts();
    attempts.push({ timestamp: Date.now(), email });
    saveAttempts(attempts);
    checkLockout();
  }, [loadAttempts, saveAttempts, checkLockout]);

  // Clear attempts on successful login
  const clearAttempts = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsLocked(false);
    setLockoutEndTime(null);
    setRemainingAttempts(MAX_ATTEMPTS);
  }, []);

  // Check lockout on mount and periodically
  useEffect(() => {
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [checkLockout]);

  return {
    isLocked,
    lockoutEndTime,
    remainingAttempts,
    recordFailedAttempt,
    clearAttempts,
    checkLockout,
  };
}

interface LockoutAlertProps {
  lockoutEndTime: number | null;
}

export function LockoutAlert({ lockoutEndTime }: LockoutAlertProps) {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!lockoutEndTime) return;

    const updateTime = () => {
      const now = Date.now();
      const remaining = Math.max(0, lockoutEndTime - now);
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lockoutEndTime]);

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {language === 'fr' 
          ? `Trop de tentatives. Réessayez dans ${timeLeft}`
          : `Too many attempts. Try again in ${timeLeft}`}
      </AlertDescription>
    </Alert>
  );
}

interface AttemptsWarningProps {
  remainingAttempts: number;
}

export function AttemptsWarning({ remainingAttempts }: AttemptsWarningProps) {
  const { language } = useLanguage();
  
  if (remainingAttempts >= MAX_ATTEMPTS - 2) return null;
  
  return (
    <p className="text-xs text-amber-500 flex items-center gap-1 mt-2">
      <AlertCircle className="h-3 w-3" />
      {language === 'fr' 
        ? `${remainingAttempts} tentative(s) restante(s)`
        : `${remainingAttempts} attempt(s) remaining`}
    </p>
  );
}
