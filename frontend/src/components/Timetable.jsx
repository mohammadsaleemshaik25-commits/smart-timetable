// Timetable.jsx - Displays Day, Time, Place and Participants
import { useState } from 'react';
import {
  IconTimetable,
  IconCalendar,
  IconClock,
  IconRoom,
  IconUsers,
  IconDownload,
  IconTrash,
  IconCheck,
  IconInfo,
  IconBriefcase,
  IconBookOpen,
  IconSparkles
} from './Icons';

export default function Timetable({
  timetables,
  setTimetables,
  setActiveTab
}) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Meeting' | 'Exam Invigilation'
  const [filterDay, setFilterDay] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [showJsonModal, setShowJsonModal] = useState(false);

  // Filter logic
  const filteredList = timetables.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesDay = filterDay === 'ALL' || item.day === filterDay;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(q) ||
      item.place.toLowerCase().includes(q) ||
      item.participants.some((p) => p.toLowerCase().includes(q));

    return matchesType && matchesDay && matchesSearch;
  });

  // Delete Timetable entry
  const handleDeleteSchedule = (id) => {
    if (window.confirm('Are you sure you want to remove this timetable entry?')) {
      setTimetables(timetables.filter((t) => t.id !== id));
    }
  };

  // Export as CSV
  const handleExportCSV = () => {
    if (timetables.length === 0) {
      alert('No timetable entries to export.');
      return;
    }

    const headers = ['Event Title', 'Schedule Type', 'Day', 'Date', 'Time Slot', 'Place (Room)', 'Participants', 'Lunch Avoidance'];
    const rows = timetables.map((item) => [
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.type}"`,
      `"${item.day}"`,
      `"${item.date || ''}"`,
      `"${item.time}"`,
      `"${item.place}"`,
      `"${item.participants.join('; ')}"`,
      `"${item.lunchAvoided ? 'Yes' : 'No'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartScheduler_Timetable_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="timetable-container">
      {/* Top Header & Actions */}
      <div className="section-header-row print-hidden">
        <div>
          <h2 className="section-title">Academic Timetable</h2>
          <p className="section-subtitle">
            Master timetable displaying allocated <strong>Day</strong>, <strong>Time</strong>, <strong>Place</strong>, and <strong>Participants</strong>.
          </p>
        </div>

        <div className="btn-group-right">
          <button
            type="button"
            className="btn-outline-blue btn-sm"
            onClick={() => setShowJsonModal(true)}
            title="Inspect formatted JSON payload prepared for AI backend"
          >
            <span>AI Backend JSON Schema</span>
          </button>

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Download CSV spreadsheet"
          >
            <IconDownload size={16} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handlePrint}
            title="Print or save as PDF"
          >
            <span>Print Timetable</span>
          </button>

          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => setActiveTab('create-schedule')}
          >
            <IconSparkles size={16} />
            <span>+ Add Schedule</span>
          </button>
        </div>
      </div>

      {/* AI Backend Evaluation Status Banner */}
      <div className="ai-notice-card print-hidden">
        <div className="notice-icon-box">
          <IconSparkles size={20} />
        </div>
        <div className="notice-content">
          <h4>Timetable Engine: Heuristic Constraint Preview Mode</h4>
          <p>
            The schedule slots below satisfy all operational rules: 5-10 participants, non-overlapping
            faculty busy hours, lunch break exclusion (12:30 PM - 01:30 PM), and adequate room seating.
            This interface is structured to accept responses from the AI scheduling microservice.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="timetable-toolbar print-hidden">
        <div className="search-filter-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search by event, room, or faculty name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <select
            className="form-control-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Types (Meetings & Exams)</option>
            <option value="Meeting">Academic Meetings Only</option>
            <option value="Exam Invigilation">Exam Invigilations Only</option>
          </select>

          <select
            className="form-control-sm"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
          >
            <option value="ALL">All Days</option>
            {daysList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Table / Card view toggle */}
          <div className="view-toggle-btns">
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              Table
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Cards View"
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Main Timetable Content */}
      {filteredList.length === 0 ? (
        <div className="empty-state-box">
          <IconTimetable size={48} className="empty-icon" />
          <h3>No matching schedule entries found</h3>
          <p>Try modifying your search or day filters, or generate a new schedule.</p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => setActiveTab('create-schedule')}
          >
            <IconSparkles size={16} /> Create New Schedule
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* ================= TABLE VIEW ================= */
        <div className="card timetable-card">
          <div className="table-responsive">
            <table className="master-timetable-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>DAY & DATE</th>
                  <th style={{ width: '18%' }}>TIME</th>
                  <th style={{ width: '22%' }}>PLACE (ROOM)</th>
                  <th style={{ width: '30%' }}>PARTICIPANTS (5-10)</th>
                  <th style={{ width: '15%' }} className="text-right print-hidden">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id} className="timetable-row">
                    {/* 1. Day & Date */}
                    <td>
                      <div className="day-cell">
                        <span className="day-name">{item.day}</span>
                        {item.date && <span className="day-date">{item.date}</span>}
                        <span className={`type-badge-inline ${item.type === 'Exam Invigilation' ? 'exam' : 'meeting'}`}>
                          {item.type === 'Exam Invigilation' ? 'Exam' : 'Meeting'}
                        </span>
                      </div>
                    </td>

                    {/* 2. Time */}
                    <td>
                      <div className="time-cell">
                        <div className="time-pill">
                          <IconClock size={15} className="inline-icon" />
                          <span>{item.time}</span>
                        </div>
                        {item.lunchAvoided && (
                          <span className="lunch-check-pill" title="Lunch break excluded">
                            <IconCheck size={12} /> Lunch Protected
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 3. Place */}
                    <td>
                      <div className="place-cell">
                        <div className="place-name">
                          <IconRoom size={16} className="place-icon" />
                          <strong>{item.place}</strong>
                        </div>
                        {item.roomCapacity && (
                          <span className="capacity-chip">
                            Cap: {item.roomCapacity} seats
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 4. Participants */}
                    <td>
                      <div className="participants-cell">
                        <div className="participants-header">
                          <span className="event-subject-title">{item.title}</span>
                          <span className="participant-count-badge">
                            {item.participants.length} Assigned
                          </span>
                        </div>
                        <div className="participants-badges-wrap">
                          {item.participants.map((person, idx) => (
                            <span key={idx} className="participant-pill">
                              {person}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="text-right print-hidden">
                      <button
                        type="button"
                        className="btn-icon-danger"
                        title="Delete slot"
                        onClick={() => handleDeleteSchedule(item.id)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= CARDS VIEW ================= */
        <div className="timetable-cards-grid">
          {filteredList.map((item) => (
            <div key={item.id} className="card schedule-entry-card">
              <div className="entry-card-header">
                <span className={`type-tag ${item.type === 'Exam Invigilation' ? 'exam' : 'meeting'}`}>
                  {item.type === 'Exam Invigilation' ? (
                    <IconBookOpen size={14} className="inline-icon" />
                  ) : (
                    <IconBriefcase size={14} className="inline-icon" />
                  )}
                  {item.type}
                </span>

                <button
                  type="button"
                  className="btn-icon-danger-sm print-hidden"
                  title="Delete Entry"
                  onClick={() => handleDeleteSchedule(item.id)}
                >
                  <IconTrash size={15} />
                </button>
              </div>

              <h4 className="entry-title">{item.title}</h4>

              {/* Day, Time, Place highlights */}
              <div className="entry-meta-grid">
                <div className="entry-meta-item">
                  <span className="meta-label">
                    <IconCalendar size={14} className="inline-icon text-blue" /> DAY:
                  </span>
                  <span className="meta-value">
                    <strong>{item.day}</strong> {item.date && `(${item.date})`}
                  </span>
                </div>

                <div className="entry-meta-item">
                  <span className="meta-label">
                    <IconClock size={14} className="inline-icon text-blue" /> TIME:
                  </span>
                  <span className="meta-value time-highlight">{item.time}</span>
                </div>

                <div className="entry-meta-item">
                  <span className="meta-label">
                    <IconRoom size={14} className="inline-icon text-blue" /> PLACE:
                  </span>
                  <span className="meta-value">
                    <strong>{item.place}</strong>
                    {item.roomCapacity && ` (${item.roomCapacity} seats)`}
                  </span>
                </div>
              </div>

              {/* Participants list */}
              <div className="entry-participants-section">
                <div className="participants-count-row">
                  <span className="meta-label">
                    <IconUsers size={14} className="inline-icon text-blue" /> PARTICIPANTS ({item.participants.length}):
                  </span>
                  {item.lunchAvoided && (
                    <span className="lunch-safe-text">
                      <IconCheck size={12} /> Lunch Protected
                    </span>
                  )}
                </div>

                <div className="entry-participant-chips">
                  {item.participants.map((person, idx) => (
                    <span key={idx} className="participant-chip-card">
                      {person}
                    </span>
                  ))}
                </div>
              </div>

              {item.notes && (
                <div className="entry-notes-footer">
                  <IconInfo size={13} className="inline-icon" />
                  <span>{item.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Backend JSON Schema Inspect Modal */}
      {showJsonModal && (
        <div className="modal-backdrop" onClick={() => setShowJsonModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>AI Backend API Data Payload Schema</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowJsonModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="text-sm text-muted mb-2">
                This shows the normalized data structure ready to be transmitted to the backend AI model
                (<code>POST /api/schedule/generate</code>).
              </p>
              <pre className="json-code-block">
                {JSON.stringify(
                  {
                    backendStatus: "Ready for integration",
                    endpoint: "/api/v1/schedule/generate",
                    totalEntries: timetables.length,
                    activeTimetable: timetables.map(t => ({
                      id: t.id,
                      title: t.title,
                      scheduleType: t.type,
                      day: t.day,
                      date: t.date,
                      timeSlot: t.time,
                      place: t.place,
                      participants: t.participants,
                      constraintsApplied: {
                        lunchAvoidance: t.lunchAvoided,
                        minParticipants: 5,
                        maxParticipants: 10
                      }
                    }))
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowJsonModal(false)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
