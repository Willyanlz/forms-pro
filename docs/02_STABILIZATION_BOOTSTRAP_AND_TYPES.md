# 02 - Stabilization, Bootstrap and Types

## Objetivo
Eliminar regressões estruturais que impediam o projeto de compilar e iniciar corretamente.

## O que foi feito
- Corrigido o bootstrap global da aplicacao em `app.config.ts`
- Adicionados providers de `HttpClient`, `ngx-translate` e `ngx-mask`
- Inicializacao de idioma e tema centralizada no componente raiz
- Ajustados scripts do `package.json` para usar o Angular CLI local com flags de symlink
- Alinhados `models` com o schema real do Supabase em `snake_case`
- Criado helper `createDefaultAppSettings()` para evitar estados parciais inconsistentes
- Corrigidos imports e tipagens quebradas em landing, auth, forms, settings e form builder

## Verificacao executada
- `node --preserve-symlinks --preserve-symlinks-main .\\node_modules\\typescript\\bin\\tsc -p tsconfig.app.json --noEmit`
  - Resultado: sem erros
- `npm run start`
  - Resultado: o bootstrap do CLI foi corrigido; no sandbox do agente o processo ainda para em `spawn EPERM` do `esbuild`

## Impacto
- A base voltou a compilar em TypeScript strict
- A aplicacao ficou pronta para validacao funcional fluxo a fluxo
- O problema inicial de `lstat` no `npm run start` foi removido
