-- Migration: Adiciona campo primeiro_acesso na tabela profiles
-- Data: 28/04/2026
-- Autor: Labs Will

ALTER TABLE public.admin_profile 
ADD COLUMN IF NOT EXISTS primeiro_acesso BOOLEAN DEFAULT true;

-- Atualiza usuarios existentes para false (ja acessaram antes)
UPDATE public.admin_profile 
SET primeiro_acesso = false 
WHERE primeiro_acesso IS NULL;

-- Cria funcao para marcar primeiro acesso como false apos alteracao de senha
CREATE OR REPLACE FUNCTION public.handle_password_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.encrypted_password <> OLD.encrypted_password THEN
  UPDATE public.admin_profile
  SET primeiro_acesso = false
  WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria trigger na tabela auth.users para detectar alteracao de senha
DROP TRIGGER IF EXISTS on_password_change ON auth.users;
CREATE TRIGGER on_password_change
AFTER UPDATE OF encrypted_password ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_password_change();

-- Cria funcao RPC para verificar se usuario precisa trocar senha
CREATE OR REPLACE FUNCTION public.needs_password_change()
RETURNS BOOLEAN AS $$
DECLARE
  first_access BOOLEAN;
BEGIN
  SELECT primeiro_acesso INTO first_access
  FROM public.admin_profile
  WHERE id = auth.uid();
  
  RETURN COALESCE(first_access, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.needs_password_change() IS 'Retorna true se o usuario precisa alterar a senha no primeiro acesso';