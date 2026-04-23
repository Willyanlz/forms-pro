-- =============================================================================
-- Migration 00003: Seed Forms
-- Labs Will SaaS - Initial form templates
--
-- PURPOSE:
--   Seeds 2 form templates with all sections and fields.
--   Translated fields use JSONB format: {"pt": "..."} (Portuguese only for seed).
--
-- BEFORE RUNNING:
--   Replace '00000000-0000-0000-0000-000000000001' with the real admin user UUID.
--   This must be run AFTER 00002_seed_admin.sql.
-- =============================================================================

DO $$
DECLARE
  v_user_id UUID := '00000000-0000-0000-0000-000000000001'; -- REPLACE WITH REAL USER UUID

  -- Form 1: Ficha de Revisao - Pessoa Fisica
  v_form1_id   UUID := uuid_generate_v4();

  v_s1_id  UUID := uuid_generate_v4();  -- Identificacao Pessoal
  v_s2_id  UUID := uuid_generate_v4();  -- Dados de Contato
  v_s3_id  UUID := uuid_generate_v4();  -- Dados Profissionais e Renda
  v_s4_id  UUID := uuid_generate_v4();  -- Patrimonio
  v_s5_id  UUID := uuid_generate_v4();  -- Dividas e Compromissos Financeiros
  v_s6_id  UUID := uuid_generate_v4();  -- Objetivos e Metas
  v_s7_id  UUID := uuid_generate_v4();  -- Perfil de Investidor
  v_s8_id  UUID := uuid_generate_v4();  -- Protecao e Seguros
  v_s9_id  UUID := uuid_generate_v4();  -- Planejamento Fiscal
  v_s10_id UUID := uuid_generate_v4();  -- Observacoes Gerais

  -- Form 2: Reuniao de Acompanhamento - Pessoa Juridica
  v_form2_id   UUID := uuid_generate_v4();

  v_s11_id UUID := uuid_generate_v4();  -- Dados da Empresa
  v_s12_id UUID := uuid_generate_v4();  -- Situacao Financeira
  v_s13_id UUID := uuid_generate_v4();  -- Fluxo de Caixa e Capital de Giro
  v_s14_id UUID := uuid_generate_v4();  -- Investimentos e Patrimonio Empresarial
  v_s15_id UUID := uuid_generate_v4();  -- Dividas e Obrigacoes
  v_s16_id UUID := uuid_generate_v4();  -- Planejamento e Objetivos
  v_s17_id UUID := uuid_generate_v4();  -- Observacoes e Encaminhamentos

BEGIN

-- =============================================================================
-- FORM 1: Ficha de Revisao - Pessoa Fisica
-- =============================================================================

INSERT INTO public.form_templates (id, user_id, title, description, slug, status, display_order)
VALUES (
  v_form1_id,
  v_user_id,
  '{"pt": "Ficha de Revisão - Pessoa Física"}'::jsonb,
  '{"pt": "Formulário completo de revisão financeira para pessoa física. Preencha com atenção todos os campos para que possamos oferecer o melhor acompanhamento."}'::jsonb,
  'ficha-revisao-pessoa-fisica',
  'active',
  1
);

-- -------------------------------------------------------
-- Section 1: Identificacao Pessoal
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s1_id, v_form1_id,
  '{"pt": "Identificação Pessoal"}'::jsonb,
  '{"pt": "Informações básicas de identificação do cliente."}'::jsonb,
  1
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, display_order)
VALUES
  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Nome Completo"}'::jsonb,
   '{"pt": "Digite seu nome completo"}'::jsonb,
   '{"pt": "Conforme documento de identidade"}'::jsonb,
   'text', TRUE, 1),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "CPF"}'::jsonb,
   '{"pt": "000.000.000-00"}'::jsonb,
   '{"pt": "Somente números serão aceitos"}'::jsonb,
   'cpf', TRUE, 2),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Data de Nascimento"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Sua data de nascimento"}'::jsonb,
   'date', TRUE, 3),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Estado Civil"}'::jsonb,
   '{"pt": "Selecione seu estado civil"}'::jsonb,
   '{}'::jsonb,
   'select', TRUE, 4),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Regime de Bens"}'::jsonb,
   '{"pt": "Selecione o regime"}'::jsonb,
   '{"pt": "Preencha apenas se casado(a) ou em união estável"}'::jsonb,
   'select', FALSE, 5),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Possui dependentes?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Filhos, pais ou outras pessoas que dependem financeiramente de você"}'::jsonb,
   'toggle', FALSE, 6),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Número de Dependentes"}'::jsonb,
   '{"pt": "Ex: 2"}'::jsonb,
   '{"pt": "Quantas pessoas dependem financeiramente de você?"}'::jsonb,
   'number', FALSE, 7),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Escolaridade"}'::jsonb,
   '{"pt": "Selecione sua escolaridade"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE, 8),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Nacionalidade"}'::jsonb,
   '{"pt": "Ex: Brasileiro(a)"}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, 9),

  (uuid_generate_v4(), v_s1_id, v_form1_id,
   '{"pt": "Documento de Identidade (RG)"}'::jsonb,
   '{"pt": "Ex: 12.345.678-9"}'::jsonb,
   '{"pt": "Número do RG ou CNH"}'::jsonb,
   'text', FALSE, 10);


