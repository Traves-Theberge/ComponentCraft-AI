# ComponentCraft AI: Your AI-Powered UI Component Generator

## Welcome to ComponentCraft AI!

ComponentCraft AI is a cutting-edge, browser-based tool designed to transform your natural language design prompts into beautiful, live-rendered, and responsive UI components. Inspired by a bold, minimalist aesthetic, ComponentCraft AI leverages the power of artificial intelligence to generate:

---

## 🔧 Frameworks & Libraries

| Layer          | Technology                                              |
| -------------- | ------------------------------------------------------- |
| Core Framework | `Next.js 15.3.3` (App Router, TypeScript)               |
| AI SDK         | `@ai-sdk/openai` (tool calling, streaming text)         |
| Image Gen      | `OpenAI DALL·E 3 API`                                   |
| Runtime        | `@webcontainer/api`                                     |
| State          | React Hooks, optional `zustand`                         |
| Editor         | `@monaco-editor/react` or `@codesandbox/sandpack-react` |
| UI             | Tailwind CSS (preferred)                                |
| Schema         | Adaptive Cards 1.5 JSON format                          |
| Linting        | ESLint inside WebContainer                              |
| Storage        | LocalStorage or Supabase (optional for templates)       |

---

## 📦 File & Folder Structure (Suggestion)

```
/app
  /generator
    page.tsx         # Main UI
/api
  /agent/route.ts    # Streamed AI agent handler
/lib
  /tools
    generateAdaptiveCard.ts
    generateCopy.ts
    generateImage.ts
    convertToReact.ts
  /utils
    webcontainer.ts  # Helper to boot, mount, and run code
/components
  LivePreview.tsx
  PromptInput.tsx
  HistoryPanel.tsx
  CodeEditor.tsx
```

---

## 🧰 Tool Definitions (Agent Functions)

### 🧱 `generateAdaptiveCard(prompt)`

* Description: Converts a prompt into an Adaptive Card layout schema (JSON).
* Inputs: `{ prompt: string }`
* Output: `{ card: AdaptiveCard }`

### ✍️ `generateCopy(prompt)`

* Description: Uses GPT-4 to write heading and paragraph text for the component.
* Inputs: `{ prompt: string }`
* Output: `{ heading: string, paragraph: string }`

### 🖼 `generateImage(prompt)`

* Description: Uses DALL·E 3 to generate and return a hosted image URL.
* Inputs: `{ prompt: string }`
* Output: `{ imageUrl: string }`

### 🔁 `convertToReact({ card, text, imageUrl })`

* Description: Converts layout + content + image into JSX React code.
* Inputs: Adaptive Card schema + image + text
* Output: `{ code: string }` (a JSX module)

---

## 🧠 Agent Setup (AI SDK)

Use `streamText()` with `tools` registered, and `maxSteps: 4`.

```ts
const result = await streamText({
  model: 'gpt-4',
  prompt: userPrompt,
  system: 'You are a UI code assistant that generates structured Adaptive Cards, copy, and images.',
  tools: {
    generateAdaptiveCard,
    generateCopy,
    generateImage,
    convertToReact,
  },
  maxSteps: 4,
});
```

---

## 🖼 WebContainer Integration

### Tasks:

* Boot a new container on demand
* Mount:

  * `package.json` with React, ReactDOM, Vite
  * `vite.config.js`
  * `src/GeneratedComponent.tsx` (from AI)
  * `src/main.tsx`
* Start dev server
* Pipe output to detect `localhost:5173` and load in iframe

```ts
const instance = await WebContainer.boot();
await instance.mount({ ... });
await instance.spawn('npm', ['install']);
await instance.spawn('npm', ['run', 'start']);
```

---


### Nice-to-Haves:

* [ ] Monaco or Sandpack JSX editor
* [ ] Prompt history (localStorage or Supabase)
* [ ] Save/load templates
* [ ] Export `.jsx` file
* [ ] GitHub deploy API or Codesandbox link
* [ ] ESLint check in container

---

