import { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { ProfileSetup } from './components/ProfileSetup';
import { ActivityLogForm } from './components/ActivityLogForm';
import { ActivityList } from './components/ActivityList';
import { RecommendationPanel } from './components/RecommendationPanel';
import { createProfile, getProfile, logWorkout, getLogs, getRecommendation } from './api';

function App() {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<string>('');
  const [loadingRec, setLoadingRec] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Attempt to load profile and logs on start
    getProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch(() => {
        console.log('No profile found - first visit.');
        setIsFirstVisit(true);
      });
    
    getLogs()
      .then(setLogs)
      .catch(() => console.log('Failed to fetch logs.'));
  }, []);

  const handleSaveProfile = async (data: any) => {
    try {
      const newProfile = await createProfile(data);
      setProfile(newProfile);
      // Fire tutorial only on first-ever profile save
      if (isFirstVisit) {
        setTimeout(() => setRunTutorial(true), 400);
        setIsFirstVisit(false);
      }
    } catch (error) {
      alert('Failed to save profile');
    }
  };

  const handleLogWorkout = async (data: any) => {
    try {
      await logWorkout(data);
      const updatedLogs = await getLogs();
      setLogs(updatedLogs);
    } catch (error) {
      alert('Failed to log workout');
    }
  };

  const handleGenerateRecommendation = async (apiKey: string) => {
    setLoadingRec(true);
    try {
      const res = await getRecommendation({ api_key: apiKey });
      setRecommendation(res.recommendation);
    } catch (error: any) {
      alert(error.message || 'Failed to generate recommendation');
    } finally {
      setLoadingRec(false);
    }
  };

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTutorial(false);
    }
  };

  const steps = [
    {
      target: '.profile-step',
      content: 'Welcome! Start by setting up your profile so the AI Coach knows your goals.',
      disableBeacon: true,
    },
    {
      target: '.log-step',
      content: 'Log your daily workouts here. Be consistent!',
    },
    {
      target: '.recommendation-card',
      content: 'Enter your Gemini API key here to get a fully personalized AI workout plan — complete with images!',
    }
  ];

  return (
    <div>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={runTutorial}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#3b82f6',
            textColor: '#0f172a',
          },
        }}
      />

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
