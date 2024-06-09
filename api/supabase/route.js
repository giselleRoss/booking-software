import { formatISO } from 'date-fns'
import { createClient } from '@/utils/supabase/server'

const supabase = createClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { days } = req.body

    if (!Array.isArray(days)) {
      return res.status(400).json({ error: 'Invalid input' })
    }

    const updates = days.map(async (day) => {
      const { id, openTime, closeTime } = day
      const { data, error } = await supabase
        .from('days')
        .update({ open_time: openTime, close_time: closeTime })
        .eq('id', id)

      if (error) throw error
      return data
    })

    try {
      const results = await Promise.all(updates)
      res.status(200).json(results)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { date } = req.body

    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }

    const { error } = await supabase
      .from('closed_days')
      .insert({ date })

    if (error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json({ success: true })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { date } = req.body

    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }

    const { error } = await supabase
      .from('closed_days')
      .delete()
      .eq('date', date)

    if (error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json({ success: true })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('closed_days')
      .select('date')

    if (error) {
      res.status(500).json({ error: error.message })
    } else {
      const closedDays = data.map(d => formatISO(new Date(d.date)))
      res.status(200).json(closedDays)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

