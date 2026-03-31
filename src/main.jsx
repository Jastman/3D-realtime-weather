import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Note: React StrictMode is intentionally omitted.
// R3F v9 has known issues with Strict Mode's double-invoke behavior
// causing duplicate WebGL context setup and unmount/remount effects.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
