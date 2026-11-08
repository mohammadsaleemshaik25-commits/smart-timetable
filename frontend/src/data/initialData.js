// initialData.js - Pre-populated sample data for College AI Project demonstration
// Meets requirements: 5 to 10 participants, rooms with capacity & preferences, and existing timetable entries

export const INITIAL_PARTICIPANTS = [
  {
    id: "p1",
    name: "Dr. Arvind Sharma",
    role: "Professor & HOD",
    department: "Computer Science & Engineering",
    email: "arvind.sharma@college.edu",
    busySlots: [
      { id: "b1", day: "Monday", startTime: "09:00", endTime: "11:00", reason: "CS401 Distributed Systems Lecture" },
      { id: "b2", day: "Wednesday", startTime: "14:00", endTime: "16:00", reason: "HOD Council Meeting" }
    ]
  },
  {
    id: "p2",
    name: "Prof. Priya Nair",
    role: "Associate Professor",
    department: "Computer Science & Engineering",
    email: "priya.nair@college.edu",
    busySlots: [
      { id: "b3", day: "Tuesday", startTime: "10:00", endTime: "12:00", reason: "Machine Learning Lab Batch A" },
      { id: "b4", day: "Thursday", startTime: "14:00", endTime: "15:30", reason: "AI Project Mentorship" }
    ]
  },
  {
    id: "p3",
    name: "Dr. Rajesh Kulkarni",
    role: "Assistant Professor",
    department: "Information Technology",
    email: "rajesh.k@college.edu",
    busySlots: [
      { id: "b5", day: "Monday", startTime: "11:00", endTime: "13:00", reason: "Data Structures Practical" },
      { id: "b6", day: "Friday", startTime: "09:30", endTime: "11:30", reason: "Faculty Seminar" }
    ]
  },
  {
    id: "p4",
    name: "Prof. Sneha Deshmukh",
    role: "Assistant Professor",
    department: "Computer Science & Engineering",
    email: "sneha.d@college.edu",
    busySlots: [
      { id: "b7", day: "Wednesday", startTime: "10:00", endTime: "12:00", reason: "Database Systems Lecture" },
      { id: "b8", day: "Thursday", startTime: "11:00", endTime: "12:30", reason: "Curriculum Revision" }
    ]
  },
  {
    id: "p5",
    name: "Dr. Vikrant Mehta",
    role: "Senior Invigilator / Associate Prof",
    department: "Mathematics & Computing",
    email: "v.mehta@college.edu",
    busySlots: [
      { id: "b9", day: "Tuesday", startTime: "14:00", endTime: "16:00", reason: "Discrete Math Lecture" }
    ]
  },
  {
    id: "p6",
    name: "Prof. Ananya Roy",
    role: "Invigilator / Assistant Prof",
    department: "Computer Science & Engineering",
    email: "ananya.roy@college.edu",
    busySlots: [
      { id: "b10", day: "Monday", startTime: "14:00", endTime: "16:00", reason: "Software Engineering Tutorial" }
    ]
  },
  {
    id: "p7",
    name: "Dr. Manoj Verma",
    role: "Chief Exam Superintendent",
    department: "Academic Affairs",
    email: "manoj.verma@college.edu",
    busySlots: [
      { id: "b11", day: "Friday", startTime: "14:00", endTime: "16:30", reason: "Exam Committee Meeting" }
    ]
  }
];

export const INITIAL_ROOMS = [
  {
    id: "r1",
    name: "Auditorium & Exam Hall A",
    capacity: 120,
    type: "Exam Hall",
    preferences: ["Air Conditioned", "CCTV Surveillance", "Tiered Seating", "High Capacity"],
    status: "Available"
  },
  {
    id: "r2",
    name: "Smart Seminar Hall 201",
    capacity: 45,
    type: "Seminar Room",
    preferences: ["Projector & AV", "Video Conferencing", "Air Conditioned", "Sound System"],
    status: "Available"
  },
  {
    id: "r3",
    name: "Conference Room 102 (Dean's Block)",
    capacity: 20,
    type: "Conference Room",
    preferences: ["Round Table", "Projector & AV", "Air Conditioned"],
    status: "Available"
  },
  {
    id: "r4",
    name: "Central Computing Lab 3",
    capacity: 60,
    type: "Computer Lab",
    preferences: ["60 Workstations", "Projector & AV", "LAN & Power Backup"],
    status: "Available"
  },
  {
    id: "r5",
    name: "Lecture Hall 405",
    capacity: 75,
    type: "Lecture Hall",
    preferences: ["Whiteboard", "Microphone System", "Exam Seating"],
    status: "Available"
  }
];

export const INITIAL_TIMETABLES = [
  {
    id: "sch-1",
    title: "Mid-Term Exam: AI & Soft Computing",
    type: "Exam Invigilation",
    day: "Monday",
    date: "2026-11-16",
    time: "10:00 AM - 01:00 PM",
    startTime: "10:00",
    endTime: "13:00",
    place: "Auditorium & Exam Hall A",
    roomCapacity: 120,
    participants: [
      "Dr. Arvind Sharma",
      "Prof. Priya Nair",
      "Dr. Vikrant Mehta",
      "Prof. Ananya Roy",
      "Dr. Manoj Verma"
    ],
    lunchAvoided: true,
    status: "Confirmed",
    notes: "External exam observer assigned. Hall capacity verified."
  },
  {
    id: "sch-2",
    title: "NBA Accreditation & Syllabus Review",
    type: "Meeting",
    day: "Tuesday",
    date: "2026-11-17",
    time: "02:00 PM - 03:30 PM",
    startTime: "14:00",
    endTime: "15:30",
    place: "Smart Seminar Hall 201",
    roomCapacity: 45,
    participants: [
      "Dr. Arvind Sharma",
      "Prof. Priya Nair",
      "Dr. Rajesh Kulkarni",
      "Prof. Sneha Deshmukh",
      "Prof. Ananya Roy",
      "Dr. Manoj Verma"
    ],
    lunchAvoided: true,
    status: "Confirmed",
    notes: "Requires Projector & AV setup. Lunch break 12:30 - 01:30 PM avoided."
  },
  {
    id: "sch-3",
    title: "Final Year Capstone Project Invigilation",
    type: "Exam Invigilation",
    day: "Wednesday",
    date: "2026-11-18",
    time: "09:30 AM - 12:30 PM",
    startTime: "09:30",
    endTime: "12:30",
    place: "Central Computing Lab 3",
    roomCapacity: 60,
    participants: [
      "Prof. Priya Nair",
      "Dr. Rajesh Kulkarni",
      "Prof. Sneha Deshmukh",
      "Dr. Vikrant Mehta",
      "Prof. Ananya Roy"
    ],
    lunchAvoided: true,
    status: "Confirmed",
    notes: "Practical exam in lab. Pre-lunch finish."
  }
];