-- -------------------------------------------------------
-- Section 2: Dados de Contato
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s2_id, v_form1_id,
  '{"pt": "Dados de Contato"}'::jsonb,
  '{"pt": "Informações para contato e localização."}'::jsonb,
  2
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, display_order)
VALUES
  (uuid_generate_v4(), v_s2_id, v_form1_id,
   '{"pt": "E-mail Principal"}'::jsonb,
   '{"pt": "seu@email.com"}'::jsonb,
   '{"pt": "Endereço de e-mail para comunicações importantes"}'::jsonb,
   'email', TRUE, 1),

  (uuid_generate_v4(), v_s2_id, v_form1_id,
   '{"pt": "Telefone / WhatsApp"}'::jsonb,
   '{"pt": "(00) 00000-0000"}'::jsonb,
   '{"pt": "Número com DDD"}'::jsonb,
   'phone', TRUE, 2),

  (uuid_generate_v4(), v_s2_id, v_form1_id,
   '{"pt": "Telefone Secundário"}'::jsonb,
   '{"pt": "(00) 00000-0000"}'::jsonb,
   '{"pt": "Opcional"}'::jsonb,
   'phone', FALSE, 3),

  (uuid_generate_v4(), v_s2_id, v_form1_id,
   '{"pt": "CEP"}'::jsonb,
   '{"pt": "00000-000"}'::jsonb,
   '{"pt": "Informe seu CEP para preenchimento automático do endereço"}'::jsonb,
   'cep', TRUE, 4),

  (uuid_generate_v4(), v_s2_id, v_form1_id,
   '{"pt": "Endereço"}'::jsonb,
   '{"pt": "Rua, número, complemento"}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, 5),

  (uuid_generate_v4(), v_s2_id, v_form1_id,
   '{"pt": "Bairro"}'::jsonb,
   '{"pt": "Nome do bairro"}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, 6),

  (uuid_generate_v4(), v_s2_id, v_form1_id,
   '{"pt": "Cidade"}'::jsonb,
   '{"pt": "Nome da cidade"}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, 7),

  (uuid_generate_v4(), v_s2_id, v_form1_id,
   '{"pt": "Estado (UF)"}'::jsonb,
   '{"pt": "Ex: SP"}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, 8);


-- -------------------------------------------------------
-- Section 3: Dados Profissionais e Renda
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s3_id, v_form1_id,
  '{"pt": "Dados Profissionais e Renda"}'::jsonb,
  '{"pt": "Informações sobre sua atividade profissional e fontes de renda."}'::jsonb,
  3
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Situação Profissional"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', TRUE,
   '["Empregado CLT", "Servidor Público", "Autônomo", "Empresário / Sócio", "Profissional Liberal", "Aposentado / Pensionista", "Investidor", "Desempregado", "Outro"]'::jsonb,
   1),

  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Profissão / Cargo"}'::jsonb,
   '{"pt": "Ex: Engenheiro, Médico, Analista..."}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Empresa / Empregador"}'::jsonb,
   '{"pt": "Nome da empresa"}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Renda Mensal Bruta"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Valor total antes dos descontos"}'::jsonb,
   'money', TRUE, NULL, 4),

  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Renda Mensal Líquida"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Valor que efetivamente recebe após descontos"}'::jsonb,
   'money', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Possui outras fontes de renda?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Aluguéis, dividendos, freelas, etc."}'::jsonb,
   'toggle', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Descreva as outras fontes de renda"}'::jsonb,
   '{"pt": "Ex: Aluguel R$ 1.500, dividendos R$ 500..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 7),

  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Renda Total Mensal (todas as fontes)"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Soma de todas as fontes de renda mensais"}'::jsonb,
   'money', FALSE, NULL, 8),

  (uuid_generate_v4(), v_s3_id, v_form1_id,
   '{"pt": "Tempo na Empresa / Atividade Atual (anos)"}'::jsonb,
   '{"pt": "Ex: 5"}'::jsonb,
   '{}'::jsonb,
   'number', FALSE, NULL, 9);


