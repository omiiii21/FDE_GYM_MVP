import React, { useState } from 'react';

export const ActivityLogForm = ({ onLog }: any) => {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLog({ activity, duration: parseInt(duration), intensity, notes });
    setActivity('');
    setDuration('');
    setIntensity('Medium');
    setNotes('');
    setLoading(false);
  };

  return (
    <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2>Log Workout</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Activity</label>
          <input value={activity} onChange={(e) => setActivity(e.target.value)} required placeholder="e.g. Running, Weightlifting" />
        </div>
        <div className="grid">
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required placeholder="45" />
          </div>
          <div className="form-group">
            <label>Intensity</label>
            <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Felt great today..." rows={2} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Log Workout'}
        </button>
      </form>
    </div>
  );
};
