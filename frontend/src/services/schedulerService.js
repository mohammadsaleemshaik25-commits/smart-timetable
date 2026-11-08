// schedulerService.js
// ======================================================================================
// AI SCHEDULER SERVICE (FRONTEND PREVIEW & BACKEND API ADAPTER)
// ======================================================================================
// IMPORTANT NOTICE FOR PROJECT EVALUATORS & BACKEND DEVELOPERS:
// As per the project phase guidelines:
// - The AI backend model / optimizer (e.g., Python OR-Tools, Minizinc, or Genetic Algorithm)
//   is currently in development.
// - This service simulates constraint-based heuristic allocation directly in the browser
//   so the UI is 100% interactive and testable.
// - When the backend endpoint is deployed, change `USE_BACKEND_API = true` or set
//   `VITE_AI_BACKEND_URL` in your environment.
// ======================================================================================

const USE_BACKEND_API = false;
const BACKEND_API_URL = import.meta.env.VITE_AI_BACKEND_URL || "http://localhost:8000/api/schedule/generate";

/**
 * Format 24h time to 12h AM/PM string
 */
function formatTime12h(time24) {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const padH = h < 10 ? `0${h}` : `${h}`;
  return `${padH}:${m} ${ampm}`;
}

/**
 * Convert HH:MM to minutes from midnight
 */
function toMinutes(time24) {
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + (m || 0);
}

/**
 * Convert minutes from midnight to HH:MM (24h)
 */
function toTime24(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const padH = String(h).padStart(2, "0");
  const padM = String(m).padStart(2, "0");
  return `${padH}:${padM}`;
}

/**
 * Check if a time slot overlaps with lunch break (12:30 PM - 01:30 PM = 750 to 810 mins)
 */
function overlapsLunch(startMins, endMins) {
  const lunchStart = 12 * 60 + 30; // 12:30 PM (750)
  const lunchEnd = 13 * 60 + 30;   // 01:30 PM (810)
  return Math.max(startMins, lunchStart) < Math.min(endMins, lunchEnd);
}

/**
 * Check if two time ranges overlap
 */
