import { useEffect, useState } from 'react'

export default function ResourceEditModal({ resource, onClose, onSave }) {
  const [form, setForm] = useState({ quantity: 0, condition: 'good', location: '' })

  useEffect(() => {
    if (resource) {
      setForm({
        quantity: resource.quantity,
        condition: resource.condition,
        location: resource.location,
      })
    }
  }, [resource])

  if (!resource) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-handle" />
        <h2>✏️ Update: {resource.name}</h2>

        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            value={form.quantity}
            onChange={(event) => setForm((v) => ({ ...v, quantity: Number(event.target.value) }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Condition</label>
          <select
            className="form-control"
            value={form.condition}
            onChange={(event) => setForm((v) => ({ ...v, condition: event.target.value }))}
          >
            <option value="good">✅ Good</option>
            <option value="low">⚠️ Low</option>
            <option value="replace">❌ Replace</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            className="form-control"
            value={form.location}
            onChange={(event) => setForm((v) => ({ ...v, location: event.target.value }))}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => onSave(form)}>💾 Save</button>
        </div>
      </div>
    </div>
  )
}
