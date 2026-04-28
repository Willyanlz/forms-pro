# 👑 PROMPT DO SISTEMA DE GERENCIAMENTO SUPER ADMIN - SAAS FORMS PRO
> Este é o prompt para criação do sistema MASTER que eu (dono do SaaS) vou usar para gerenciar TODOS os assinantes, tenants e toda a plataforma. É um sistema separado, que roda em um domínio privado exclusivo para mim.

---

## 🎯 OBJETIVO DESTE SISTEMA
Eu sou o proprietário do SaaS Forms Pro. Eu preciso de um painel SUPER ADMINISTRATIVO onde eu consigo:
✅ Ver todos os assinantes cadastrados na plataforma
✅ Cadastrar novos clientes manualmente
✅ Bloquear / Ativar contas
✅ Ver uso, estatísticas e métricas por tenant
✅ Gerenciar planos e limites de cada assinante
✅ Impersonar qualquer conta para suporte
✅ Ver logs globais da plataforma
✅ Gerenciar configurações globais do SaaS

---

## 🏗️ ARQUITETURA MULTI-TENANT
O SaaS já está 100% preparado para multi-tenant:
```
✅ TODAS as tabelas já tem campo `user_id`
✅ RLS já implementado em todas tabelas
✅ Cada tenant é isolado automaticamente por user_id
✅ Campo `slug` existe em admin_profile para URL customizada
✅ Padrão de URL: `labswill.com/{slug-tenant}/qualquer-rota`
✅ TenantService já existe no core (atualmente comentado)
✅ Todos os dados já estão separados nativamente
```

> ✅ NÃO PRECISA ALTERAR NADA NO BANCO EXISTENTE. O banco já está preparado. Este sistema SUPER ADMIN vai apenas ler e gerenciar os dados que já existem.

---

## 🔧 STACK TECNOLÓGICA PARA ESTE SISTEMA
Exatamente os mesmos padrões do projeto principal para manter consistência:
- Angular 19+ Standalone Components
- Supabase com Service Role (este sistema NÃO usa RLS, tem acesso total)
- Tailwind CSS mesmo Design System
- Mesmos padrões de componentes: 3 arquivos separados obrigatórios
- Mesmo sistema de Dark Mode
- Mesmas animações e padrões visuais

> ⚠️ IMPORTANTE: Este sistema se conecta no MESMO banco de dados do SaaS principal. Ele é apenas uma interface administrativa com permissões elevadas.

---

## 📋 FUNCIONALIDADES OBRIGATÓRIAS DO SUPER ADMIN

### 🔹 Dashboard Geral
- Número total de tenants ativos
- Novos cadastros nos últimos 7/30 dias
- Total de formulários criados na plataforma
- Total de submissões recebidas
- Gráfico de crescimento
- Últimos tenants cadastrados

### 🔹 Lista de Tenants / Assinantes
Tabela com paginação contendo:
- Nome do assessor
- Email
- Slug da conta
- Data de cadastro
- Status (Ativo / Bloqueado / Trial / Pago)
- Plano atual
- Número de formulários que ele criou
- Número de submissões
- Último acesso
- Ações: Visualizar, Editar, Bloquear, Impersonar, Excluir

### 🔹 Detalhes do Tenant
Página individual para cada assinante:
- Dados completos do perfil
- Histórico de atividade
- Lista de todos os formulários dele
- Lista de todas as submissões dele
- Configurações do plano
- Limites de uso
- Logs de acesso

### 🔹 Cadastrar Novo Assinante
Formulário para eu criar contas manualmente:
- Nome, Email, Telefone
- Definir senha temporária
- Selecionar plano
- Definir limites customizados
- Enviar email de boas vindas automaticamente

### 🔹 Gerenciamento de Planos
- Definir planos padrões (Free, Basic, Pro, Enterprise)
- Limites: número máximo de formulários, submissões por mês, armazenamento
- Valores e período de cobrança
- Features habilitadas por plano

### 🔹 Impersonação
✅ Funcionalidade mais importante:
Botão "Logar como esse usuário" que me loga diretamente na conta do assinante exatamente como ele vê, sem precisar da senha dele, para fins de suporte.

### 🔹 Logs Globais
- Todos os logins na plataforma
- Ações importantes
- Erros e falhas
- Uso da API

---

## 🔒 SEGURANÇA OBRIGATÓRIA
1. Apenas 1 usuário tem acesso a este sistema: EU
2. Autenticação separada, não usa o mesmo auth dos tenants
3. Todas ações são logadas
4. Nenhuma modificação em dados de produção sem confirmação dupla
5. Service Role key do Supabase usada APENAS no lado servidor via Edge Function
6. NUNCA exponha a service role key no frontend
7. IP whitelist opcional

---

## 🎨 PADRÕES DE DESIGN E CÓDIGO
✅ SEGUIR EXATAMENTE OS MESMOS PADRÕES DO PROJETO PRINCIPAL:
- Todo componente com 3 arquivos separados (.ts, .html, .scss)
- Nenhum template ou style inline
- Dark Mode nativo Tailwind
- Mesmas cores, espaçamentos, sombras e bordas
- Mesmos padrões de tabelas, botões e formulários
- Mesmo padrão de loading e estados
- Responsivo mobile primeiro

---

## 📁 ESTRUTURA DE ARQUIVOS
Este sistema vai ficar dentro do projeto principal em uma rota protegida separada:
```
src/app/features/
    └── super-admin/
        ├── dashboard/
        ├── tenants/
        ├── tenant-detail/
        ├── plans/
        ├── logs/
        ├── settings/
        └── guards/
```

✅ Uma guard específica vai bloquear 100% o acesso a todas as rotas /super-admin/* para todos os usuários exceto eu.

---

## ✅ REGRAS PARA IA DESENVOLVER ESTE SISTEMA

1. 🔹 Primeiro estude TODOS os padrões, componentes e estilo do projeto existente
2. 🔹 NÃO invente novos padrões. Copie exatamente o que já existe
3. 🔹 Use os componentes shared que já estão criados (tabelas, botões, inputs, cards)
4. 🔹 Crie apenas o que é novo, tudo que já existe reutilize
5. 🔹 Não quebre nada que já funciona no SaaS principal
6. 🔹 Este sistema é totalmente transparente para os tenants, eles não sabem que ele existe
7. 🔹 Todas as operações perigosas tem confirmação dupla

---

## 🎯 CHECKLIST DE CONCLUSÃO
- [ ] Rota /super-admin criada e completamente bloqueada
- [ ] Dashboard com métricas globais
- [ ] Lista completa de tenants com paginação e filtros
- [ ] Página de detalhes individual do tenant
- [ ] Cadastro manual de novos assinantes
- [ ] Funcionalidade de bloqueio/ativação de contas
- [ ] Impersonação 100% funcional
- [ ] Gerenciamento de planos e limites
- [ ] Tela de logs globais
- [ ] Dark Mode funcionando perfeitamente
- [ ] Responsivo em mobile
- [ ] Nenhum erro TypeScript
- [ ] Não quebrou nenhuma funcionalidade existente

---

> 📌 Este sistema é o painel de controle do SaaS. É a ferramenta que eu vou usar diariamente para gerenciar todo o negócio. Ele deve ser rápido, seguro e extremamente confiável.