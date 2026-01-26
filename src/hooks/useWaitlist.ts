import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWaitlist = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const joinWaitlist = useCallback(async (email: string, source: string = "landing_page") => {
    if (!email || !email.includes("@")) {
      const errorMsg = "Please enter a valid email address.";
      setError(errorMsg);
      toast({
        title: "Invalid email",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { error: dbError } = await supabase.from("waitlist").insert({
        email: email.toLowerCase().trim(),
        source,
      });

      if (dbError) {
        if (dbError.code === "23505") {
          toast({
            title: "Already on the list!",
            description: "This email is already registered for early access.",
          });
          setIsSuccess(true);
        } else {
          throw dbError;
        }
      } else {
        toast({
          title: "You're on the list! 🎉",
          description: "We'll notify you when early access opens.",
        });
        setIsSuccess(true);
        return true;
      }
    } catch (err: any) {
      const errorMsg = "Please try again later.";
      setError(errorMsg);
      toast({
        title: "Something went wrong",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  }, [toast]);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  return { joinWaitlist, loading, isLoading: loading, isSuccess, error, reset };
};