-- -------------------------------------------------------
-- Section 4: Patrimonio
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s4_id, v_form1_id,
  '{"pt": "Patrimônio"}'::jsonb,
  '{"pt": "Relação de bens e ativos que você possui."}'::jsonb,
  4
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Possui imóveis?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Valor Total dos Imóveis"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Estimativa de valor de mercado"}'::jsonb,
   'money', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Possui veículos?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Valor Total dos Veículos"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Estimativa de valor de mercado"}'::jsonb,
   'money', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Possui investimentos financeiros?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "CDB, LCI, ações, fundos, tesouro direto, poupança, etc."}'::jsonb,
   'toggle', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Tipos de Investimentos"}'::jsonb,
   '{"pt": "Selecione todos que se aplicam"}'::jsonb,
   '{}'::jsonb,
   'checkbox', FALSE,
   '["Poupança", "CDB / LCI / LCA", "Tesouro Direto", "Fundos de Investimento", "Ações", "FIIs (Fundos Imobiliários)", "Previdência Privada", "Criptomoedas", "Outros"]'::jsonb,
   6),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Valor Total dos Investimentos"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Valor total aproximado da carteira de investimentos"}'::jsonb,
   'money', FALSE, NULL, 7),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Possui participação em empresas (sócio)?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 8),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Valor Estimado da Participação Societária"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 9),

  (uuid_generate_v4(), v_s4_id, v_form1_id,
   '{"pt": "Patrimônio Total Estimado"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Soma de todos os seus bens e ativos"}'::jsonb,
   'money', FALSE, NULL, 10);


-- -------------------------------------------------------
-- Section 5: Dividas e Compromissos Financeiros
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s5_id, v_form1_id,
  '{"pt": "Dívidas e Compromissos Financeiros"}'::jsonb,
  '{"pt": "Informações sobre suas obrigações e dívidas atuais."}'::jsonb,
  5
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Possui financiamento imobiliário?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Parcela Mensal do Financiamento Imobiliário"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Prazo Restante (meses)"}'::jsonb,
   '{"pt": "Ex: 240"}'::jsonb,
   '{}'::jsonb,
   'number', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Possui financiamento de veículo?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Parcela Mensal do Financiamento de Veículo"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Possui empréstimos pessoais ou consignados?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Valor Total das Parcelas de Empréstimos"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Soma das parcelas mensais"}'::jsonb,
   'money', FALSE, NULL, 7),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Possui dívidas no cartão de crédito?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 8),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Valor da Fatura Mensal do Cartão"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Valor médio mensal gasto no cartão"}'::jsonb,
   'money', FALSE, NULL, 9),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Total de Compromissos Mensais (dívidas)"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Soma de todas as parcelas e dívidas mensais"}'::jsonb,
   'money', FALSE, NULL, 10),

  (uuid_generate_v4(), v_s5_id, v_form1_id,
   '{"pt": "Índice de Endividamento Percebido"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{"pt": "Como você avalia seu nível de endividamento?"}'::jsonb,
   'select', FALSE,
   '["Sem dívidas", "Saudável (abaixo de 30% da renda)", "Moderado (30% a 50% da renda)", "Elevado (acima de 50% da renda)", "Comprometido (acima de 70% da renda)"]'::jsonb,
   11);


