// RoomManager.jsx - Manage rooms, halls, capacity & preferences
import { useState } from 'react';
import {
  IconPlus,
  IconTrash,
  IconCheck,
  IconUsers
} from './Icons';

export default function RoomManager({
  rooms,
  setRooms
}) {
  // New Room Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [capacity, setCapacity] = useState(60);
  const [roomType, setRoomType] = useState('Exam Hall');
  const [selectedPreferences, setSelectedPreferences] = useState([
    'Air Conditioned',
    'Projector & AV'
  ]);

  // Available room preference tags
  const PREFERENCE_OPTIONS = [
    'Air Conditioned',
    'Projector & AV',
    'CCTV Surveillance',
    'Tiered Seating',
    'High Capacity',
    'Exam Seating',
    'Video Conferencing',
    'LAN & Power Backup',
    'Sound System',
    'Whiteboard'
  ];

  const handleTogglePreference = (pref) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    const newRoom = {
      id: `r-${Date.now()}`,
      name: roomName.trim(),
      capacity: Number(capacity) || 30,
      type: roomType,
      preferences: selectedPreferences,
      status: 'Available'
    };

    setRooms([newRoom, ...rooms]);
    setRoomName('');
    setCapacity(60);
    setSelectedPreferences(['Air Conditioned', 'Projector & AV']);
    setShowAddForm(false);
  };

  const handleDeleteRoom = (id) => {
    if (rooms.length <= 1) {
      alert('At least one room is required in the system.');
      return;
    }
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const totalCapacity = rooms.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
  const examHallsCount = rooms.filter((r) => r.type === 'Exam Hall' || r.capacity >= 60).length;

  return (
    <div className="rooms-container">
      {/* Header & Controls */}
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Room & Venue Management</h2>
          <p className="section-subtitle">
            Configure classrooms, exam auditoriums, seminar halls, capacity limits, and equipment preferences.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <IconPlus size={18} />
          <span>{showAddForm ? 'Close Form' : 'Add New Room'}</span>
        </button>
      </div>

      {/* Capacity Overview Bar */}
      <div className="room-summary-bar">
        <div className="summary-col">
          <span className="summary-val">{rooms.length}</span>
          <span className="summary-lbl">Total Venues</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-col">
          <span className="summary-val">{totalCapacity}</span>
          <span className="summary-lbl">Combined Seating Capacity</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-col">
          <span className="summary-val">{examHallsCount}</span>
          <span className="summary-lbl">High-Capacity Exam Halls</span>
        </div>
      </div>

      {/* Add Room Form */}
      {showAddForm && (
        <div className="card add-room-card mb-4">
          <h3 className="card-title">Register New Room / Venue</h3>
          <p className="card-subtitle">
            Provide venue name, seating capacity, and features used by the scheduler to match constraints.
          </p>

          <form onSubmit={handleAddRoom} className="room-form mt-3">
            <div className="grid-3-col">
              <div className="form-group">
                <label className="form-label">Room / Hall Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Auditorium Hall B"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Seating Capacity *</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  className="form-control"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Venue Category *</label>
                <select
                  className="form-control"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="Exam Hall">Exam Hall</option>
                  <option value="Seminar Room">Seminar Room</option>
                  <option value="Conference Room">Conference Room</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Lecture Hall">Lecture Hall</option>
                </select>
              </div>
            </div>

            {/* Room Preferences & Amenities */}
            <div className="form-group mt-3">
              <label className="form-label">Preferences & Equipment</label>
              <div className="preference-chips-selector">
                {PREFERENCE_OPTIONS.map((pref) => {
                  const isChecked = selectedPreferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      className={`pref-toggle-chip ${isChecked ? 'active' : ''}`}
                      onClick={() => handleTogglePreference(pref)}
                    >
                      {isChecked && <IconCheck size={14} className="inline-icon" />}
                      <span>{pref}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group flex-end mt-4">
              <div className="btn-group-right">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <IconPlus size={16} /> Save Room
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Rooms Cards Grid */}
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className="card room-card">
            <div className="room-card-top">
              <div className="room-type-tag">{room.type}</div>
              <button
                type="button"
                className="btn-icon-danger"
                title="Delete Room"
                onClick={() => handleDeleteRoom(room.id)}
              >
                <IconTrash size={16} />
              </button>
            </div>

            <h3 className="room-name">{room.name}</h3>

            <div className="room-capacity-meter">
              <div className="capacity-label-row">
                <span className="text-xs text-muted">
                  <IconUsers size={14} className="inline-icon" /> Seating Capacity
                </span>
                <span className="capacity-value">{room.capacity} seats</span>
              </div>
              <div className="capacity-bar-track">
                <div
                  className="capacity-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(15, (room.capacity / 150) * 100))}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="room-preferences-section">
              <span className="pref-heading">Preferences / Features:</span>
              <div className="pref-tags-list">
                {room.preferences && room.preferences.length > 0 ? (
                  room.preferences.map((p, idx) => (
                    <span key={idx} className="pref-badge">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">Standard Classroom</span>
                )}
              </div>
            </div>

            <div className="room-card-footer">
              <span className="room-status-badge available">
                <span className="status-dot-sm"></span> Available for Scheduling
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
