// Dashboard.jsx - Project overview, metrics, constraint pipeline & quick actions
import {
  IconUsers,
  IconRoom,
  IconTimetable,
  IconSparkles,
  IconCoffee,
  IconCheck,
  IconClock,
  IconInfo,
  IconBriefcase,
  IconBookOpen
} from './Icons';

export default function Dashboard({
  setActiveTab,
  participants,
  rooms,
  timetables
}) {
  // Compute key stats
  const totalBusySlots = participants.reduce(
    (acc, p) => acc + (p.busySlots ? p.busySlots.length : 0),
    0
  );

  const totalSeatCapacity = rooms.reduce(
    (acc, r) => acc + (Number(r.capacity) || 0),
    0
  );

  const examSchedules = timetables.filter((t) => t.type === 'Exam Invigilation');
  const meetingSchedules = timetables.filter((t) => t.type === 'Meeting');

  return (
    <div className="dashboard-container">
      {/* Hero Banner Section */}
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-badge">
            <IconSparkles size={16} />
            <span>College AI Project • Constraint Optimization</span>
          </div>
          <h2 className="hero-title">Smart Meeting and Exam Timetable Scheduler</h2>
          <p className="hero-description">
            An intelligent academic scheduling system engineered to optimize room allocation,
            prevent faculty slot collisions, respect individual busy schedules, and enforce campus
            rules such as lunch-hour avoidance for meetings and exam invigilations.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setActiveTab('create-schedule')}
            >
              <IconSparkles size={18} />
              <span>Create New Schedule</span>
            </button>

            <button
              type="button"
              className="btn-secondary light"
              onClick={() => setActiveTab('timetable')}
            >
              <IconTimetable size={18} />
              <span>View Master Timetable ({timetables.length})</span>
            </button>
          </div>
        </div>

        <div className="hero-stats-badge">
          <div className="badge-item">
            <span className="badge-value">100%</span>
            <span className="badge-label">Conflict Free Target</span>
          </div>
          <div className="badge-divider"></div>
          <div className="badge-item">
            <span className="badge-value">5-10</span>
            <span className="badge-label">Participants / Event</span>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="metrics-grid">
        <div className="metric-card" onClick={() => setActiveTab('timetable')}>
          <div className="metric-header">
            <span className="metric-label">Scheduled Events</span>
            <div className="metric-icon-box bg-blue">
              <IconTimetable size={20} />
            </div>
          </div>
          <div className="metric-number">{timetables.length}</div>
          <div className="metric-footer">
            <span className="tag-pill tag-exam">{examSchedules.length} Exams</span>
            <span className="tag-pill tag-meeting">{meetingSchedules.length} Meetings</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => setActiveTab('participants')}>
          <div className="metric-header">
            <span className="metric-label">Faculty & Invigilators</span>
            <div className="metric-icon-box bg-light-blue">
              <IconUsers size={20} />
            </div>
          </div>
          <div className="metric-number">{participants.length}</div>
          <div className="metric-footer">
            <span className="metric-subtext">
              <strong>{totalBusySlots}</strong> busy time constraints mapped
            </span>
          </div>
        </div>

        <div className="metric-card" onClick={() => setActiveTab('rooms')}>
          <div className="metric-header">
            <span className="metric-label">Halls & Rooms</span>
            <div className="metric-icon-box bg-navy">
              <IconRoom size={20} />
            </div>
          </div>
          <div className="metric-number">{rooms.length}</div>
          <div className="metric-footer">
            <span className="metric-subtext">
              <strong>{totalSeatCapacity}</strong> total seating capacity
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Lunch Break Protection</span>
            <div className="metric-icon-box bg-amber">
              <IconCoffee size={20} />
            </div>
          </div>
          <div className="metric-number">Active</div>
          <div className="metric-footer">
            <span className="metric-subtext text-emerald">
              <IconCheck size={14} className="inline-icon" /> 12:30 PM - 01:30 PM protected
            </span>
          </div>
        </div>
      </section>

      {/* AI Constraint Pipeline & Readiness Banner */}
      <section className="dashboard-row-split">
        {/* How the Constraint Scheduling Engine Works */}
        <div className="card pipeline-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">How the Timetable Constraint Engine Works</h3>
              <p className="card-subtitle">
                Constraint Satisfaction Problem (CSP) formulation for academic logistics
              </p>
            </div>
          </div>

          <div className="pipeline-steps">
            <div className="pipeline-step">
              <div className="step-circle">1</div>
              <div className="step-content">
                <h4>Schedule Parameters</h4>
                <p>Define schedule type (Meeting / Exam), date range, duration, and 5-10 participants.</p>
              </div>
            </div>

            <div className="pipeline-connector"></div>

            <div className="pipeline-step">
              <div className="step-circle">2</div>
              <div className="step-content">
                <h4>Hard Constraints Filter</h4>
                <p>Excludes participant busy slots, enforces lunch recess, and matches minimum room capacity.</p>
              </div>
            </div>

            <div className="pipeline-connector"></div>

            <div className="pipeline-step">
              <div className="step-circle">3</div>
              <div className="step-content">
                <h4>Heuristic Optimization</h4>
                <p>Allocates optimal time window and venue based on participant preferences and equipment.</p>
              </div>
            </div>

            <div className="pipeline-connector"></div>

            <div className="pipeline-step">
              <div className="step-circle">4</div>
              <div className="step-content">
                <h4>Timetable Generation</h4>
                <p>Outputs conflict-free schedule showing Day, Time, Place, and assigned Participants.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Backend API Integration Status Box */}
        <div className="card integration-card">
          <div className="card-header">
            <div className="integration-badge">
              <IconInfo size={18} />
              <span>Backend Architecture Ready</span>
            </div>
          </div>

          <div className="integration-body">
            <h4>Ready for Future AI Backend Connection</h4>
            <p>
              This frontend interface is structured to consume the upcoming AI scheduler API
              (e.g., Python FastAPI / Flask / OR-Tools backend).
            </p>

            <div className="code-preview-box">
              <div className="code-label">Future Target API Endpoint:</div>
              <code>POST /api/v1/schedule/generate</code>
            </div>

            <ul className="integration-checklist">
              <li>
                <IconCheck size={16} className="text-emerald" />
                <span>JSON Schema ready for participants & busy slots</span>
              </li>
              <li>
                <IconCheck size={16} className="text-emerald" />
                <span>Supports 5-10 participants constraint rule</span>
              </li>
              <li>
                <IconCheck size={16} className="text-emerald" />
                <span>Built-in browser heuristic fallback for live evaluation</span>
              </li>
            </ul>

            <button
              type="button"
              className="btn-outline-blue w-full"
              onClick={() => setActiveTab('create-schedule')}
            >
              Test Scheduler Interface &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Recent Timetables Quick Glance */}
      <section className="card recent-schedules-card">
        <div className="card-header space-between">
          <div>
            <h3 className="card-title">Recent Scheduled Sessions</h3>
            <p className="card-subtitle">
              Overview of generated meetings and exam invigilations
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => setActiveTab('timetable')}
          >
            View Full Timetable &rarr;
          </button>
        </div>

        {timetables.length === 0 ? (
          <div className="empty-state">
            <p>No schedules generated yet. Go to Create Schedule to generate one!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Type</th>
                  <th>Day & Date</th>
                  <th>Time Slot</th>
                  <th>Place / Room</th>
                  <th>Participants</th>
                  <th>Lunch Protected</th>
                </tr>
              </thead>
              <tbody>
                {timetables.slice(0, 4).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="event-title-cell">
                        <strong>{item.title}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-type ${item.type === 'Exam Invigilation' ? 'exam' : 'meeting'}`}>
                        {item.type === 'Exam Invigilation' ? (
                          <IconBookOpen size={13} className="inline-icon" />
                        ) : (
                          <IconBriefcase size={13} className="inline-icon" />
                        )}
                        {item.type}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium text-navy">{item.day}</span>
                      <span className="text-muted block text-xs">{item.date}</span>
                    </td>
                    <td>
                      <span className="time-badge">
                        <IconClock size={13} className="inline-icon" />
                        {item.time}
                      </span>
                    </td>
                    <td>
                      <span className="place-tag">{item.place}</span>
                    </td>
                    <td>
                      <div className="participants-chip-group">
                        <span className="participant-chip main">
                          {item.participants[0]}
                        </span>
                        {item.participants.length > 1 && (
                          <span className="participant-chip more" title={item.participants.slice(1).join(', ')}>
                            +{item.participants.length - 1} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {item.lunchAvoided ? (
                        <span className="lunch-avoided-badge" title="Guaranteed outside 12:30 PM - 01:30 PM">
                          <IconCheck size={13} /> Yes
                        </span>
                      ) : (
                        <span className="text-muted text-xs">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
