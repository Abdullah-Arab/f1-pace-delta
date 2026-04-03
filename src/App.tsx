import { PaceDeltaChart } from './features/pace-delta/PaceDeltaChart'
import './App.css'

function App() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', color: '#111827', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Hero Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '60px 20px', borderBottom: '4px solid #e10600', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" 
            alt="F1 Logo" 
            style={{ height: '40px', marginBottom: '24px' }} 
          />
          <h1 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            Teammate Pace Delta
          </h1>
          <p style={{ fontSize: '18px', color: '#4b5563', margin: 0, maxWidth: '600px', marginInline: 'auto', lineHeight: '1.6' }}>
            A deep dive into the performance gap between teammates. 
            Comparing the fastest qualifying lap of each driver to see who extracts the true potential of the car.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '40px 20px' }}>
        <PaceDeltaChart />
      </section>

    </main>
  )
}

export default App
