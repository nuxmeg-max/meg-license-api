// api/check.js — Cek apakah nomor bot terdaftar
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', msg: 'Method not allowed' })

  const { number, secret_token } = req.query
  if (!secret_token || secret_token !== process.env.SECRET_TOKEN)
    return res.status(401).json({ status: 'denied', licensed: false, msg: 'Token tidak valid!' })
  if (!number)
    return res.status(400).json({ status: 'error', licensed: false, msg: 'Parameter number wajib!' })

  const num = String(number).replace(/\D/g, '')
  try {
    const raw  = await kv_get('licensed_bots')
    const bots = parseKV(raw)
    const entry = bots.find(b => b.number === num)
    if (entry) {
      return res.status(200).json({ status: 'ok', licensed: true, number: num, addedAt: entry.addedAt })
    } else {
      return res.status(200).json({ status: 'ok', licensed: false, number: num })
    }
  } catch (e) {
    return res.status(500).json({ status: 'error', licensed: false, msg: e.message })
  }
}

function parseKV(raw) {
  if (!raw) return []
  if (typeof raw === 'object' && raw.value) raw = raw.value
  if (typeof raw === 'string') return JSON.parse(raw)
  if (Array.isArray(raw)) return raw
  return []
}

async function kv_get(key) {
  const r = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
  })
  const j = await r.json()
  return j.result || null
}
