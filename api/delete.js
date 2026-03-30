// api/delete.js — Hapus nomor bot
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'POST') return res.status(405).json({ status: 'error', msg: 'Method not allowed' })

  const { secret_token, number } = req.body || {}
  if (!secret_token || secret_token !== process.env.SECRET_TOKEN)
    return res.status(401).json({ status: 'denied', msg: 'Token tidak valid!' })
  if (!number)
    return res.status(400).json({ status: 'error', msg: 'Field number wajib!' })

  const num = String(number).replace(/\D/g, '')
  try {
    const raw     = await kv_get('licensed_bots')
    const bots    = parseKV(raw)
    const newBots = bots.filter(b => b.number !== num)
    if (newBots.length === bots.length)
      return res.status(404).json({ status: 'error', msg: `${num} tidak ditemukan!` })

    await kv_set('licensed_bots', JSON.stringify(newBots))
    return res.status(200).json({ status: 'ok', msg: `✅ ${num} berhasil dihapus!`, total: newBots.length })
  } catch (e) {
    return res.status(500).json({ status: 'error', msg: e.message })
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

async function kv_set(key, value) {
  await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  })
}