-- -------------------------------------------------------
-- Section 6: Objetivos e Metas
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s6_id, v_form1_id,
  '{"pt": "Objetivos e Metas"}'::jsonb,
  '{"pt": "Seus sonhos e metas financeiras de curto, médio e longo prazo."}'::jsonb,
  6
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s6_id, v_form1_id,
   '{"pt": "Principais Objetivos Financeiros"}'::jsonb,
   '{"pt": "Selecione todos que se aplicam"}'::jsonb,
   '{}'::jsonb,
   'checkbox', TRUE,
   '["Quitar dívidas", "Montar reserva de emergência", "Comprar imóvel", "Comprar veículo", "Viajar", "Aposentadoria antecipada", "Independência financeira", "Investir", "Abrir empresa", "Educação dos filhos", "Outro"]'::jsonb,
   1),

  (uuid_generate_v4(), v_s6_id, v_form1_id,
   '{"pt": "Prazo para Atingir a Meta Principal"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "5 a 10 anos", "Mais de 10 anos"]'::jsonb,
   2),

  (uuid_generate_v4(), v_s6_id, v_form1_id,
   '{"pt": "Valor Necessário para a Meta Principal"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Quanto você precisa economizar ou acumular?"}'::jsonb,
   'money', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s6_id, v_form1_id,
   '{"pt": "Capacidade de Poupança Mensal Atual"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Quanto você consegue guardar por mês hoje?"}'::jsonb,
   'money', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s6_id, v_form1_id,
   '{"pt": "Descreva suas metas com mais detalhes"}'::jsonb,
   '{"pt": "Escreva livremente sobre seus objetivos..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 5);


-- -------------------------------------------------------
-- Section 7: Perfil de Investidor
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s7_id, v_form1_id,
  '{"pt": "Perfil de Investidor"}'::jsonb,
  '{"pt": "Avaliação do seu perfil e tolerância a risco."}'::jsonb,
  7
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s7_id, v_form1_id,
   '{"pt": "Qual é o seu perfil de investidor?"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{"pt": "Se já fez suitability, informe o resultado"}'::jsonb,
   'select', FALSE,
   '["Conservador", "Moderado", "Arrojado / Agressivo", "Não sei / Nunca fiz avaliação"]'::jsonb,
   1),

  (uuid_generate_v4(), v_s7_id, v_form1_id,
   '{"pt": "Experiência com Investimentos"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Nenhuma experiência", "Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "Mais de 5 anos"]'::jsonb,
   2),

  (uuid_generate_v4(), v_s7_id, v_form1_id,
   '{"pt": "Como reagiria se seu investimento caísse 20% em um mês?"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'radio', FALSE,
   '["Resgataria tudo imediatamente", "Ficaria preocupado mas esperaria recuperar", "Aproveitaria para comprar mais", "Não me incomodaria, faz parte"]'::jsonb,
   3),

  (uuid_generate_v4(), v_s7_id, v_form1_id,
   '{"pt": "Horizonte de Investimento"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Curto prazo (até 2 anos)", "Médio prazo (2 a 5 anos)", "Longo prazo (acima de 5 anos)"]'::jsonb,
   4),

  (uuid_generate_v4(), v_s7_id, v_form1_id,
   '{"pt": "Já investiu em renda variável (ações, FIIs)?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s7_id, v_form1_id,
   '{"pt": "Possui reserva de emergência?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Valor equivalente a 3 a 6 meses de despesas"}'::jsonb,
   'toggle', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s7_id, v_form1_id,
   '{"pt": "Valor da Reserva de Emergência"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 7);


-- -------------------------------------------------------
-- Section 8: Protecao e Seguros
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s8_id, v_form1_id,
  '{"pt": "Proteção e Seguros"}'::jsonb,
  '{"pt": "Avaliação das suas proteções e coberturas de seguro."}'::jsonb,
  8
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s8_id, v_form1_id,
   '{"pt": "Possui seguro de vida?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s8_id, v_form1_id,
   '{"pt": "Capital Segurado (Seguro de Vida)"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Valor da cobertura do seguro de vida"}'::jsonb,
   'money', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s8_id, v_form1_id,
   '{"pt": "Possui plano de saúde?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s8_id, v_form1_id,
   '{"pt": "Custo Mensal do Plano de Saúde"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s8_id, v_form1_id,
   '{"pt": "Possui previdência privada?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s8_id, v_form1_id,
   '{"pt": "Tipo de Previdência"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["PGBL", "VGBL", "Ambos", "Não sei"]'::jsonb,
   6),

  (uuid_generate_v4(), v_s8_id, v_form1_id,
   '{"pt": "Valor Acumulado na Previdência"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 7),

  (uuid_generate_v4(), v_s8_id, v_form1_id,
   '{"pt": "Outros Seguros"}'::jsonb,
   '{"pt": "Ex: seguro do carro, residencial..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 8);


-- -------------------------------------------------------
-- Section 9: Planejamento Fiscal
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s9_id, v_form1_id,
  '{"pt": "Planejamento Fiscal"}'::jsonb,
  '{"pt": "Informações sobre declaração de imposto de renda e planejamento tributário."}'::jsonb,
  9
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s9_id, v_form1_id,
   '{"pt": "Declara Imposto de Renda?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s9_id, v_form1_id,
   '{"pt": "Modalidade da Declaração"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Simplificada", "Completa", "Não sei"]'::jsonb,
   2),

  (uuid_generate_v4(), v_s9_id, v_form1_id,
   '{"pt": "Possui despesas dedutíveis?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Educação, saúde, previdência, dependentes..."}'::jsonb,
   'toggle', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s9_id, v_form1_id,
   '{"pt": "Tipos de Deduções"}'::jsonb,
   '{"pt": "Selecione todas que se aplicam"}'::jsonb,
   '{}'::jsonb,
   'checkbox', FALSE,
   '["Despesas médicas / Plano de saúde", "Educação", "Previdência privada (PGBL)", "Dependentes", "Pensão alimentícia", "Doações a fundos aprovados", "Livro caixa (autônomo)"]'::jsonb,
   4),

  (uuid_generate_v4(), v_s9_id, v_form1_id,
   '{"pt": "Resultado da Última Declaração"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Restituição", "Imposto a pagar", "Zerou", "Não declarei", "Não sei"]'::jsonb,
   5),

  (uuid_generate_v4(), v_s9_id, v_form1_id,
   '{"pt": "Observações Fiscais"}'::jsonb,
   '{"pt": "Informações adicionais sobre sua situação fiscal..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 6);


-- -------------------------------------------------------
-- Section 10: Observacoes Gerais
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s10_id, v_form1_id,
  '{"pt": "Observações Gerais"}'::jsonb,
  '{"pt": "Espaço livre para informações complementares e comentários."}'::jsonb,
  10
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s10_id, v_form1_id,
   '{"pt": "Preocupações Financeiras Atuais"}'::jsonb,
   '{"pt": "Descreva suas principais preocupações..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s10_id, v_form1_id,
   '{"pt": "Expectativas para esta Revisão"}'::jsonb,
   '{"pt": "O que espera desta reunião?"}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s10_id, v_form1_id,
   '{"pt": "Houve mudança significativa na sua vida financeira?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Mudança de emprego, herança, casamento, filhos, etc."}'::jsonb,
   'toggle', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s10_id, v_form1_id,
   '{"pt": "Descreva a mudança"}'::jsonb,
   '{"pt": "Explique brevemente o que mudou..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s10_id, v_form1_id,
   '{"pt": "Como avalia seu conhecimento financeiro?"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'radio', FALSE,
   '["Iniciante", "Básico", "Intermediário", "Avançado"]'::jsonb,
   5),

  (uuid_generate_v4(), v_s10_id, v_form1_id,
   '{"pt": "Informações Adicionais"}'::jsonb,
   '{"pt": "Qualquer outra informação relevante..."}'::jsonb,
   '{"pt": "Campo livre para qualquer informação que julgue importante"}'::jsonb,
   'textarea', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s10_id, v_form1_id,
   '{"pt": "Como nos conheceu?"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Indicação de amigo / familiar", "Redes sociais", "Google / Pesquisa", "LinkedIn", "Evento / Palestra", "Outro"]'::jsonb,
   7),

  (uuid_generate_v4(), v_s10_id, v_form1_id,
   '{"pt": "Autorizo o uso dos meus dados para fins de planejamento financeiro"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Seus dados são tratados com total confidencialidade conforme nossa política de privacidade"}'::jsonb,
   'toggle', TRUE, NULL, 8);


-- =============================================================================
-- FORM 2: Reuniao de Acompanhamento - Pessoa Juridica
-- =============================================================================

INSERT INTO public.form_templates (id, user_id, title, description, slug, status, display_order)
VALUES (
  v_form2_id,
  v_user_id,
  '{"pt": "Reunião de Acompanhamento - Pessoa Jurídica"}'::jsonb,
  '{"pt": "Formulário de acompanhamento financeiro para empresas e empresários. Preencha antes da reunião para otimizarmos nosso tempo juntos."}'::jsonb,
  'reuniao-acompanhamento-pessoa-juridica',
  'active',
  2
);


-- -------------------------------------------------------
-- Section 11: Dados da Empresa
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s11_id, v_form2_id,
  '{"pt": "Dados da Empresa"}'::jsonb,
  '{"pt": "Informações cadastrais e de identificação da empresa."}'::jsonb,
  1
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Razão Social"}'::jsonb,
   '{"pt": "Nome oficial da empresa"}'::jsonb,
   '{}'::jsonb,
   'text', TRUE, NULL, 1),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Nome Fantasia"}'::jsonb,
   '{"pt": "Nome pelo qual a empresa é conhecida"}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "CNPJ"}'::jsonb,
   '{"pt": "00.000.000/0000-00"}'::jsonb,
   '{}'::jsonb,
   'cnpj', TRUE, NULL, 3),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Setor / Segmento de Atuação"}'::jsonb,
   '{"pt": "Ex: Saúde, Tecnologia, Varejo, Serviços..."}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Regime Tributário"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', TRUE,
   '["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Não sei"]'::jsonb,
   5),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Porte da Empresa"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["MEI", "Microempresa (ME)", "Empresa de Pequeno Porte (EPP)", "Médio Porte", "Grande Empresa"]'::jsonb,
   6),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Número de Sócios"}'::jsonb,
   '{"pt": "Ex: 2"}'::jsonb,
   '{}'::jsonb,
   'number', FALSE, NULL, 7),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Número de Funcionários"}'::jsonb,
   '{"pt": "Ex: 15"}'::jsonb,
   '{}'::jsonb,
   'number', FALSE, NULL, 8),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Data de Fundação da Empresa"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'date', FALSE, NULL, 9),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "Nome do Responsável pela Reunião"}'::jsonb,
   '{"pt": "Nome completo do sócio / representante"}'::jsonb,
   '{}'::jsonb,
   'text', TRUE, NULL, 10),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "E-mail do Responsável"}'::jsonb,
   '{"pt": "contato@empresa.com"}'::jsonb,
   '{}'::jsonb,
   'email', TRUE, NULL, 11),

  (uuid_generate_v4(), v_s11_id, v_form2_id,
   '{"pt": "WhatsApp do Responsável"}'::jsonb,
   '{"pt": "(00) 00000-0000"}'::jsonb,
   '{}'::jsonb,
   'phone', TRUE, NULL, 12);


