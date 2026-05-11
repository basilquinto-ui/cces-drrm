import { CONTACT_SECTIONS } from './moreData'

export default function ContactsView() {
  return (
    <>
      <div className="section-title" style={{ marginBottom: 14 }}>Emergency Contacts</div>
      {CONTACT_SECTIONS.map(section => (
        <div key={section.title} className="card">
          <div className="card-title">{section.title}</div>
          {section.items.map(c => (
            <div key={c.name} className="contact-item">
              <div className="contact-icon" style={{ background: c.bg }}>{c.icon}</div>
              <div className="contact-info"><h4>{c.name}</h4><p>{c.sub}</p></div>
              <a href={`tel:${c.tel}`}><button className="call-btn">{c.tel === '911' || c.tel === '117' ? c.tel : 'Call'}</button></a>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
