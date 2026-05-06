import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;

try {
  createRoot(rootEl).render(<App />);
} catch (err) {
  // Last-resort fallback so users never see a fully blank page.
  // eslint-disable-next-line no-console
  console.error("[boot] App failed to mount:", err);
  rootEl.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:'JetBrains Mono',ui-monospace,monospace;background:hsl(40 38% 96%);color:hsl(215 45% 14%);">
      <div style="border:2px solid hsl(215 45% 14%);background:#fff;padding:2rem;max-width:520px;box-shadow:6px 6px 0 0 hsl(211 100% 38%);">
        <div style="font-family:'Archivo Black',sans-serif;text-transform:uppercase;font-size:1.5rem;line-height:1;margin-bottom:.75rem;">Something broke.</div>
        <p style="font-size:.85rem;line-height:1.5;margin:0 0 1rem;">Snacks remain legal tender. Try a hard refresh — if it sticks, Mark's been notified by the JS gods.</p>
        <button onclick="location.reload()" style="border:2px solid hsl(215 45% 14%);background:hsl(7 84% 68%);padding:.5rem 1rem;font-family:inherit;text-transform:uppercase;cursor:pointer;">Reload</button>
      </div>
    </div>`;
}
