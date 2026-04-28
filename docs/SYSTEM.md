# Labs Will - Documentacao do Sistema

## Visao Geral
Sistema de formularios dinamicos com landing page, formularios publicos em wizard, area admin, form builder, submissions e settings.

## Tecnologias
- Frontend: Angular standalone
- Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Estilizacao: Tailwind CSS + SCSS
- i18n: ngx-translate (pt/en/es)
- Mascaras: ngx-mask

## Estrutura de Diretorios
```text
src/app/
|- core/      # Services, guards, interceptors, models
|- shared/    # Componentes, pipes, validators, directives
|- features/  # Landing, auth, forms, admin, not-found
```

## Padrao de Desenvolvimento
### Componentes
✅ **PADRÃO OBRIGATÓRIO PARA TODOS OS COMPONENTES, SEM EXCEÇÃO**

Todos os componentes deste projeto DEVEM ser separados obrigatoriamente em 3 arquivos distintos:
| Arquivo | Finalidade |
|---------|------------|
| `nome-componente.component.ts` | Lógica TypeScript / Decorator @Component |
| `nome-componente.component.html` | Template HTML (nenhum template inline permitido) |
| `nome-componente.component.scss` | Estilos SCSS (nenhum style inline permitido) |

🚫 **PROIBIDO ABSOLUTAMENTE:**
- Uso de `template: ''` inline no @Component
- Uso de `styles: []` inline no @Component
- Qualquer componente com menos de 3 arquivos separados

⚠️ Esta regra não tem exceções. Qualquer componente novo criado deve seguir este padrão.

### Estilizacao e UX
- Priorize o uso de variaveis do `_variables.scss` via Tailwind ou SCSS.
- Garanta contraste adequado para fontes, placeholders e estados de hover.
- Todos os componentes devem suportar Dark Mode usando as classes `dark:` do Tailwind.

## Historico de Alteracoes

### 2026-04-23 - Correcao de Erros de Build
- Corrigido export de tipos no models/index.ts (TS1205)
- Corrigido export de tipos no services/index.ts (TS1205)
- Corrigido LanguageCode nao exportado no i18n.service.ts
- Corrigido tipo string vs LanguageCode no language-selector
- Corrigido EventTarget null no click-outside.directive.ts
- Adicionado import de Locale no relative-time.pipe.ts
- Reordenado @use rules no styles.scss
- Adicionado cores text.primary/text.secondary no tailwind.config.js
- Build compilando com sucesso

### 2026-04-23 - Estabilizacao de Bootstrap e Tipagem
- Alinhados models com os campos reais do schema Supabase em snake_case
- Registrados providers globais de HttpClient, ngx-translate e ngx-mask
- Inicializacao de tema e idioma movida para o root app
- Corrigidos erros de tipagem em auth, forms, settings e form builder
- Ajustados scripts npm para usar o Angular CLI local
- Validacao TypeScript sem erros
- `npm run start` deixou de falhar no bootstrap do Node/CLI; no sandbox ainda existe `spawn EPERM` do esbuild
