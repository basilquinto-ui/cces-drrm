import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/Toast'

const statusConfig = {
  safe: { icon: '✅', label: 'Safe', cls: 'safe', btnColor: 'var(--green)' },
  medical: { icon: '🏥', label: 'Needs Medical', cls: 'medical', btnColor: 'var(--red)' },
  evacuation: { icon: '📍', label: 'At Evacuation', cls: 'evacuation', btnColor: '#3b82f6' },
}

export default function CheckIn({ isAdmin }) {
  const toast = useToast()
  const [staff, setStaff] = useState([])
  const [checkins, setCheckins] = useState({})
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const { data: staffData } = await supabase.from('staff').select('*').eq('active', true).order('name')
    const { data: checkinData } = await supabase.from('checkins').select('*').eq('date', today)
    if (staffData) setStaff(staffData)
    if (checkinData) {
      const map = {}
      checkinData.forEach(c => { map[c.staff_id] = c.status })
      setCheckins(map)
    }
    setLoading(false)
  }

  async function doCheckin(status) {
    if (!selected) return
    const { error } = await supabase.from('checkins').upsert({ staff_id: selected.id, date: today, status, checked_in_at: new Date().toISOString() }, { onConflict: 'staff_id,date' })
    if (!error) {
      setCheckins(c => ({ ...c, [selected.id]: status }))
      toast(`${selected.name} — ${statusConfig[status].label} ${statusConfig[status].icon}`, 'success')
    } else {
      toast('Check-in failed. Try again.', 'error')
    }
    setSelected(null)
  }

  async function resetCheckins() {
    await supabase.from('checkins').delete().eq('date', today)
    setCheckins({})
    toast('🔄 All check-ins reset.', 'success')
  }

  const checked = staff.filter(s => checkins[s.id])
  const safeCnt = staff.filter(s => checkins[s.id] === 'safe').length
  const medCnt = staff.filter(s => checkins[s.id] === 'medical').length
  const evacCnt = staff.filter(s => checkins[s.id] === 'evacuation').length
  const pct = staff.length ? Math.round((checked.length / staff.length) * 100) : 0

  return (
    <div className="fade-in">
      {/* Summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg,var(--navy),var(--navy-light))', color: 'white', marginBottom: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Check-in Status</div>
        <div style={{ fontSize: 28, fontWeight: 900, margin: '8px 0', fontFamily: 'Poppins,sans-serif' }}>{checked.length} / {staff.length} Staff</div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>{today} · {pct}% checked in</div>
      </div>

      {/* Counts */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['var(--green-light)', 'var(--green)', safeCnt, '✅ Safe'], ['var(--red-light)', 'var(--red)', medCnt, '🏥 Medical'], ['var(--blue-light)', '#3b82f6', evacCnt, '📍 Evacuation']].map(([bg, color, cnt, label]) => (
          <div key={label} style={{ flex: 1, background: bg, borderRadius: 10, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: 'Poppins,sans-serif' }}>{cnt}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <span className="section-title">Tap your name to check in</span>
        {isAdmin && <button className="btn btn-outline btn-sm" onClick={resetCheckins}>🔄 Reset</button>}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 10 }} />)}
        </div>
      ) : (
        <div className="checkin-grid">
          {staff.map(s => {
            const status = checkins[s.id]
            const cfg = statusConfig[status]
            const nameParts = s.name.replace('Mrs.', '').replace('Mr.', '').trim().split(' ')
            const lastName = nameParts.at(-1)
            const firstName = nameParts[0]
            return (
              <div key={s.id} className={`checkin-item ${cfg?.cls || ''}`} onClick={() => setSelected(s)}>
                <div className="checkin-status">{cfg?.icon || '👤'}</div>
                <h4>{lastName}, {firstName}</h4>
                <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.role}</p>
                <p style={{ fontSize: 10, fontWeight: 700, marginTop: 4, color: status ? 'inherit' : 'var(--text-muted)' }}>{cfg?.label || 'Not checked in'}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2>Check-in: {selected.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{selected.role} — Select your current status:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(statusConfig).map(([k, v]) => (
                <button key={k} className="btn" style={{ background: v.btnColor, color: 'white', fontSize: 15 }} onClick={() => doCheckin(k)}>
                  {v.icon} {v.label}
                </button>
              ))}
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
