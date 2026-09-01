CREATE TABLE public.family_data (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_data TO authenticated;
GRANT ALL ON public.family_data TO service_role;

ALTER TABLE public.family_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own family data"
ON public.family_data FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_family_data_updated_at
BEFORE UPDATE ON public.family_data
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();