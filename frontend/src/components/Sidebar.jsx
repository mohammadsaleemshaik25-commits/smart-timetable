// Sidebar.jsx - Navigation sidebar with navy blue theme & clean icons
import {
  IconDashboard,
  IconCalendar,
  IconUsers,
  IconRoom,
  IconTimetable,
  IconSparkles,
  IconClose
} from './Icons';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  participantCount,
  roomCount,
  timetableCount
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <IconDashboard size={19} />,
      badge: null
    },
    {
      id: 'create-schedule',
      label: 'Create Schedule',
      icon: <IconCalendar size={19} />,
      badge: 'New'
    },
    {
      id: 'participants',
      label: 'Participants',
      icon: <IconUsers size={19} />,
      badge: participantCount
    },
    {
      id: 'rooms',
      label: 'Rooms',
      icon: <IconRoom size={19} />,
      badge: roomCount
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: <IconTimetable size={19} />,
      badge: timetableCount
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Brand header */}
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <IconSparkles size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">SmartScheduler</span>
            <span className="brand-subtitle">Meeting & Exam AI</span>
          </div>
          <button
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">MAIN NAVIGATION</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge !== null && (
                      <span className={`nav-badge ${isActive ? 'active-badge' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* AI Integration readiness footer */}
        <div className="sidebar-footer">
          <div className="ai-status-card">
            <div className="ai-status-indicator">
              <span className="status-dot pulse"></span>
              <span className="status-label">AI Engine Status</span>
            </div>
            <p className="ai-status-text">Ready for API Integration</p>
            <div className="ai-status-sub">CSP Heuristics Active</div>
          </div>
          <div className="college-meta">
            <span>College AI Project • 2026</span>
          </div>
        </div>
      </aside>
    </>
  );
}