-- -------------------------------------------------------
-- Section 12: Situacao Financeira
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s12_id, v_form2_id,
  '{"pt": "Situação Financeira"}'::jsonb,
  '{"pt": "Panorama da saúde financeira atual da empresa."}'::jsonb,
  2
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Faturamento Mensal Médio (últimos 3 meses)"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Receita bruta mensal média"}'::jsonb,
   'money', TRUE, NULL, 1),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Faturamento Anual (último exercício)"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Custos e Despesas Mensais Totais"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Soma de todos os custos fixos e variáveis mensais"}'::jsonb,
   'money', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Lucro Líquido Mensal Estimado"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Faturamento menos custos e impostos"}'::jsonb,
   'money', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Margem de Lucro Percebida"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Negativa (prejuízo)", "Menos de 5%", "5% a 10%", "10% a 20%", "20% a 30%", "Acima de 30%"]'::jsonb,
   5),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "A empresa possui contabilidade organizada?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Balancete, DRE e Fluxo de Caixa atualizados"}'::jsonb,
   'toggle', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Possui contador / escritório contábil?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 7),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Está em dia com as obrigações fiscais?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Impostos, DAS, FGTS, folha de pagamento..."}'::jsonb,
   'radio', FALSE,
   '["Sim, totalmente em dia", "Parcialmente em dia", "Não, possuo débitos", "Não sei"]'::jsonb,
   8),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Possui débitos com a Receita Federal ou PGFN?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 9),

  (uuid_generate_v4(), v_s12_id, v_form2_id,
   '{"pt": "Valor Aproximado dos Débitos Fiscais"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 10);


-- -------------------------------------------------------
-- Section 13: Fluxo de Caixa e Capital de Giro
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s13_id, v_form2_id,
  '{"pt": "Fluxo de Caixa e Capital de Giro"}'::jsonb,
  '{"pt": "Análise da liquidez e gestão do capital de giro."}'::jsonb,
  3
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s13_id, v_form2_id,
   '{"pt": "A empresa controla o fluxo de caixa?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Planilha, sistema ERP, software financeiro..."}'::jsonb,
   'toggle', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s13_id, v_form2_id,
   '{"pt": "Ferramenta usada para controle financeiro"}'::jsonb,
   '{"pt": "Ex: Excel, Conta Azul, Omie, QuickBooks..."}'::jsonb,
   '{}'::jsonb,
   'text', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s13_id, v_form2_id,
   '{"pt": "Saldo em Caixa / Conta Corrente Atual"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Disponibilidade financeira imediata da empresa"}'::jsonb,
   'money', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s13_id, v_form2_id,
   '{"pt": "Prazo Médio de Recebimento dos Clientes (dias)"}'::jsonb,
   '{"pt": "Ex: 30"}'::jsonb,
   '{}'::jsonb,
   'number', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s13_id, v_form2_id,
   '{"pt": "Prazo Médio de Pagamento aos Fornecedores (dias)"}'::jsonb,
   '{"pt": "Ex: 30"}'::jsonb,
   '{}'::jsonb,
   'number', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s13_id, v_form2_id,
   '{"pt": "A empresa possui necessidade de capital de giro?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s13_id, v_form2_id,
   '{"pt": "Como financia o capital de giro?"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Recursos próprios", "Cheque especial / Limite bancário", "Antecipação de recebíveis", "Empréstimo bancário", "Não necessita", "Outro"]'::jsonb,
   7),

  (uuid_generate_v4(), v_s13_id, v_form2_id,
   '{"pt": "Custo Mensal com Capital de Giro (juros)"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Juros pagos mensalmente para financiar o giro"}'::jsonb,
   'money', FALSE, NULL, 8);


