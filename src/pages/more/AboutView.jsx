import logo from '../../assets/logo.png'

export default function AboutView() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
      <img src={logo} alt="CCES Logo" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--gold)', marginBottom: 16, objectFit: 'cover' }} />
      <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--navy)' }}>CCES DRRM Portal</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Camp Crame Elementary School</p>
      <div style={{ margin: '16px 0', padding: 16, background: 'var(--bg)', borderRadius: 12, fontSize: 12, color: 'var(--text-muted)', lineHeight: 2.2, textAlign: 'left' }}>
         Version 2.0.0<br /> Est. 1952 · QC District XVII<br />
         Castañeda St., Camp Crame, QC<br />
         (02) 7754-2648<br /> campcrame_es@yahoo.com.ph<br />
         Built with React + Supabase
      </div>
    </div>
  )
}
