# Labs Will - Development Memory

## Ultimo ponto de parada
- Data: 2026-04-23
- Contexto: runtime da app estabilizado e Supabase remoto publicado parcialmente

## O que foi ajustado neste ciclo
- Corrigido erro de runtime `$localize is not defined` com `@angular/localize` em `polyfills.ts`
- Confirmado `npm run start` com resposta HTTP 200 em instancia limpa
- Adicionados atalhos claros para Perfil, Tema, Email, WhatsApp e Geral no dashboard
- Inicializado Supabase CLI com `supabase init`
- Linkado o projeto remoto `dbwbjxgxwizgfrrcibfh`
- Criadas edge functions:
  - `supabase/functions/send-email/index.ts`
  - `supabase/functions/rate-limit/index.ts`
  - `supabase/functions/webhook/index.ts`
- Publicadas no remoto as functions `send-email`, `rate-limit` e `webhook`
- Corrigida a migration de schema com compatibilidade entre `uuid_generate_v4()` e `gen_random_uuid()`
- Ajustados os seeds para buscar automaticamente o primeiro usuario de `auth.users`
- Executado `npx supabase db push` com sucesso para o schema remoto

## Estado verificado
- `npm run build` passa
- `npm run start` sobe sem erro de `$localize`
- `supabase start` bloqueado por ausencia do Docker Desktop
- Projeto remoto recebeu schema e edge functions
- Seeds remotos foram pulados com `NOTICE` porque ainda nao existe usuario em `auth.users`

## Onde retomar
1. Criar o primeiro usuario admin no Supabase Auth
2. Popular `admin_profile`, `app_settings` e os templates iniciais para esse usuario
3. Configurar bucket `profile-images`
4. Validar `/admin/settings/appearance`
5. Subir Docker Desktop
6. Rodar `npx supabase start`
7. Validar edge functions localmente

## Regras de continuidade
- Antes de cada nova feature, revisar impacto nos fluxos existentes
- Toda alteracao deve gerar uma nova doc em `docs/`
- Atualizar este arquivo e `DEVELOPMENT_TRACKING.md` ao encerrar cada ciclo
- Manter suporte explicito para `resend`, `smtp` ou `none`
