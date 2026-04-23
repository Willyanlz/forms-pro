# Labs Will - Documentacao Geral do Sistema

## Visao Geral
Labs Will e um SaaS de formularios dinamicos para assessores de investimentos. O administrador (assessor) gerencia formularios personalizaveis que seus clientes preenchem. Os dados sao armazenados e notificados por e-mail.

## Stack Tecnologica
- **Frontend**: Angular 19+ (standalone components, signals, typed forms)
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Linguagem**: TypeScript strict
- **Estilo**: SCSS + TailwindCSS
- **i18n**: ngx-translate (pt-BR, en-US, es-ES)
- **Email**: Resend API (primario) / SMTP (fallback)
- **Mascaras**: ngx-mask
- **DnD**: @angular/cdk/drag-drop
- **Deploy**: Vercel (frontend) + Supabase (backend)

## Arquitetura
```
src/app/
  core/          -> Services, guards, models, interceptors
  shared/        -> Componentes reutilizaveis, validators, pipes, directives
  features/
    landing/     -> Landing page publica
    auth/        -> Login, set-password
    forms/       -> Formularios publicos (lista + wizard)
    admin/       -> Area administrativa
      dashboard/ -> Visao geral
      form-builder/ -> Construtor de formularios
      submissions/  -> Respostas
      settings/     -> Configuracoes
    not-found/   -> Pagina 404
```

## Banco de Dados
- **admin_profile**: Perfil publico do assessor
- **app_settings**: Configuracoes globais (cores, email, idioma)
- **form_templates**: Formularios criados pelo admin
- **form_sections**: Secoes dentro de um formulario
- **form_fields**: Campos dinamicos de cada secao
- **form_submissions**: Respostas submetidas
- **allowed_emails**: Emails pre-autorizados para acesso

## Seguranca
- RLS em todas as tabelas
- Isolamento por user_id (multi-tenant ready)
- Service role key nunca no frontend
- Rate limiting na submissao publica
- Validacao matematica CPF/CNPJ
- Dupla confirmacao para acoes destrutivas

## Multi-tenant (Preparado - Fase 2)
- Cada tabela tem user_id com RLS
- admin_profile.slug para resolucao por URL
- Pattern: labswill.com/{tenant-slug}/{path}
- TenantService preparado (comentado)
