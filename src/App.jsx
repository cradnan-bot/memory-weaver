import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleContinue = async () => {
    try {
      if (!email) {
        alert('Please enter your email address')
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address')
        return
      }

      // Store the email in backend/console
      console.log('Email submitted to backend:', email)

      // Go directly to welcome screen without alert
      setIsSubmitted(true)

    } catch (error) {
      console.error('Email submission error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  if (isSubmitted) {
    return (
      <div className="app">
        <div className="welcome-container">
          <div className="welcome-card">
            <h1>Welcome to Memory Weaver!</h1>
            <p>Thanks for joining, {email}</p>
            <p>Your digital sanctuary for cherished memories is being prepared.</p>
            <button onClick={() => setIsSubmitted(false)} className="back-btn">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <button className="close-btn">×</button>
          </div>

          <h1>Log in or sign up</h1>
          <p>You'll get smarter responses and can upload files, images, and more.</p>

          <div className="auth-form">
            <div className="email-section">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
              />
              <button onClick={handleContinue} className="continue-btn">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App