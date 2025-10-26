import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [photos, setPhotos] = useState([])
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Supabase auth error:', error.message)
        }
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Failed to initialize auth:', error.message)
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchPhotos()
    }
  }, [user])

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('photos')
        .list(user.id, {
          limit: 100,
          offset: 0
        })

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error('Error fetching photos:', error.message)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

  const signInWithEmail = async () => {
    try {
      if (!email) {
        alert('Please enter your email address')
        return
      }

      // For now, we'll store the email in backend/console
      console.log('Email submitted to backend:', email)

      // You can also send to a simple endpoint or log it
      // For demo purposes, we'll show a success message
      alert(`Email ${email} submitted to backend. Check console for details.`)

      // Clear the email field
      setEmail('')
    } catch (error) {
      alert(error.message)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

  const uploadPhoto = async (event) => {
    try {
      const file = event.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error } = await supabase.storage
        .from('photos')
        .upload(filePath, file)

      if (error) throw error

      fetchPhotos()
      setShowUpload(false)
    } catch (error) {
      alert(error.message)
    }
  }

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

  if (!user) {
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
              <button onClick={signInWithGoogle} className="google-btn">
                <span className="google-icon">G</span>
                Continue with Google
              </button>

              <div className="email-section">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                />
                <button onClick={signInWithEmail} className="continue-btn">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Memory Weaver</h1>
        <div className="header-actions">
          <button onClick={() => setShowUpload(true)} className="btn-primary">
            Upload Photo
          </button>
          <button onClick={signOut} className="btn-secondary">
            Sign Out
          </button>
        </div>
      </header>

      <main className="main">
        <div className="welcome">
          <h2>Welcome back, {user.email}</h2>
          <p>Your memories are waiting to be explored</p>
        </div>

        <div className="photo-grid">
          {photos.length === 0 ? (
            <div className="empty-state">
              <p>No photos yet. Upload your first memory!</p>
              <button onClick={() => setShowUpload(true)} className="btn-primary">
                Get Started
              </button>
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.name} className="photo-card">
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/photos/${user.id}/${photo.name}`}
                  alt="Memory"
                  loading="lazy"
                />
                <div className="photo-overlay">
                  <p>{photo.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Upload a Memory</h3>
            <input
              type="file"
              accept="image/*"
              onChange={uploadPhoto}
              className="file-input"
            />
            <div className="modal-actions">
              <button onClick={() => setShowUpload(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
