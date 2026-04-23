import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Missing Supabase env vars' }, { status: 500 })
  }

  try {
    const { submissionId } = await request.json()

    if (!submissionId) {
      return json({ error: 'submissionId is required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      return json({ error: 'Submission not found' }, { status: 404 })
    }

    if (!submission.user_id) {
      return json({ skipped: true, reason: 'Submission has no owner user_id' })
    }

    const { data: settings, error: settingsError } = await supabase
      .from('app_settings')
      .select('webhook_url')
      .eq('user_id', submission.user_id)
      .single()

    if (settingsError || !settings?.webhook_url) {
      return json({ skipped: true, reason: 'No webhook configured' })
    }

    const webhookResponse = await fetch(settings.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'form.submission.created',
        timestamp: new Date().toISOString(),
        submission,
      }),
    })

    if (!webhookResponse.ok) {
      const body = await webhookResponse.text()
      return json(
        {
          error: 'Webhook request failed',
          status: webhookResponse.status,
          body,
        },
        { status: 502 }
      )
    }

    return json({ success: true })
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
})
