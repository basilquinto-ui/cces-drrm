export default function ResourceEditModal({ resource, onClose, onSave }) {
  if (!resource) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-handle" />
        <h2>✏️ Update: {resource.name}</h2>

        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input id="editQty" type="number" className="form-control" defaultValue={resource.quantity} />
        </div>

        <div className="form-group">
          <label className="form-label">Condition</label>
          <select id="editCond" className="form-control" defaultValue={resource.condition}>
            <option value="good">✅ Good</option>
            <option value="low">⚠️ Low</option>
            <option value="replace">❌ Replace</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input id="editLoc" className="form-control" defaultValue={resource.location} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={onSave}>💾 Save</button>
        </div>
      </div>
    </div>
  )
}
