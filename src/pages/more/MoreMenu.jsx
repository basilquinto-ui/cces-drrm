import { MORE_MENU_ITEMS } from './moreData'

export default function MoreMenu({ isAdmin, onSelect }) {
  return (
    <div className="more-menu">
      {MORE_MENU_ITEMS(isAdmin).map((item) => {
        const Icon = item.icon
        return (
          <div key={item.id} className="more-item" onClick={() => onSelect(item.id)}>
            <div className="more-icon"><Icon size={18} /></div>
            <h4>{item.label}</h4>
            <p>{item.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
