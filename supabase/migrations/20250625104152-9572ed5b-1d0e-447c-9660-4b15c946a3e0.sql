
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create mood entries table
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_level INTEGER NOT NULL CHECK (mood_level >= 1 AND mood_level <= 5),
  emotions TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create journal entries table
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create meditation sessions table
CREATE TABLE public.meditation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create wellness goals table
CREATE TABLE public.wellness_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_frequency INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create crisis resources table
CREATE TABLE public.crisis_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  phone_number TEXT,
  website_url TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_resources ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for mood entries
CREATE POLICY "Users can manage their own mood entries" ON public.mood_entries
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for journal entries
CREATE POLICY "Users can manage their own journal entries" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for meditation sessions
CREATE POLICY "Users can manage their own meditation sessions" ON public.meditation_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for wellness goals
CREATE POLICY "Users can manage their own wellness goals" ON public.wellness_goals
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for community posts
CREATE POLICY "Users can view all community posts" ON public.community_posts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create community posts" ON public.community_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own community posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own community posts" ON public.community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for crisis resources (public read access)
CREATE POLICY "Anyone can view crisis resources" ON public.crisis_resources
  FOR SELECT TO authenticated USING (is_active = true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample crisis resources
INSERT INTO public.crisis_resources (title, description, phone_number, website_url, country) VALUES
('National Suicide Prevention Lifeline', '24/7 free and confidential support for people in distress', '988', 'https://suicidepreventionlifeline.org', 'US'),
('Crisis Text Line', 'Free 24/7 support via text message', 'Text HOME to 741741', 'https://crisistextline.org', 'US'),
('SAMHSA National Helpline', 'Treatment referral and information service', '1-800-662-4357', 'https://samhsa.gov', 'US'),
('International Association for Suicide Prevention', 'Global crisis resources and support', '', 'https://iasp.info/resources/Crisis_Centres', 'Global');
