# 🖤 Shadow System: Hunter's Task Manager

A fully offline-capable, Solo Leveling–inspired task management system designed to turn productivity into a game-like experience. Built with HTML, CSS, and JavaScript.

---

## 💡 What is it?

Inspired by the iconic "S-System" used by Sung Jin-Woo in Solo Leveling, this project transforms everyday task management into a stat-based questing system for self-growth.

---

## ⚙️ Features

### 🎯 Task Types
- **Regular** – Simple to-do items.
- **Time-Based** – Track time-based quests (e.g., study 2 hours).
- **Count-Based** – Tasks with numerical goals (e.g., read 5 chapters).
- **Countdown Tasks** – Timer-based challenges that auto-expire if not completed.

### 🔁 Progress Tracking
- Dynamic **progress bars** for time/count/countdown tasks.
- Shows percent completion and time remaining (for countdown).
- Displays overall progress at the top with real-time updates.

### 🧙 Hunter Profile System
- Customize your **Hunter Name** and **Guild Name**.
- **Auto-ranked** based on your current Level (E-Rank to S-Rank and beyond).
- Tracks:
  - Level
  - Strength
  - Agility
  - Intelligence
  - Completed Quests
  - Streaks

### 💥 Visual Effects
- 🎉 Confetti explosion on task completion or level-up.
- ⚠️ Countdown failure triggers **penalty effects** (level/stat reduction).

### 📒 Shadow Notes System
- Private note-taking modal (like a journal).
- Saves only when "Save Notes" is clicked.
- Warns before discarding unsaved changes.

### 💀 Secret System Unlocks
- Type `shadowmonarch` to reveal a hidden icon.
- `resetallshadowmonarch` to hard reset the entire system (with confirmation).
- Clicking the icon opens a **secret dungeon modal**.

### 📦 Selection Mode
- Long-press on tasks to enter multi-select mode.
- Perform bulk actions:
  - Delete selected
  - Mark as complete/incomplete

### 📶 Fully Offline Support
- All fonts, icons, and JS libraries are hosted locally.
- Works without internet once downloaded:
  - Orbitron font (UI text)
  - Font Awesome icons
  - Canvas Confetti and tsParticles JS libraries

---

## 📁 Folder Structure Overview

    project/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── profile.js
    └── assets/
    ├── js/
    │ ├── confetti.browser.min.js
    │ └── tsparticles.bundle.min.js
    ├── css/
    │ └── all.min.css
    ├── webfonts/
    │ └── fa-solid-900.woff2
    └── fonts/
    ├── orbitron-regular.woff2
    └── orbitron-bold.woff2

---

## 🔒 Local Storage Powered

All your data (tasks, profile, stats, notes) is saved in the browser using `localStorage`. Nothing is lost on refresh, and no internet or backend is required.

---

## 🏁 Start Your Journey

> Become your own Hunter. Set your quests. Level up. And rise — like the Shadow Monarch.


/* Add these styles */
.task-type-selector {
  margin-bottom: 20px;
}

.type-select {
  width: 100%;
  padding: 12px 16px;
  background: #222;
  border: 2px solid #333;
  border-radius: 10px;
  color: #ccc;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233399ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.type-select:focus {
  border-color: #3399ff;
  outline: none;
  box-shadow: 0 0 10px #3399ff44;
}

.type-select option {
  background: #111;
  color: #eee;
}