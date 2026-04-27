
export const ActivityList = ({ logs }: { logs: any[] }) => {
  if (logs.length === 0) {
    return (
      <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2>Recent Activity</h2>
        <p className="text-secondary text-center">No workouts logged yet. Time to get moving!</p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h2>Recent Activity</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {logs.map((log) => (
          <div key={log.id} className="list-item">
            <div>
              <h3 className="mb-2" style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{log.activity}</h3>
              <p className="text-sm text-secondary">
                {log.duration} mins • {new Date(log.timestamp).toLocaleDateString()}
              </p>
              {log.notes && <p className="text-sm mt-4" style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>"{log.notes}"</p>}
            </div>
            <div>
              <span className={`badge ${log.intensity.toLowerCase()}`}>{log.intensity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
