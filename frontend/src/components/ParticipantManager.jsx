// ParticipantManager.jsx - Manage participant names and their busy time slots
import { useState } from 'react';
import {
  IconPlus,
  IconTrash,
  IconClock,
  IconCheck
} from './Icons';

export default function ParticipantManager({
  participants,
  setParticipants
}) {
  // New Participant Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Assistant Professor');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [email, setEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Busy Slot Form State (targeted per participant)
  const [activeSlotTargetId, setActiveSlotTargetId] = useState(null);
  const [busyDay, setBusyDay] = useState('Monday');
  const [busyStartTime, setBusyStartTime] = useState('10:00');
  const [busyEndTime, setBusyEndTime] = useState('12:00');
  const [busyReason, setBusyReason] = useState('Department Lecture');

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Add Participant Handler
  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newParticipant = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Faculty Member',
      department: department.trim() || 'Computer Science',
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      busySlots: []
    };

    setParticipants([newParticipant, ...participants]);
    setName('');
    setEmail('');
    setShowAddForm(false);
  };

  // Delete Participant Handler
  const handleDeleteParticipant = (id) => {
    if (participants.length <= 5) {
      alert('The scheduler requires a roster of at least 5 participants. Cannot delete below 5.');
      return;
    }
    setParticipants(participants.filter((p) => p.id !== id));
  };

  // Add Busy Slot to Participant
  const handleAddBusySlot = (participantId) => {
    if (!busyStartTime || !busyEndTime) return;

    const newSlot = {
      id: `b-${Date.now()}`,
      day: busyDay,
      startTime: busyStartTime,
      endTime: busyEndTime,
      reason: busyReason.trim() || 'Pre-scheduled Class'
    };

    setParticipants(
      participants.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            busySlots: [...(p.busySlots || []), newSlot]
          };
        }
        return p;
      })
    );

    setActiveSlotTargetId(null);
    setBusyReason('Department Lecture');
  };

  // Remove Busy Slot
  const handleRemoveBusySlot = (participantId, slotId) => {
    setParticipants(
      participants.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            busySlots: (p.busySlots || []).filter((s) => s.id !== slotId)
          };
        }
        return p;
      })
    );
  };

  // Filtered List
  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="participants-container">
      {/* Header & Controls */}
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Participant Management</h2>
          <p className="section-subtitle">
            Register faculty members, invigilators, and maintain their busy time slots for conflict-free scheduling.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <IconPlus size={18} />
          <span>{showAddForm ? 'Close Form' : 'Add New Participant'}</span>
        </button>
      </div>

      {/* Roster Guidelines Alert */}
      <div className="roster-info-card">
        <div className="roster-stat-item">
          <span className="roster-stat-num">{participants.length}</span>
          <span className="roster-stat-label">Total Participants</span>
        </div>
        <div className="roster-stat-divider"></div>
        <div className="roster-stat-item">
          <span className="roster-stat-num">
            {participants.reduce((acc, p) => acc + (p.busySlots ? p.busySlots.length : 0), 0)}
          </span>
          <span className="roster-stat-label">Active Busy Slots</span>
        </div>
        <div className="roster-guideline-note">
          <IconCheck size={16} className="text-emerald" />
          <span>Constraint Rule: Each generated schedule requires 5 to 10 participants.</span>
        </div>
      </div>

      {/* Add Participant Modal / Expandable Card */}
      {showAddForm && (
        <div className="card add-participant-card mb-4">
          <h3 className="card-title">Add New Participant</h3>
          <p className="card-subtitle">
            Enter full details. You can add busy time slots immediately after saving.
          </p>

          <form onSubmit={handleAddParticipant} className="participant-form mt-3">
            <div className="grid-3-col">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role / Designation *</label>
                <select
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Professor & HOD">Professor & HOD</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Senior Invigilator">Senior Invigilator</option>
                  <option value="Exam Superintendent">Exam Superintendent</option>
                  <option value="External Observer">External Observer</option>
                  <option value="Department Coordinator">Department Coordinator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Computer Science & Engg"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2-col mt-2">
              <div className="form-group">
                <label className="form-label">Institutional Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. r.kulkarni@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group flex-end">
                <div className="btn-group-right">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <IconPlus size={16} /> Save Participant
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search Input */}
      <div className="filter-search-box mb-3">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search participants by name, role, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Participants List */}
      <div className="participants-grid">
        {filteredParticipants.map((person) => {
          const isSlotFormOpen = activeSlotTargetId === person.id;
          const slots = person.busySlots || [];

          return (
            <div key={person.id} className="card participant-card">
              {/* Card Header */}
              <div className="participant-card-header">
                <div className="participant-avatar">
                  {person.name
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>

                <div className="participant-info">
                  <h4 className="participant-name">{person.name}</h4>
                  <div className="participant-meta-row">
                    <span className="role-tag">{person.role}</span>
                    <span className="dept-tag">{person.department}</span>
                  </div>
                  <span className="email-text">{person.email}</span>
                </div>

                <button
                  type="button"
                  className="btn-icon-danger"
                  title="Delete participant"
                  onClick={() => handleDeleteParticipant(person.id)}
                >
                  <IconTrash size={16} />
                </button>
              </div>

              {/* Busy Time Slots Section */}
              <div className="busy-slots-container">
                <div className="busy-slots-header">
                  <span className="busy-title">
                    <IconClock size={15} className="inline-icon" />
                    <span>Busy Time Slots ({slots.length})</span>
                  </span>

                  <button
                    type="button"
                    className="btn-text-blue btn-xs"
                    onClick={() =>
                      setActiveSlotTargetId(isSlotFormOpen ? null : person.id)
                    }
                  >
                    {isSlotFormOpen ? 'Cancel' : '+ Add Busy Slot'}
                  </button>
                </div>

                {/* Inline form to add busy slot */}
                {isSlotFormOpen && (
                  <div className="add-busy-slot-inline">
                    <div className="inline-form-grid">
                      <div>
                        <label className="text-xs text-muted block mb-1">Day</label>
                        <select
                          className="form-control-sm"
                          value={busyDay}
                          onChange={(e) => setBusyDay(e.target.value)}
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-muted block mb-1">From</label>
                        <input
                          type="time"
                          className="form-control-sm"
                          value={busyStartTime}
                          onChange={(e) => setBusyStartTime(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted block mb-1">To</label>
                        <input
                          type="time"
                          className="form-control-sm"
                          value={busyEndTime}
                          onChange={(e) => setBusyEndTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="text-xs text-muted block mb-1">Reason / Class</label>
                      <input
                        type="text"
                        className="form-control-sm"
                        placeholder="e.g. CS401 Lecture or Lab"
                        value={busyReason}
                        onChange={(e) => setBusyReason(e.target.value)}
                      />
                    </div>

                    <div className="mt-2 flex-end">
                      <button
                        type="button"
                        className="btn-primary btn-xs"
                        onClick={() => handleAddBusySlot(person.id)}
                      >
                        Save Busy Slot
                      </button>
                    </div>
                  </div>
                )}

                {/* Chips of busy slots */}
                {slots.length === 0 ? (
                  <p className="no-busy-note">No busy slots registered (Available anytime).</p>
                ) : (
                  <div className="busy-chips-list">
                    {slots.map((slot) => (
                      <div key={slot.id} className="busy-chip">
                        <div className="chip-content">
                          <span className="chip-day">{slot.day}</span>
                          <span className="chip-time">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className="chip-reason" title={slot.reason}>
                            • {slot.reason}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="chip-remove-btn"
                          title="Remove slot"
                          onClick={() => handleRemoveBusySlot(person.id, slot.id)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
