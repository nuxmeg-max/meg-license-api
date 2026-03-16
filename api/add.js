// api/add.js — Tambah nomor bot ke database
// POST /api/add
// Body: { secret_token, number }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'POST') return res.status(405).json({ status: 'error', msg: 'Method not allowed' })

  const { secret_token, number } = req.body || {}

  // Validasi token
  if (!secret_token || secret_token !== process.env.SECRET_TOKEN)
    return res.status(401).json({ status: 'denied', msg: 'Token tidak valid!' })

  if (!number)
    return res.status(400).json({ status: 'error', msg: 'Field number wajib!' })

  const num = String(number).replace(/\D/g, '')
  if (!num)
    return res.status(400).json({ status: 'error', msg: 'Nomor tidak valid!' })

  try {
    // Baca data existing
    const existing = await kv_get('licensed_bots')
    const bots = existing ? JSON.parse(existing) : []

    // Cek duplikat
    if (bots.find(b => b.number === num))
      return res.status(409).json({ status: 'exists', msg: `${num} sudah terdaftar!` })

    // Tambah nomor baru
    bots.push({ number: num, addedAt: new Date().toISOString() })
    await kv_set('licensed_bots', JSON.stringify(bots))

    return res.status(200).json({ status: 'ok', msg: `✅ ${num} berhasil ditambahkan!`, total: bots.length })
  } catch (e) {
    return res.status(500).json({ status: 'error', msg: e.message })
  }
}

// ─── Vercel KV helpers ─────────────────────────────────────────────────────
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
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value })
  })
      }

