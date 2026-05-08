import { MORE_MENU_ITEMS } from './moreData'

export default function MoreMenu({ isAdmin, onSelect }) {
  return (
    <div className="more-menu">
      {MORE_MENU_ITEMS(isAdmin).map(item => (
        <div key={item.id} className="more-item" onClick={() => onSelect(item.id)}>
          <div className="more-icon">{item.icon}</div>
          <h4>{item.label}</h4>
          <p>{item.sub}</p>
        </div>
      ))}
    </div>
  )
}
