export default function ResourceEditModal({ resource, form, onClose, onFormChange, onSave }) {
  if (!resource) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-handle" />
        <h2>Update: {resource.name}</h2>

        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input type="number" className="form-control" value={form.quantity} onChange={(event) => onFormChange((prev) => ({ ...prev, quantity: event.target.value }))} />
        </div>

        <div className="form-group">
          <label className="form-label">Condition</label>
          <select className="form-control" value={form.condition} onChange={(event) => onFormChange((prev) => ({ ...prev, condition: event.target.value }))}>
            <option value="good">Good</option>
            <option value="low">Low</option>
            <option value="replace">Replace</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-control" value={form.location} onChange={(event) => onFormChange((prev) => ({ ...prev, location: event.target.value }))} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
