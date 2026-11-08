# Smart Meeting and Exam Timetable Scheduler - Frontend

A modern, responsive React + Vite web application developed for college AI project demonstrations and academic department scheduling.

## 🚀 Key Features

1. **Dashboard Overview**:
   - Hero banner with project scope and description.
   - Live metrics: Total schedules, participants, venue seating capacity, and lunch protection status.
   - Constraint Satisfaction Problem (CSP) 4-step pipeline explanation.
   - Recent timetable preview table.

2. **Navigation Sidebar**:
   - Clean navy blue theme with collapsible mobile drawer.
   - Navigation links: **Dashboard**, **Create Schedule**, **Participants**, **Rooms**, and **Timetable**.
   - Dynamic item count badges and AI Engine readiness status indicator.

3. **Create Schedule Form**:
   - **Schedule Type switcher**: Academic Meeting vs Exam Invigilation.
   - **Participants Constraint**: strictly enforced 5 to 10 participants with range slider and selection roster.
   - **Date Range & Duration**: 30m, 45m, 1h, 1.5h, 2h, 3h options.
   - **Preferred Time Window**: Morning, Afternoon, Evening, or Flexible.
   - **Lunch Avoidance Option**: Prominent toggle to strictly protect the 12:30 PM - 01:30 PM recess.
   - **Venue matching**: Auto-select or manual room preference.
   - **Generate Schedule Button**: Triggers constraint check and time allocation.

4. **Participant Management**:
   - Register faculty members, invigilators, and external examiners with name, role, department, and email.
   - Add and delete **busy time slots** (Day, Time, Reason) per participant.

5. **Room Management**:
   - Register rooms, lecture halls, and auditoriums with seating capacity and category.
   - Feature preferences: Air Conditioned, Projector & AV, CCTV Surveillance, Exam Seating, LAN, etc.

6. **Master Timetable View**:
   - Prominently displays **Day**, **Time**, **Place (Room)**, and **Participants (5 to 10)**.
   - Toggle between **Table View** and **Cards View**.
   - Filters by Schedule Type (Meeting / Exam) and Day of Week.
   - Quick Search across events, rooms, and faculty.
   - **Export Tools**: Print / PDF, Export to CSV, and AI Backend JSON Schema inspector.

## 🤖 AI Backend Integration Architecture

In accordance with college project phases:
- The frontend includes a fully functional browser-based CSP heuristic simulator in `src/services/schedulerService.js`.
- It is ready for future AI Backend microservice integration (e.g. Python OR-Tools, Minizinc, or Genetic Algorithm).
- To connect the backend:
  1. Set `USE_BACKEND_API = true` in `src/services/schedulerService.js` (or configure `VITE_AI_BACKEND_URL`).
  2. The service dispatches `POST /api/v1/schedule/generate` with full constraints payload.

## 💻 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Pure CSS (Modern CSS variables, no heavy external CSS libraries)
- **Icons**: Custom embedded SVG components (Zero external icon dependencies)
- **Storage**: Browser LocalStorage persistence with 1-click "Reset Demo Data" feature

## 🛠️ How to Run

1. Navigate to the frontend directory:
   ```bash
   cd smart-meeting-exam-scheduler/frontend
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run code quality checks:
   ```bash
   npm run lint
   ```
