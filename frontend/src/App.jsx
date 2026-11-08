// App.jsx - Main Application entry point
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CreateSchedule from './components/CreateSchedule';
import ParticipantManager from './components/ParticipantManager';
import RoomManager from './components/RoomManager';
import Timetable from './components/Timetable';
import {
  INITIAL_PARTICIPANTS,
  INITIAL_ROOMS,
  INITIAL_TIMETABLES
} from './data/initialData';
import './App.css';

function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Core state: loaded from localStorage if available, or fallback to INITIAL_DATA
  const [participants, setParticipants] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_scheduler_participants');
      return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_scheduler_rooms');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [timetables, setTimetables] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_scheduler_timetables');
      return saved ? JSON.parse(saved) : INITIAL_TIMETABLES;
    } catch {
      return INITIAL_TIMETABLES;
    }
  });

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smart_scheduler_participants', JSON.stringify(participants));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [participants]);

  useEffect(() => {
    try {
      localStorage.setItem('smart_scheduler_rooms', JSON.stringify(rooms));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem('smart_scheduler_timetables', JSON.stringify(timetables));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [timetables]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Callback when a new schedule is created
  const handleScheduleGenerated = (newSchedule) => {
    setTimetables((prev) => [newSchedule, ...prev]);
    showToast(`Slot allocated: ${newSchedule.title} (${newSchedule.day}, ${newSchedule.time})`);
  };

  // Reset to sample initial data
  const handleResetData = () => {
    if (window.confirm('Reset all participants, rooms, and timetables to standard college demo data?')) {
      setParticipants(INITIAL_PARTICIPANTS);
      setRooms(INITIAL_ROOMS);
      setTimetables(INITIAL_TIMETABLES);
      showToast('Demo dataset successfully restored.');
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        participantCount={participants.length}
        roomCount={rooms.length}
        timetableCount={timetables.length}
      />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMobileOpen={setIsMobileOpen}
          onResetData={handleResetData}
          timetableCount={timetables.length}
        />

        <main className="app-content-body">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              participants={participants}
              rooms={rooms}
              timetables={timetables}
            />
          )}

          {activeTab === 'create-schedule' && (
            <CreateSchedule
              participants={participants}
              rooms={rooms}
              onScheduleGenerated={handleScheduleGenerated}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'participants' && (
            <ParticipantManager
              participants={participants}
              setParticipants={setParticipants}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomManager
              rooms={rooms}
              setRooms={setRooms}
            />
          )}

          {activeTab === 'timetable' && (
            <Timetable
              timetables={timetables}
              setTimetables={setTimetables}
              setActiveTab={setActiveTab}
            />
          )}
        </main>

        {/* Global Toast Notification */}
        {toast && (
          <div className={`global-toast toast-${toast.type}`}>
            <span className="toast-dot"></span>
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => setToast(null)}
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
