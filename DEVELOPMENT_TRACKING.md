# Labs Will - Development Tracking

## Status Atual
**Fase**: 0 - Scaffolding & Infraestrutura
**Ultima Atualizacao**: 2026-04-23

## Fases Concluidas

### Fase 0 - Scaffolding & Infraestrutura [EM ANDAMENTO]
- [x] Angular CLI atualizado para v21.2.8
- [x] Projeto Angular criado (standalone, SCSS, routing, strict)
- [x] Dependencias instaladas (supabase-js, ngx-translate, cdk, ngx-mask, date-fns, tailwind)
- [x] Tailwind configurado (breakpoints, spacing, dark mode class, CSS vars)
- [x] PostCSS configurado
- [x] SCSS Design System (_variables, _typography, _dark-theme, _animations)
- [x] styles.scss global com imports
- [x] TypeScript path aliases (@core, @shared, @features, @env)
- [x] Environments (dev + prod)
- [x] i18n base (pt.json, en.json, es.json) - estrutura completa
- [ ] Verificar build compila sem erros

## Proxima Fase
- Fase 1: Banco de Dados (SQL migrations)
- Fase 2: Core Services

## Arquivos Principais Criados/Modificados
- tailwind.config.js
- postcss.config.js
- tsconfig.json (paths)
- src/styles.scss
- src/styles/_variables.scss
- src/styles/_typography.scss
- src/styles/_dark-theme.scss
- src/styles/_animations.scss
- src/environments/environment.ts
- src/environments/environment.prod.ts
- src/assets/i18n/pt.json
- src/assets/i18n/en.json
- src/assets/i18n/es.json

## Notas Importantes
- Angular CLI v21, projeto Angular v19+
- Multi-tenant preparado mas NAO implementado (Fase 2 futura)
- Cada usuario tera link: labswill.com/{tenant-slug}/{path}
- Dashboard de assinantes NAO sera construido - apenas preparado
- Email: Resend (primario) / SMTP (fallback) / Nenhum
- ngx-mask para mascaras de input (CPF, CNPJ, phone, CEP, date)
