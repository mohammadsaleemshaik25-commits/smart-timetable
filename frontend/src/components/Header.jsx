// Header.jsx - Top application header with mobile menu trigger & quick actions
import { IconMenu, IconSparkles } from './Icons';

export default function Header({
  activeTab,
  setActiveTab,
  setIsMobileOpen,
  onResetData
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', breadcrumb: 'System / Overview' };
      case 'create-schedule':
        return { title: 'Create Schedule', breadcrumb: 'Planning / Constraint Solver' };
      case 'participants':
        return { title: 'Participant & Availability Management', breadcrumb: 'Resources / Faculty & Staff' };
      case 'rooms':
        return { title: 'Room & Hall Management', breadcrumb: 'Resources / Venues & Capacity' };
      case 'timetable':
        return { title: 'Generated Timetable Schedule', breadcrumb: 'Output / Master Timetable' };
      default:
        return { title: 'Timetable Scheduler', breadcrumb: 'System' };
    }
  };

  const { title, breadcrumb } = getTabTitle();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <IconMenu size={22} />
        </button>

        <div className="header-breadcrumbs">
          <span className="breadcrumb-path">{breadcrumb}</span>
          <h1 className="header-page-title">{title}</h1>
        </div>
      </div>

      <div className="header-right">
        {/* API connection indicator */}
        <div className="api-badge" title="AI Backend Ready: Connects to /api/schedule">
          <span className="api-dot"></span>
          <span className="api-label">AI Backend: Ready for API</span>
        </div>

        {/* Reset to demo dataset */}
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={onResetData}
          title="Restore standard college faculty and room demo data"
        >
          Reset Demo Data
        </button>

        {/* Quick action to create schedule */}
        {activeTab !== 'create-schedule' && (
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => setActiveTab('create-schedule')}
          >
            <IconSparkles size={16} />
            <span>New Schedule</span>
          </button>
        )}
      </div>
    </header>
  );
}
