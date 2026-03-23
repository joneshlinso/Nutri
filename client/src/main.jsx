import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Catch silent render errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(err) { return { error: err } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding:40, fontFamily:'Inter,sans-serif' }}>
          <h2 style={{ color:'#E85454', marginBottom:12 }}>App Error</h2>
          <pre style={{ background:'#f4f4f4', padding:16, borderRadius:8, fontSize:13, whiteSpace:'pre-wrap' }}>
            {String(this.state.error)}
          </pre>
          <p style={{ marginTop:12, color:'#666', fontSize:14 }}>Open the browser console (F12) for more details.</p>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
