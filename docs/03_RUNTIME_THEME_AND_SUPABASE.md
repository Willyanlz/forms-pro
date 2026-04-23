# 03 - Runtime, Theme Navigation and Supabase Local Setup

## Objetivo
Resolver o erro de runtime do `$localize`, expor o gerenciamento de tema na UI admin e preparar o projeto Supabase local com functions e config inicial.

## O que foi feito
- Corrigido o runtime Angular para carregar `@angular/localize` via `polyfills.ts`
- Ajustado `angular.json` para incluir `src/polyfills.ts`
- Confirmado `npm run start` com resposta HTTP `200` em instancia limpa
- Adicionados atalhos visiveis no dashboard para:
  - perfil
  - tema
  - email
  - WhatsApp
  - geral
- Instalado Supabase CLI no projeto
- Executado `npx supabase init`
- Gerado `supabase/config.toml`
- Criadas as edge functions:
  - `send-email`
  - `rate-limit`
  - `webhook`

## Estado atual do Supabase
- `npx supabase start`
  - bloqueado porque o Docker Desktop nao esta disponivel nesta maquina
- `npx supabase db push --dry-run`
  - bloqueado porque ainda nao existe `supabase link` para um projeto remoto

## Impacto
- O erro `$localize is not defined` deixa de ocorrer em uma execucao limpa do app
- A area admin passa a ter acesso claro ao gerenciamento de tema
- O projeto Supabase fica estruturado localmente e pronto para subir quando o ambiente estiver completo

## Proximos passos recomendados
1. Iniciar Docker Desktop
2. Rodar `npx supabase start`
3. Validar migrations e functions localmente
4. Se quiser aplicar em um projeto remoto, executar `npx supabase link`
5. Rodar push/deploy no ambiente escolhido
