import { useState, useEffect } from "react";

const ONBOARDING_KEY = "contextlens_onboarding_completed";

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setIsNewUser(true);
      // Show onboarding after a brief delay for smoother UX
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
    setIsNewUser(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "skipped");
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setShowOnboarding(true);
    setIsNewUser(true);
  };

  return {
    showOnboarding,
    isNewUser,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
};
