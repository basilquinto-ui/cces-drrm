import { CAT_ICONS, CAT_ORDER } from './moreData'
import ResourceEditModal from './ResourceEditModal'

function getResourceIcon(name) {
  if (name.includes('First Aid')) return '🧰'
  if (name.includes('Extinguish')) return '🧯'
  if (name.includes('Flash')) return '🔦'
  if (name.includes('Water')) return '💧'
  if (name.includes('Food')) return '🍱'
  if (name.includes('Mega')) return '📢'
  if (name.includes('Rope')) return '🪢'
  if (name.includes('Bandage')) return '🩹'
  if (name.includes('Sand')) return '🪣'
  return '📦'
}

export default function ResourcesView({ resources, isAdmin, editRes, resourceForm, onEdit, onCloseEdit, onFormChange, onSaveEdit }) {
  const grouped = CAT_ORDER.reduce((acc, category) => {
    const items = resources.filter((resource) => resource.category === category)
    if (items.length > 0) acc[category] = items
    return acc
  }, {})

  return (
    <>
      <div className="section-title" style={{ marginBottom: 14 }}>📦 Resource Inventory</div>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="card">
          <div className="card-title">
            {CAT_ICONS[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>

          {items.map((resource) => (
            <div key={resource.id} className="resource-item">
              <div className="resource-icon">{getResourceIcon(resource.name)}</div>
              <div className="resource-info">
                <h4>{resource.name}</h4>
                <p>{resource.location} · Updated {resource.last_checked}</p>
              </div>
              <div className="resource-qty">
                <div
                  className="qty-num"
                  style={{ color: resource.condition === 'replace' ? 'var(--red)' : resource.condition === 'low' ? 'var(--yellow)' : 'var(--navy)' }}
                >
                  {resource.quantity}
                </div>
                <span className={`badge badge-${resource.condition}`}>{resource.condition}</span>
              </div>
              {isAdmin && (
                <button
                  className="btn-icon"
                  style={{ background: 'var(--blue-light)', color: '#3b82f6', marginLeft: 8 }}
                  onClick={() => onEdit(resource)}
                >
                  ✏️
                </button>
              )}
            </div>
          ))}
        </div>
      ))}

      <ResourceEditModal resource={editRes} form={resourceForm} onClose={onCloseEdit} onFormChange={onFormChange} onSave={onSaveEdit} />
    </>
  )
}
