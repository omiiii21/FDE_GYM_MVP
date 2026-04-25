import React, { useState } from 'react';

export const ProfileSetup = ({ onSave, initialData }: any) => {
  const [name, setName] = useState(initialData?.name || '');
  const [age, setAge] = useState(initialData?.age || '');
  const [goal, setGoal] = useState(initialData?.goal || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ name, age: parseInt(age), goal });
    setLoading(false);
  };

  return (
    <div className="card animate-fade-in">
      <h2>Profile Setup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="25" />
        </div>
        <div className="form-group">
          <label>Fitness Goal</label>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} required placeholder="Build muscle, lose weight, etc." />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};