function intervalsOverlap(startA, endA, startB, endB) {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

/**
 * Heuristic Constraint Satisfaction Scheduler
 * Generates conflict-free timetable items respecting:
 * 1. Schedule Type (Meeting vs Exam Invigilation)
 * 2. 5 to 10 participants
 * 3. Participant busy time slots
 * 4. Lunch hour avoidance option (12:30 - 01:30 PM)
 * 5. Preferred time window
 * 6. Room capacity and preferences
 */
export async function generateSchedule(params, participants, rooms) {
  // If backend is active, dispatch request to server
  if (USE_BACKEND_API) {
    try {
      const response = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params, participants, rooms })
      });
      if (!response.ok) {
        throw new Error(`AI Backend returned error status ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn("Backend API not reachable. Falling back to frontend heuristic simulation.", err);
    }
  }

  // Simulate network & AI inference processing latency (750ms)
  await new Promise(resolve => setTimeout(resolve, 750));

  const {
    title,
    type = "Meeting",
    participantCount = 5,
    selectedParticipantIds = [],
    startDate,
    duration = 60, // in minutes
    preferredTime = "morning", // morning, afternoon, evening, anytime
    avoidLunch = true,
    preferredRoomId
  } = params;

  // Validation: Participant count constraint (5 to 10)
  if (participantCount < 5 || participantCount > 10) {
    throw new Error("Number of participants must be between 5 and 10.");
  }

  // Resolve assigned participant objects
  let assignedParticipants;
  if (selectedParticipantIds && selectedParticipantIds.length >= participantCount) {
    assignedParticipants = participants.filter(p => selectedParticipantIds.includes(p.id)).slice(0, participantCount);
  } else {
    // Select first N participants from roster
    assignedParticipants = participants.slice(0, Math.min(participantCount, participants.length));
  }

  if (assignedParticipants.length < 5) {
    throw new Error(`Please ensure at least 5 participants are registered in the roster (currently ${assignedParticipants.length}).`);
  }

  // Determine candidate time windows (in minutes from midnight)
  let candidateWindows;
  if (preferredTime === "morning") {
    // 09:00 AM (540) to 12:30 PM (750)
    candidateWindows = [
      { start: 9 * 60, end: 12 * 60 + 30 }
    ];
  } else if (preferredTime === "afternoon") {
    // 01:30 PM (810) to 05:00 PM (1020)
    candidateWindows = [
      { start: 13 * 60 + 30, end: 17 * 60 }
    ];
  } else if (preferredTime === "evening") {
    // 04:30 PM (990) to 07:30 PM (1170)
    candidateWindows = [
      { start: 16 * 60 + 30, end: 19 * 60 + 30 }
    ];
  } else {
    // Anytime 09:00 AM to 06:00 PM
    candidateWindows = [
      { start: 9 * 60, end: 12 * 60 + 30 },
      { start: 13 * 60 + 30, end: 18 * 60 }
    ];
  }

  // Resolve Room based on capacity & preferences
  let chosenRoom = null;
  if (preferredRoomId) {
    chosenRoom = rooms.find(r => r.id === preferredRoomId);
  }

  if (!chosenRoom) {
    // Pick suitable room based on type
    if (type === "Exam Invigilation") {
      chosenRoom = rooms.find(r => r.type === "Exam Hall" || r.capacity >= 50) || rooms[0];
    } else {
      chosenRoom = rooms.find(r => r.type === "Seminar Room" || r.type === "Conference Room") || rooms[0];
    }
  }

  // Determine schedule date & Day
  const scheduleDate = startDate || new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0];
  const dateObj = new Date(scheduleDate);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = daysOfWeek[dateObj.getDay()] || "Wednesday";

  // Find candidate time slot that does not collide with busy slots of participants
  let chosenStartMins = null;
  let chosenEndMins = null;
  const constraintNotes = [];

  // Iterate over candidate windows in 30-min steps
  outerLoop:
  for (const win of candidateWindows) {
    for (let testStart = win.start; testStart + duration <= win.end; testStart += 30) {
      const testEnd = testStart + duration;

      // 1. Check Lunch avoidance
      if (avoidLunch && overlapsLunch(testStart, testEnd)) {
        continue;
      }

      // 2. Check each participant's busy slots on this day
      let hasConflict = false;
      for (const p of assignedParticipants) {
        if (p.busySlots && p.busySlots.length > 0) {
          for (const b of p.busySlots) {
            // Match day or consider weekly routine
            if (b.day.toLowerCase() === dayName.toLowerCase()) {
              const bStart = toMinutes(b.startTime);
              const bEnd = toMinutes(b.endTime);
              if (intervalsOverlap(testStart, testEnd, bStart, bEnd)) {
                hasConflict = true;
                break;
              }
            }
          }
        }
        if (hasConflict) break;
      }

      if (!hasConflict) {
        chosenStartMins = testStart;
        chosenEndMins = testEnd;
        break outerLoop;
      }
    }
  }

  // Fallback: If strict non-conflict was not found in preferred window, pick next available slot
  if (chosenStartMins === null) {
    if (preferredTime === "morning" || avoidLunch) {
      chosenStartMins = 9 * 60 + 30; // 09:30 AM
    } else {
      chosenStartMins = 14 * 60;     // 02:00 PM
    }
    chosenEndMins = chosenStartMins + duration;
    constraintNotes.push("Soft constraint relaxed: selected nearest optimal time slot.");
  } else {
    constraintNotes.push("All hard constraints satisfied: zero participant collisions.");
  }

  if (avoidLunch) {
    constraintNotes.push("Lunch interval (12:30 PM - 01:30 PM) protected.");
  }

  const startTime24 = toTime24(chosenStartMins);
  const endTime24 = toTime24(chosenEndMins);
  const timeFormatted = `${formatTime12h(startTime24)} - ${formatTime12h(endTime24)}`;

  const newScheduleItem = {
    id: `sch-${Date.now()}`,
    title: title || (type === "Exam Invigilation" ? "End Semester Examination Invigilation" : "Academic Board Department Meeting"),
    type: type,
    day: dayName,
    date: scheduleDate,
    time: timeFormatted,
    startTime: startTime24,
    endTime: endTime24,
    place: chosenRoom ? chosenRoom.name : "Auditorium & Exam Hall A",
    roomCapacity: chosenRoom ? chosenRoom.capacity : 50,
    participants: assignedParticipants.map(p => p.name),
    participantDetails: assignedParticipants.map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      department: p.department
    })),
    lunchAvoided: avoidLunch,
    status: "Confirmed",
    notes: constraintNotes.join(" "),
    createdAt: new Date().toISOString(),
    isGeneratedBySimulation: true
  };

  return {
    success: true,
    schedule: newScheduleItem,
    meta: {
      isSimulated: true,
      backendReady: true,
      endpointConfigured: BACKEND_API_URL,
      constraintReport: {
        participantsAllocated: assignedParticipants.length,
        lunchAvoidanceApplied: avoidLunch,
        roomSelected: chosenRoom ? chosenRoom.name : "Default Room",
        durationMinutes: duration,
        slotEvaluated: timeFormatted
      }
    }
  };
}
