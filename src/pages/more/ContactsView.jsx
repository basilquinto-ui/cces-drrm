import { CONTACT_SECTIONS } from './moreData'

export default function ContactsView() {
  return (
    <>
      <div className="section-title" style={{ marginBottom: 14 }}>Emergency Contacts</div>
      {CONTACT_SECTIONS.map((section) => (
        <div key={section.title} className="card">
          <div className="card-title">{section.title}</div>
          {section.items.map((contact) => {
            const Icon = contact.icon
            return (
              <div key={contact.name} className="contact-item">
                <div className="contact-icon" style={{ background: contact.bg }}><Icon size={16} /></div>
                <div className="contact-info"><h4>{contact.name}</h4><p>{contact.sub}</p></div>
                <a href={`tel:${contact.tel}`}><button className="call-btn">{contact.tel === '911' || contact.tel === '117' ? contact.tel : 'Call'}</button></a>
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}
