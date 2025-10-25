import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000)
    }, [])

    if (loading) {
        return (
            <div className="app">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading Memory Weaver...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="app">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Memory Weaver</h1>
                    <p>Your digital sanctuary for cherished memories</p>

                    <div className="auth-form">
                        <input
                            type="email"
                            placeholder="Email"
                            disabled
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            disabled
                        />

                        <div className="auth-buttons">
                            <button className="btn-primary" disabled>Sign In</button>
                            <button className="btn-secondary" disabled>Sign Up</button>
                        </div>

                        <p style={{ marginTop: '1rem', color: '#b3b3b3', fontSize: '0.9rem' }}>
                            ✅ React app is working!<br />
                            ⚠️ Configure Supabase to enable authentication
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App