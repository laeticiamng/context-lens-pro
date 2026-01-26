import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWaitlist = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const joinWaitlist = async (email: string, source: string = "landing_page") => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.toLowerCase().trim(),
        source,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already on the list!",
            description: "This email is already registered for early access.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "You're on the list! 🎉",
          description: "We'll notify you when early access opens.",
        });
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  return { joinWaitlist, loading };
};
