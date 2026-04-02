# 🎓 Career-Copilot AI

> **Your complete AI-powered career platform** — from resume to offer letter.

Career-Copilot AI is a React single-page application that combines four intelligent tools to help job seekers analyze their resumes, match with roles, build skill roadmaps, and practice for interviews — all powered by the Google Gemini API.

---

## ✨ Features

### 📄 Resume Analyzer & Job Matcher
- **Resume Analysis** — Upload a PDF/DOC resume and extract skills, projects, achievements, certifications, and experience level using AI
- **Company Matching** — Automatically ranks 10+ companies (Google, Microsoft, TCS, Wipro, etc.) by match score based on your profile
- **ATS Job Match Chatbot** — Tell the AI which company and role you're targeting; receive an ATS score (0–100), eligibility verdict, skill gaps, and a hiring recommendation

### 🎯 Learning Path Generator
- Generates a personalized **8-week roadmap** tailored to your target company and role
- Each week includes:
  - **DSA Problems** — LeetCode problems progressing from Easy → Medium → Hard
  - **GitHub Project** — A real open-source–style project with tech stack and reference links
  - **Certification** — Recommended course from freeCodeCamp, Coursera, Google, AWS, or Microsoft
- Integrated redirect from Job Matcher when your ATS score falls below 95%

### 🎙️ AI Interview Agent
- Generates 7 company-specific interview questions (3 HR, 3 Technical, 1 Closing)
- **Text Mode** — Type answers at your own pace
- **Voice Mode** — Speak naturally using the Web Speech API; AI reads questions aloud
- After all questions, the AI evaluates each answer individually and returns an overall score, hire recommendation, strengths, and improvement areas

### 💬 Career Chatbot
- Floating chat assistant available across all pages
- Handles career strategy, resume advice, salary negotiation, interview tips, and platform navigation
- Maintains conversation history within the session

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Build Tool | Vite 8 |
| AI Provider | Google Gemini 2.5 Flash (`gemini-2.5-flash`) |
| Speech APIs | Web Speech API (SpeechSynthesis + SpeechRecognition) |
| Styling | Inline CSS with a centralized theme object |
| Linting | ESLint 9 with React Hooks & React Refresh plugins |

No external UI component libraries are used — all components are hand-built with inline styles.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A free **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/career-copilot-ai.git
cd career-copilot-ai/rtp-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser at `http://localhost:5173`.

### First-Time Setup

When the app loads, you will be prompted to enter your Gemini API key. The key is stored **only in the browser session** — it is never sent to any server other than Google's Gemini API.

---

## 📂 Project Structure

```
rtp-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx          # All application logic and components (single-file architecture)
│   ├── App.css          # Auxiliary styles
│   ├── index.css        # Global reset styles
│   └── main.jsx         # React root entry point
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

All feature components live inside `src/App.jsx`:

| Component | Purpose |
|---|---|
| `App` | Root component — API key gate, page routing, state coordination |
| `ApiKeySetup` | Landing screen for entering the Gemini API key |
| `Sidebar` | Fixed navigation sidebar |
| `Dashboard` | Overview page with feature cards and recommended workflow |
| `ResumeAnalyzer` | Resume analysis tab + ATS job match chatbot tab |
| `LearningPath` | 8-week roadmap generator with expandable week cards |
| `InterviewAgent` | Interview setup, live Q&A (text/voice), and results report |
| `FloatingChatbot` | Persistent FAB-based career assistant chat window |

---

## 🔧 Available Scripts

```bash
npm run dev       # Start development server (Vite HMR)
npm run build     # Production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

---

## 🌐 Gemini API Usage

All AI calls go directly from the browser to the Gemini REST API using the `gemini-2.5-flash` model. Three helper functions handle different call patterns:

| Helper | Use case |
|---|---|
| `geminiCall(prompt, key, b64?, mime?)` | Single-turn call, optionally with an inline file (resume) |
| `geminiChat(history, key)` | Multi-turn conversation with a message history array |
| `geminiWithResume(prompt, key, b64, mime)` | Single-turn call that attaches the resume as context |

Responses are expected as raw JSON strings (no markdown fences) for structured data, or plain text for chat messages.

---

## ⚙️ Configuration

No `.env` file is required. The Gemini API key is entered by the user at runtime and held in React state for the session.

To change the Gemini model, update the model name in the fetch URL inside each helper function in `src/App.jsx`:

```js
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`
```

---

## 🔒 Privacy & Security

- Your API key is never stored in `localStorage`, cookies, or any server — it lives only in React state for the duration of the browser session.
- Your uploaded resume is converted to Base64 in the browser and sent directly to the Gemini API. It is not stored anywhere.
- All AI responses are processed client-side.

---

## 📋 Browser Compatibility

| Feature | Requirement |
|---|---|
| Core app | Any modern browser (Chrome, Firefox, Edge, Safari) |
| Voice Mode (Interview Agent) | Chrome recommended — uses `webkitSpeechRecognition` |
| Text-to-Speech | Any browser with Web Speech API support |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. See the [LICENSE](LICENSE) file for details.

---

##  Acknowledgements

- [Google Gemini](https://ai.google.dev/) 
- [Vite](https://vitejs.dev/) — Lightning-fast build tooling
- [React](https://react.dev/) — UI framework
- [Google Fonts](https://fonts.google.com/) — Lora & Source Sans 3 typography
