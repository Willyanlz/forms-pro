# 04 - Remote Supabase Push and Safe Seeds

## Objetivo
Publicar o backend Supabase no projeto remoto informado, garantindo que schema e edge functions subam sem quebrar quando ainda nao existir usuario cadastrado no `auth.users`.

## O que foi feito
- Executado `supabase link` para o projeto remoto `dbwbjxgxwizgfrrcibfh`
- Publicadas as edge functions:
  - `send-email`
  - `rate-limit`
  - `webhook`
- Corrigida a migration `00001_create_schema.sql` para:
  - habilitar `pgcrypto`
  - criar compatibilidade de `uuid_generate_v4()` usando `gen_random_uuid()`
- Ajustadas as migrations `00002_seed_admin.sql` e `00003_seed_forms.sql` para:
  - buscar automaticamente o primeiro usuario de `auth.users`
  - encerrar com `NOTICE` em vez de erro quando ainda nao existir usuario
- Executado `npx supabase db push` com sucesso no remoto

## Resultado do push
- O schema principal foi aplicado no projeto remoto
- As functions remotas foram publicadas com sucesso
- Os seeds foram pulados em modo seguro porque o projeto ainda nao possui usuario em `auth.users`

## Impacto
- O banco remoto deixa de falhar por dependencia de `uuid_generate_v4()`
- O deploy backend passa a ser repetivel e seguro mesmo antes da criacao do primeiro admin
- O sistema continua suportando `resend`, `smtp` ou `none`

## Pendencias
1. Criar o primeiro usuario admin no Supabase Auth
2. Popular `admin_profile` e `app_settings` para esse usuario
3. Inserir os templates iniciais de formularios
4. Configurar o bucket `profile-images`

## Observacao importante
Como os seeds foram pulados e as migrations ja foram marcadas como aplicadas, a populacao inicial do admin e dos formularios precisa acontecer em um proximo passo controlado, apos existir um usuario real no Auth.
