import { createClient } from 'npm:@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.10.1'

type EmailProvider = 'resend' | 'smtp' | 'none'

interface AppSettingsRow {
  user_id: string
  email_provider: EmailProvider | null
  resend_api_key: string | null
  resend_from_email: string | null
  smtp_host: string | null
  smtp_port: number | null
  smtp_user: string | null
  smtp_password: string | null
  smtp_from_email: string | null
  smtp_secure: boolean | null
  notification_email: string | null
}

interface SubmissionRow {
  id: string
  user_id: string | null
  template_title: string | null
  submitter_name: string | null
  submitter_email: string | null
  answers: Record<string, unknown> | null
  submitted_at: string
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

function formatAnswers(answers: Record<string, unknown> | null | undefined): string {
  if (!answers) return '<p>Nenhuma resposta encontrada.</p>'

  const items = Object.entries(answers).map(([key, value]) => {
    const normalized = Array.isArray(value) ? value.join(', ') : String(value ?? '')
    return `<tr><td style="padding:8px;border:1px solid #ddd;"><strong>${key}</strong></td><td style="padding:8px;border:1px solid #ddd;">${normalized}</td></tr>`
  })

  return `
    <table style="border-collapse:collapse;width:100%;">
      <thead>
        <tr>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Campo</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Valor</th>
        </tr>
      </thead>
      <tbody>${items.join('')}</tbody>
    </table>
  `
}

async function sendWithResend(settings: AppSettingsRow, to: string, subject: string, html: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.resend_api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: settings.resend_from_email,
      to: [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Resend error: ${body}`)
  }
}

async function sendWithSmtp(settings: AppSettingsRow, to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: settings.smtp_host ?? '',
    port: settings.smtp_port ?? 587,
    secure: settings.smtp_secure ?? false,
    auth: settings.smtp_user && settings.smtp_password
      ? {
          user: settings.smtp_user,
          pass: settings.smtp_password,
        }
      : undefined,
  })

  await transporter.sendMail({
    from: settings.smtp_from_email ?? settings.smtp_user ?? '',
    to,
    subject,
    html,
  })
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Missing Supabase env vars' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  try {
    const { submissionId } = await request.json()

    if (!submissionId) {
      return json({ error: 'submissionId is required' }, { status: 400 })
    }

    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .select('id, user_id, template_title, submitter_name, submitter_email, answers, submitted_at')
      .eq('id', submissionId)
      .single<SubmissionRow>()

    if (submissionError || !submission) {
      return json({ error: 'Submission not found' }, { status: 404 })
    }

    if (!submission.user_id) {
      return json({ skipped: true, reason: 'Submission has no owner user_id' })
    }

    const { data: settings, error: settingsError } = await supabase
      .from('app_settings')
      .select(`
        user_id,
        email_provider,
        resend_api_key,
        resend_from_email,
        smtp_host,
        smtp_port,
        smtp_user,
        smtp_password,
        smtp_from_email,
        smtp_secure,
        notification_email
      `)
      .eq('user_id', submission.user_id)
      .single<AppSettingsRow>()

    if (settingsError || !settings) {
      return json({ skipped: true, reason: 'App settings not found' })
    }

    const to = settings.notification_email || submission.submitter_email
    if (!to) {
      return json({ skipped: true, reason: 'No destination email configured' })
    }

    const provider = settings.email_provider ?? 'none'
    if (provider === 'none') {
      return json({ skipped: true, reason: 'Email provider disabled' })
    }

    const subject = `Nova submissao: ${submission.template_title ?? 'Formulario'}`
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
        <h1>Nova submissao recebida</h1>
        <p><strong>Formulario:</strong> ${submission.template_title ?? 'Formulario sem titulo'}</p>
        <p><strong>Nome:</strong> ${submission.submitter_name ?? 'Nao informado'}</p>
        <p><strong>Email:</strong> ${submission.submitter_email ?? 'Nao informado'}</p>
        <p><strong>Enviado em:</strong> ${submission.submitted_at}</p>
        <div style="margin-top:24px;">${formatAnswers(submission.answers)}</div>
      </div>
    `

    if (provider === 'resend') {
      if (!settings.resend_api_key || !settings.resend_from_email) {
        return json({ skipped: true, reason: 'Resend is selected but not fully configured' })
      }

      await sendWithResend(settings, to, subject, html)
      return json({ success: true, provider: 'resend' })
    }

    if (!settings.smtp_host || !settings.smtp_from_email) {
      return json({ skipped: true, reason: 'SMTP is selected but not fully configured' })
    }

    await sendWithSmtp(settings, to, subject, html)
    return json({ success: true, provider: 'smtp' })
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
})
