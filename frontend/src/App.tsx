import { useState, useEffect } from 'react';
import { ProfileSetup } from './components/ProfileSetup';
import { ActivityLogForm } from './components/ActivityLogForm';
import { ActivityList } from './components/ActivityList';
import { RecommendationPanel } from './components/RecommendationPanel';
import { createProfile, getProfile, logWorkout, getLogs, getRecommendation } from './api';

const TOUR_STEPS = [
  {
    title: '👋 Welcome to Fitness AI!',
    content: 'This is your personal AI-powered fitness coach. Let\'s take a quick tour to get you started.',
  },
  {
    title: '👤 Your Profile',
    content: 'On the left, you\'ll find your profile. Keep your name, age, and fitness goal up to date — the AI uses this info to personalize your plan.',
  },
  {
    title: '🏋️ Log Workouts',
    content: 'Just below your profile, you can log every workout. Track the activity, duration, intensity, and any notes.',
  },
  {
    title: '🤖 AI Recommendations',
    content: 'On the right, paste your Gemini API key and hit "Get Recommendation" to receive a personalized workout plan — complete with images!',
  },
  {
    title: '✅ You\'re all set!',
    content: 'Start by filling in your profile on the left, then log a workout, and finally ask the AI for advice. Enjoy!',
  },
];

function TourModal({ step, total, onNext, onClose }: { step: number; total: number; onNext: () => void; onClose: () => void }) {
  const current = TOUR_STEPS[step];
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(59,130,246,0.4)',
        borderRadius: '16px', padding: '2rem',
        maxWidth: '440px', width: '90%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Step {step + 1} of {total}
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#64748b',
            cursor: 'pointer', fontSize: '1.25rem', padding: '0',
            lineHeight: 1, width: 'auto',
          }}>✕</button>
        </div>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{current.title}</h2>
        <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.5rem' }}>{current.content}</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexGrow: 1 }}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? '20px' : '6px', height: '6px',
                borderRadius: '3px',
                background: i === step ? '#3b82f6' : '#334155',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
          {step < total - 1 ? (
            <button onClick={onNext} style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>Next →</button>
          ) : (
            <button onClick={onClose} style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>Let's go! 🚀</button>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<string>('');
  const [loadingRec, setLoadingRec] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch(() => {
        // No profile = first visit, show tour after a short delay
        setTimeout(() => setShowTour(true), 600);
      });

    getLogs()
      .then(setLogs)
      .catch(() => console.log('Failed to fetch logs.'));
  }, []);

  const handleSaveProfile = async (data: any) => {
    try {
      const newProfile = await createProfile(data);
      setProfile(newProfile);
    } catch {
      alert('Failed to save profile');
    }
  };

  const handleLogWorkout = async (data: any) => {
    try {
      await logWorkout(data);
      const updatedLogs = await getLogs();
      setLogs(updatedLogs);
    } catch {
      alert('Failed to log workout');
    }
  };

  const handleGenerateRecommendation = async (apiKey: string) => {
    setLoadingRec(true);
    try {
      const res = await getRecommendation({ api_key: apiKey });
      setRecommendation(res.recommendation);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to generate recommendation';
      alert(msg);
    } finally {
      setLoadingRec(false);
    }
  };

  const handleTourNext = () => setTourStep((s) => s + 1);
  const handleTourClose = () => { setShowTour(false); setTourStep(0); };

  return (
    <div>
      {showTour && (
        <TourModal
          step={tourStep}
          total={TOUR_STEPS.length}
          onNext={handleTourNext}
          onClose={handleTourClose}
        />
      )}

      <h1>Fitness AI Assistant</h1>

      {!profile ? (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="profile-step">
            <ProfileSetup onSave={handleSaveProfile} />
          </div>
        </div>
      ) : (
        <div className="dashboard-layout">
          <div className="dashboard-sidebar">
            <div className="profile-step profile-card">
              <ProfileSetup onSave={handleSaveProfile} initialData={profile} />
            </div>
            <div className="log-step log-card">
              <ActivityLogForm onLog={handleLogWorkout} />
            </div>
          </div>
          <div className="dashboard-main">
            <div className="recommendation-card">
              <RecommendationPanel
                onGenerate={handleGenerateRecommendation}
                recommendation={recommendation}
                loading={loadingRec}
              />
            </div>
            <div className="activity-card">
              <ActivityList logs={logs} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
