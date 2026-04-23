import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const MAX_SUBMISSIONS_PER_HOUR = 5

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
    const { ip, templateId } = await request.json()

    if (!ip) {
      return json({ error: 'ip is required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    let query = supabase
      .from('form_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('submitted_at', oneHourAgo)

    if (templateId) {
      query = query.eq('template_id', templateId)
    }

    const { count, error } = await query

    if (error) {
      throw error
    }

    const total = count ?? 0
    const allowed = total < MAX_SUBMISSIONS_PER_HOUR

    return json(
      {
        allowed,
        count: total,
        limit: MAX_SUBMISSIONS_PER_HOUR,
      },
      { status: allowed ? 200 : 429 }
    )
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
})
