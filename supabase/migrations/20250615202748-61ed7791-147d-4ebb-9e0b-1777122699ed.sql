
-- Drop existing policies on sessions table to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.sessions;

-- Drop existing policies on flashcards table
DROP POLICY IF EXISTS "Users can manage their own flashcards" ON public.flashcards;

-- Drop existing foreign keys if they exist to avoid conflicts
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE public.flashcards DROP CONSTRAINT IF EXISTS flashcards_user_id_fkey;

-- Add correct foreign key from sessions to auth.users, ensuring data integrity
ALTER TABLE public.sessions
ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add correct foreign key from flashcards to auth.users
ALTER TABLE public.flashcards
ADD CONSTRAINT flashcards_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security on sessions table if not enabled
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Add policy to ensure users can only manage their own sessions
CREATE POLICY "Users can manage their own sessions" ON public.sessions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable Row Level Security on flashcards table if not enabled
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Add policy to ensure users can only manage their own flashcards
CREATE POLICY "Users can manage their own flashcards" ON public.flashcards FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