-- -------------------------------------------------------
-- Section 14: Investimentos e Patrimonio Empresarial
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s14_id, v_form2_id,
  '{"pt": "Investimentos e Patrimônio Empresarial"}'::jsonb,
  '{"pt": "Ativos e investimentos da empresa."}'::jsonb,
  4
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s14_id, v_form2_id,
   '{"pt": "A empresa possui reserva de emergência?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Valor equivalente a 3 a 6 meses de custos fixos"}'::jsonb,
   'toggle', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s14_id, v_form2_id,
   '{"pt": "Valor da Reserva de Emergência Empresarial"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s14_id, v_form2_id,
   '{"pt": "A empresa possui investimentos financeiros?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "CDB, LCI, fundos, tesouro, renda variável..."}'::jsonb,
   'toggle', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s14_id, v_form2_id,
   '{"pt": "Valor Total dos Investimentos Empresariais"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s14_id, v_form2_id,
   '{"pt": "Valor dos Imóveis da Empresa"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Imóveis próprios em nome da empresa"}'::jsonb,
   'money', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s14_id, v_form2_id,
   '{"pt": "Valor dos Equipamentos / Maquinário"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Ativos operacionais da empresa"}'::jsonb,
   'money', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s14_id, v_form2_id,
   '{"pt": "Patrimônio Total da Empresa Estimado"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Soma de todos os ativos da empresa"}'::jsonb,
   'money', FALSE, NULL, 7);


