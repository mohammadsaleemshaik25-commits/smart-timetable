// CreateSchedule.jsx - Form to configure and generate schedule
import { useState } from 'react';
import {
  IconSparkles,
  IconCoffee,
  IconCheck,
  IconAlert,
  IconBriefcase,
  IconBookOpen,
  IconInfo
} from './Icons';
import { generateSchedule } from '../services/schedulerService';

function getDefaultStartDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
}

function getDefaultEndDate() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toISOString().split('T')[0];
}

export default function CreateSchedule({
  participants,
  rooms,
  onScheduleGenerated,
  setActiveTab
}) {
  // Form State
  const [scheduleType, setScheduleType] = useState('Meeting'); // 'Meeting' or 'Exam Invigilation'
  const [title, setTitle] = useState('');
  const [participantCount, setParticipantCount] = useState(6);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState(() =>
    participants.slice(0, 6).map((p) => p.id)
  );
  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [endDate, setEndDate] = useState(getDefaultEndDate);
  const [duration, setDuration] = useState(60); // minutes
  const [preferredTime, setPreferredTime] = useState('morning'); // 'morning', 'afternoon', 'evening', 'anytime'
  const [avoidLunch, setAvoidLunch] = useState(true);
  const [preferredRoomId, setPreferredRoomId] = useState('');

  // Processing state
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message, details }
  const [generatedItem, setGeneratedItem] = useState(null);

  // Sync participant selection when participantCount changes
  const handleCountChange = (newCount) => {
    const count = Math.min(10, Math.max(5, parseInt(newCount, 10) || 5));
    setParticipantCount(count);

    // If current selections are less or more, adjust
    if (selectedParticipantIds.length < count) {
      const remaining = participants
        .filter((p) => !selectedParticipantIds.includes(p.id))
        .map((p) => p.id);
      setSelectedParticipantIds([
        ...selectedParticipantIds,
        ...remaining.slice(0, count - selectedParticipantIds.length)
      ]);
    } else if (selectedParticipantIds.length > count) {
      setSelectedParticipantIds(selectedParticipantIds.slice(0, count));
    }
  };

  const handleParticipantToggle = (id) => {
    if (selectedParticipantIds.includes(id)) {
      if (selectedParticipantIds.length <= 5) {
        setFeedback({
          type: 'error',
          message: 'Minimum 5 participants required per college scheduling guidelines.'
        });
        return;
      }
      const updated = selectedParticipantIds.filter((pId) => pId !== id);
      setSelectedParticipantIds(updated);
      setParticipantCount(updated.length);
    } else {
      if (selectedParticipantIds.length >= 10) {
        setFeedback({
          type: 'error',
          message: 'Maximum limit of 10 participants reached.'
        });
        return;
      }
      const updated = [...selectedParticipantIds, id];
      setSelectedParticipantIds(updated);
      setParticipantCount(updated.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setGeneratedItem(null);

    // Basic Validation
    if (!title.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please enter a meeting or exam title.'
      });
      return;
    }

    if (participantCount < 5 || participantCount > 10) {
      setFeedback({
        type: 'error',
        message: 'Number of participants must be between 5 and 10.'
      });
      return;
    }

    if (participants.length < 5) {
      setFeedback({
        type: 'error',
        message: 'Your participant roster currently has fewer than 5 members. Please add more participants in the Participants section.'
      });
      return;
    }

    try {
      setIsGenerating(true);

      const params = {
        title: title.trim(),
        type: scheduleType,
        participantCount,
        selectedParticipantIds,
        startDate,
        endDate,
        duration: Number(duration),
        preferredTime,
        avoidLunch,
        preferredRoomId: preferredRoomId || null
      };

      const result = await generateSchedule(params, participants, rooms);

      if (result.success && result.schedule) {
        setGeneratedItem(result.schedule);
        onScheduleGenerated(result.schedule);
        setFeedback({
          type: 'success',
          message: 'Timetable slot allocated successfully!',
          details: `Scheduled for ${result.schedule.day} (${result.schedule.time}) at ${result.schedule.place}.`
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to generate schedule slot.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick preset loader for demo
  const loadQuickPreset = (type) => {
    if (type === 'exam') {
      setScheduleType('Exam Invigilation');
      setTitle('CS501 Artificial Intelligence Mid-Term Invigilation');
      setParticipantCount(6);
      setSelectedParticipantIds(participants.slice(0, 6).map((p) => p.id));
      setDuration(120);
      setPreferredTime('morning');
      setAvoidLunch(true);
      const examRoom = rooms.find((r) => r.type === 'Exam Hall');
      if (examRoom) setPreferredRoomId(examRoom.id);
    } else {
      setScheduleType('Meeting');
      setTitle('Departmental Curriculum Review & Faculty Board Meeting');
      setParticipantCount(5);
      setSelectedParticipantIds(participants.slice(0, 5).map((p) => p.id));
      setDuration(60);
      setPreferredTime('afternoon');
      setAvoidLunch(true);
      const confRoom = rooms.find((r) => r.type === 'Conference Room' || r.type === 'Seminar Room');
      if (confRoom) setPreferredRoomId(confRoom.id);
    }
  };

  return (
    <div className="create-schedule-container">
      {/* Top Banner / Presets */}
      <div className="form-header-bar">
        <div>
          <h2 className="section-title">Create Schedule</h2>
          <p className="section-subtitle">
            Configure constraint parameters for meetings or exam invigilations.
          </p>
        </div>
        <div className="preset-buttons">
          <span className="preset-label">Quick Fill Presets:</span>
          <button
            type="button"
            className="btn-outline-blue btn-xs"
            onClick={() => loadQuickPreset('meeting')}
          >
            <IconBriefcase size={14} className="inline-icon" /> Sample Meeting
          </button>
          <button
            type="button"
            className="btn-outline-blue btn-xs"
            onClick={() => loadQuickPreset('exam')}
          >
            <IconBookOpen size={14} className="inline-icon" /> Sample Exam Invigilation
          </button>
        </div>
      </div>

      {/* Backend API Integration Notice */}
      <div className="api-notice-banner">
        <IconInfo size={18} className="notice-icon" />
        <div className="notice-text">
          <strong>Ready for Future Backend API:</strong> This form collects all required
          parameters (participants, rooms, lunch avoidance, duration) and dispatches them to the
          heuristic CSP solver. When the AI backend endpoint is deployed, this connects seamlessly
          via <code>POST /api/schedule/generate</code>.
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`alert-box alert-${feedback.type}`}>
          <div className="alert-icon">
            {feedback.type === 'success' ? <IconCheck size={20} /> : <IconAlert size={20} />}
          </div>
          <div className="alert-content">
            <div className="alert-heading">{feedback.message}</div>
            {feedback.details && <p className="alert-details">{feedback.details}</p>}
          </div>
          {feedback.type === 'success' && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setActiveTab('timetable')}
            >
              View in Timetable &rarr;
            </button>
          )}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="schedule-form-layout">
        {/* Left Column: Core Parameters */}
        <div className="form-column">
          {/* Card 1: Schedule Type */}
          <div className="card form-card">
            <label className="form-section-heading">1. Schedule Type</label>
            <div className="schedule-type-toggle">
              <label
                className={`type-option ${scheduleType === 'Meeting' ? 'selected' : ''}`}
                onClick={() => setScheduleType('Meeting')}
              >
                <input
                  type="radio"
                  name="scheduleType"
                  value="Meeting"
                  checked={scheduleType === 'Meeting'}
                  onChange={() => setScheduleType('Meeting')}
                />
                <div className="type-icon-wrapper">
                  <IconBriefcase size={22} />
                </div>
                <div className="type-text">
                  <span className="type-title">Academic Meeting</span>
                  <span className="type-desc">Department councils, committee reviews, vivas</span>
                </div>
              </label>

              <label
                className={`type-option ${scheduleType === 'Exam Invigilation' ? 'selected' : ''}`}
                onClick={() => setScheduleType('Exam Invigilation')}
              >
                <input
                  type="radio"
                  name="scheduleType"
                  value="Exam Invigilation"
                  checked={scheduleType === 'Exam Invigilation'}
                  onChange={() => setScheduleType('Exam Invigilation')}
                />
                <div className="type-icon-wrapper">
                  <IconBookOpen size={22} />
                </div>
                <div className="type-text">
                  <span className="type-title">Exam Invigilation</span>
                  <span className="type-desc">Mid-term, final semester examinations, hall duties</span>
                </div>
              </label>
            </div>

            {/* Event Title */}
            <div className="form-group mt-4">
              <label htmlFor="schedule-title" className="form-label">
                {scheduleType === 'Exam Invigilation' ? 'Exam / Course Title *' : 'Meeting Title / Agenda *'}
              </label>
              <input
                id="schedule-title"
                type="text"
                className="form-control"
                placeholder={
                  scheduleType === 'Exam Invigilation'
                    ? 'e.g. CS601 Deep Learning End-Sem Exam Invigilation'
                    : 'e.g. Faculty Academic Committee & Accreditation Review'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Card 2: Date, Duration & Preferred Time */}
          <div className="card form-card">
            <label className="form-section-heading">2. Date & Time Preferences</label>

            <div className="grid-2-col">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date (Range)</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2-col mt-3">
              <div className="form-group">
                <label className="form-label">Duration *</label>
                <select
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>1 Hour (Standard Meeting)</option>
                  <option value={90}>1.5 Hours</option>
                  <option value={120}>2 Hours (Standard Exam)</option>
                  <option value={180}>3 Hours (Full Exam Session)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Time Window</label>
                <select
                  className="form-control"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                >
                  <option value="morning">Morning (09:00 AM - 12:30 PM)</option>
                  <option value="afternoon">Afternoon (01:30 PM - 05:00 PM)</option>
                  <option value="evening">Late Afternoon (04:30 PM - 07:30 PM)</option>
                  <option value="anytime">Flexible / Any Available Slot</option>
                </select>
              </div>
            </div>

            {/* Lunch Avoidance Option (Prominent requirement) */}
            <div className="lunch-avoidance-panel mt-4">
              <div className="lunch-toggle-row">
                <div className="lunch-icon-bubble">
                  <IconCoffee size={20} />
                </div>
                <div className="lunch-text">
                  <div className="lunch-title">Lunch Hour Avoidance Option</div>
                  <div className="lunch-desc">
                    Strictly prohibit scheduling sessions during the lunch recess (12:30 PM - 01:30 PM).
                  </div>
                </div>
                <label className="switch-toggle">
                  <input
                    type="checkbox"
                    checked={avoidLunch}
                    onChange={(e) => setAvoidLunch(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              {avoidLunch && (
                <div className="lunch-active-note">
                  <IconCheck size={14} className="inline-icon text-emerald" />
                  <span>Enabled: The scheduler guarantees free lunch time for all attendees.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Participants & Room Selection */}
        <div className="form-column">
          {/* Card 3: Number of Participants (5 to 10 constraint) */}
          <div className="card form-card">
            <div className="space-between align-center">
              <label className="form-section-heading">3. Participants (5 to 10)</label>
              <span className={`count-tag ${participantCount >= 5 && participantCount <= 10 ? 'valid' : 'invalid'}`}>
                {participantCount} Selected (Min 5, Max 10)
              </span>
            </div>

            <p className="form-helper-text">
              Specify the required number of participants for this session (enforced rule: 5 to 10 attendees).
            </p>

            {/* Slider & Quick Buttons */}
            <div className="participant-slider-box">
              <div className="slider-header">
                <span>Required Count: <strong>{participantCount} participants</strong></span>
                <span className="range-limits">Limit: 5 - 10</span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                step="1"
                value={participantCount}
                onChange={(e) => handleCountChange(e.target.value)}
                className="range-input"
              />
              <div className="slider-ticks">
                {[5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`tick-btn ${participantCount === num ? 'active' : ''}`}
                    onClick={() => handleCountChange(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Participant selector list */}
            <div className="participant-select-list mt-3">
              <div className="list-title">Assigned Roster Members:</div>
              <div className="roster-grid">
                {participants.map((person) => {
                  const isSelected = selectedParticipantIds.includes(person.id);
                  const busyCount = person.busySlots ? person.busySlots.length : 0;
                  return (
                    <div
                      key={person.id}
                      className={`roster-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleParticipantToggle(person.id)}
                    >
                      <div className="checkbox-custom">
                        {isSelected && <IconCheck size={14} />}
                      </div>
                      <div className="roster-details">
                        <span className="person-name">{person.name}</span>
                        <span className="person-meta">{person.role}</span>
                      </div>
                      {busyCount > 0 && (
                        <span className="busy-badge" title={`${busyCount} busy time slots recorded`}>
                          {busyCount} busy
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 4: Room Selection */}
          <div className="card form-card">
            <label className="form-section-heading">4. Room & Venue Preferences</label>

            <div className="form-group">
              <label className="form-label">Specific Room / Hall (Optional)</label>
              <select
                className="form-control"
                value={preferredRoomId}
                onChange={(e) => setPreferredRoomId(e.target.value)}
              >
                <option value="">-- Let AI Solver Pick Best Available Room --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (Cap: {room.capacity} seats • {room.type})
                  </option>
                ))}
              </select>
              <span className="form-helper-text">
                If unselected, the scheduler automatically allocates an appropriate room based on
                participant count and session type.
              </span>
            </div>
          </div>

          {/* Action Button: Generate Schedule */}
          <div className="generate-action-box">
            <button
              type="submit"
              className="btn-generate-large"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-dot"></span>
                  <span>Solving Constraints & Generating...</span>
                </>
              ) : (
                <>
                  <IconSparkles size={22} />
                  <span>Generate Schedule</span>
                </>
              )}
            </button>
            <div className="generate-meta-note">
              <span>Constraint checks applied: No faculty collision • Lunch protection • Room capacity</span>
            </div>
          </div>
        </div>
      </form>

      {/* Generated Result Card if available */}
      {generatedItem && (
        <div className="generated-preview-card mt-4">
          <div className="preview-header">
            <div className="preview-badge">
              <IconCheck size={16} />
              <span>Newly Generated Slot</span>
            </div>
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={() => setActiveTab('timetable')}
            >
              View in Master Timetable &rarr;
            </button>
          </div>

          <div className="preview-grid">
            <div className="preview-item">
              <span className="label">Event Title:</span>
              <strong className="value">{generatedItem.title}</strong>
            </div>
            <div className="preview-item">
              <span className="label">Day & Time:</span>
              <strong className="value text-navy">
                {generatedItem.day}, {generatedItem.time}
              </strong>
            </div>
            <div className="preview-item">
              <span className="label">Place / Venue:</span>
              <strong className="value">{generatedItem.place}</strong>
            </div>
            <div className="preview-item">
              <span className="label">Assigned Participants ({generatedItem.participants.length}):</span>
              <span className="value text-sm">{generatedItem.participants.join(', ')}</span>
            </div>
          </div>

          <div className="preview-footer-note">
            <IconInfo size={14} className="inline-icon" />
            <span>{generatedItem.notes}</span>
          </div>
        </div>
      )}
    </div>
  );
}
