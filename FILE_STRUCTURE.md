# ZenTask AI - File Structure

```
/
├── index.html                  # Main entry point with Tailwind CDN and Styles
├── index.tsx                   # React root entry
├── App.tsx                     # Main Application Controller
├── types.ts                    # TypeScript Interfaces (Task, Stats, etc.)
├── constants.ts                # App Constants (API URL, Mocks)
├── metadata.json               # Application metadata
├── README.md                   # Setup instructions
│
├── components/                 # UI Components
│   ├── TaskItem.tsx            # Individual Task Item
│   ├── ProgressBar.tsx         # Efficiency Visualization
│   ├── AiAssistant.tsx         # "Brainstorm Mode" Input
│   └── QuickAiActions.tsx      # Bottom AI Suggestion Chips
│
└── services/                   # Logic & API Layers
    ├── taskService.ts          # Handles LocalStorage & Backend API
    └── geminiService.ts        # Google Gemini AI Integration
```