-- -------------------------------------------------------
-- Section 15: Dividas e Obrigacoes
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s15_id, v_form2_id,
  '{"pt": "Dívidas e Obrigações"}'::jsonb,
  '{"pt": "Passivos e compromissos financeiros da empresa."}'::jsonb,
  5
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Possui empréstimos bancários empresariais?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Valor Total dos Empréstimos Empresariais"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Parcela Mensal Total dos Empréstimos"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Possui financiamento de equipamentos / veículos?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 4),

  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Parcela Mensal de Financiamentos"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Possui parcelamentos de impostos (REFIS/PERT)?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Parcela Mensal dos Parcelamentos Fiscais"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 7),

  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Total de Passivos Mensais"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Soma de todas as obrigações mensais da empresa"}'::jsonb,
   'money', FALSE, NULL, 8),

  (uuid_generate_v4(), v_s15_id, v_form2_id,
   '{"pt": "Grau de Endividamento da Empresa"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["Sem dívidas", "Saudável (dívidas < 30% do faturamento)", "Moderado (30% a 50%)", "Elevado (50% a 70%)", "Comprometido (acima de 70%)"]'::jsonb,
   9);


-- -------------------------------------------------------
-- Section 16: Planejamento e Objetivos
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s16_id, v_form2_id,
  '{"pt": "Planejamento e Objetivos"}'::jsonb,
  '{"pt": "Metas, crescimento e planejamento estratégico da empresa."}'::jsonb,
  6
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s16_id, v_form2_id,
   '{"pt": "Principais Objetivos Empresariais"}'::jsonb,
   '{"pt": "Selecione todos que se aplicam"}'::jsonb,
   '{}'::jsonb,
   'checkbox', FALSE,
   '["Reduzir custos", "Aumentar faturamento", "Contratar mais funcionários", "Expandir para novos mercados", "Quitar dívidas empresariais", "Criar reserva empresarial", "Sucessão / Planejamento societário", "Vender a empresa", "Abrir filial", "Melhorar margem de lucro", "Outro"]'::jsonb,
   1),

  (uuid_generate_v4(), v_s16_id, v_form2_id,
   '{"pt": "Meta de Faturamento para os Próximos 12 Meses"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{}'::jsonb,
   'money', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s16_id, v_form2_id,
   '{"pt": "Horizonte de Planejamento"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'select', FALSE,
   '["6 meses", "1 ano", "2 anos", "3 a 5 anos", "Mais de 5 anos"]'::jsonb,
   3),

  (uuid_generate_v4(), v_s16_id, v_form2_id,
   '{"pt": "Principais Desafios Atuais da Empresa"}'::jsonb,
   '{"pt": "Selecione todos que se aplicam"}'::jsonb,
   '{}'::jsonb,
   'checkbox', FALSE,
   '["Fluxo de caixa negativo", "Alta carga tributária", "Inadimplência de clientes", "Custo elevado de pessoal", "Concorrência acirrada", "Dificuldade de crédito", "Gestão financeira deficiente", "Outro"]'::jsonb,
   4),

  (uuid_generate_v4(), v_s16_id, v_form2_id,
   '{"pt": "Existe planejamento de sucessão ou saída societária?"}'::jsonb,
   '{}'::jsonb,
   '{}'::jsonb,
   'toggle', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s16_id, v_form2_id,
   '{"pt": "Descreva os planos de crescimento da empresa"}'::jsonb,
   '{"pt": "Estratégias, novos produtos, expansão..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 6),

  (uuid_generate_v4(), v_s16_id, v_form2_id,
   '{"pt": "Investimento Planejado para os Próximos 12 Meses"}'::jsonb,
   '{"pt": "0,00"}'::jsonb,
   '{"pt": "Valor que pretende investir no crescimento da empresa"}'::jsonb,
   'money', FALSE, NULL, 7);


-- -------------------------------------------------------
-- Section 17: Observacoes e Encaminhamentos
-- -------------------------------------------------------
INSERT INTO public.form_sections (id, template_id, title, description, display_order)
VALUES (
  v_s17_id, v_form2_id,
  '{"pt": "Observações e Encaminhamentos"}'::jsonb,
  '{"pt": "Informações complementares e pontos de atenção para a reunião."}'::jsonb,
  7
);

INSERT INTO public.form_fields (id, section_id, template_id, label, placeholder, helper_text, field_type, is_required, options, display_order)
VALUES
  (uuid_generate_v4(), v_s17_id, v_form2_id,
   '{"pt": "Principais dúvidas que deseja esclarecer na reunião"}'::jsonb,
   '{"pt": "Liste suas perguntas..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 1),

  (uuid_generate_v4(), v_s17_id, v_form2_id,
   '{"pt": "Houve mudança relevante no negócio desde a última reunião?"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Novos produtos, mudança de sócio, abertura de filial, etc."}'::jsonb,
   'toggle', FALSE, NULL, 2),

  (uuid_generate_v4(), v_s17_id, v_form2_id,
   '{"pt": "Descreva a mudança"}'::jsonb,
   '{"pt": "O que mudou na empresa?"}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 3),

  (uuid_generate_v4(), v_s17_id, v_form2_id,
   '{"pt": "Satisfação com a situação financeira atual da empresa"}'::jsonb,
   '{"pt": "Selecione"}'::jsonb,
   '{}'::jsonb,
   'radio', FALSE,
   '["Muito satisfeito", "Satisfeito", "Neutro", "Insatisfeito", "Muito insatisfeito"]'::jsonb,
   4),

  (uuid_generate_v4(), v_s17_id, v_form2_id,
   '{"pt": "Observações Gerais"}'::jsonb,
   '{"pt": "Qualquer informação adicional que julgue importante..."}'::jsonb,
   '{}'::jsonb,
   'textarea', FALSE, NULL, 5),

  (uuid_generate_v4(), v_s17_id, v_form2_id,
   '{"pt": "Autorizo o uso dos dados empresariais para fins de planejamento financeiro"}'::jsonb,
   '{}'::jsonb,
   '{"pt": "Os dados são tratados com total confidencialidade conforme nossa política de privacidade"}'::jsonb,
   'toggle', TRUE, NULL, 6);


END $$;
