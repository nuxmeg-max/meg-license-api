// api/list.js — List semua nomor bot terdaftar
// GET /api/list?secret_token=xxx

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', msg: 'Method not allowed' })

  const { secret_token } = req.query

  if (!secret_token || secret_token !== process.env.SECRET_TOKEN)
    return res.status(401).json({ status: 'denied', msg: 'Token tidak valid!' })

  try {
    const existing = await kv_get('licensed_bots')
    const bots     = existing ? JSON.parse(existing) : []
    return res.status(200).json({ status: 'ok', total: bots.length, bots })
  } catch (e) {
    return res.status(500).json({ status: 'error', msg: e.message })
  }
}

async function kv_get(key) {
  const r = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
  })
  const j = await r.json()
  return j.result || null
      }
