-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create waitlist table (public signups)
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'landing_page',
  notified BOOLEAN DEFAULT false
);

-- Enable RLS on waitlist (allow public inserts for early access signups)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can join the waitlist
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);

-- Create scripts table
CREATE TABLE public.scripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on scripts
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

-- Scripts policies
CREATE POLICY "Users can view their own scripts" ON public.scripts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scripts" ON public.scripts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scripts" ON public.scripts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scripts" ON public.scripts
  FOR DELETE USING (auth.uid() = user_id);

-- Create connected_devices table
CREATE TABLE public.connected_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  manufacturer TEXT,
  tier INTEGER DEFAULT 0,
  is_connected BOOLEAN DEFAULT false,
  last_connected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on connected_devices
ALTER TABLE public.connected_devices ENABLE ROW LEVEL SECURITY;

-- Devices policies
CREATE POLICY "Users can view their own devices" ON public.connected_devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own devices" ON public.connected_devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" ON public.connected_devices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" ON public.connected_devices
  FOR DELETE USING (auth.uid() = user_id);

-- Create usage_analytics table
CREATE TABLE public.usage_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  script_id UUID REFERENCES public.scripts(id) ON DELETE SET NULL,
  device_id UUID REFERENCES public.connected_devices(id) ON DELETE SET NULL,
  session_duration_seconds INTEGER DEFAULT 0,
  prompts_displayed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on usage_analytics
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;

-- Analytics policies
CREATE POLICY "Users can view their own analytics" ON public.usage_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics" ON public.usage_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();