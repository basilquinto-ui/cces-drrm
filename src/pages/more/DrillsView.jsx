export default function DrillsView({ drills }) {
  return (
    <>
      <div className="section-title" style={{ marginBottom: 14 }}>📅 Drill History</div>
      <div className="card">
        {drills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <p>No drills recorded yet</p>
          </div>
        ) : (
          drills.map((drill) => {
            const date = new Date(drill.date)
            return (
              <div key={drill.id} className="drill-item">
                <div className="drill-date">
                  <div className="drill-dd">{date.getDate().toString().padStart(2, '0')}</div>
                  <div className="drill-mm">{date.toLocaleString('en', { month: 'short' }).toUpperCase()}</div>
                </div>
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700 }}>{drill.type}</h4>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {drill.duration_mins} mins · {drill.staff_present}/{drill.total_staff} staff · {drill.success ? '✅ Successful' : '⚠️ Issues noted'}
                  </p>
                  {drill.notes && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{drill.notes}</p>}
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
