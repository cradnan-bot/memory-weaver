import { useState, useEffect } from 'react'
import './App.css'
import AvatarScene from './components/AvatarScene'
import { supabase } from './supabase'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('photos')
  const [photos, setPhotos] = useState([])
  const [albums, setAlbums] = useState([])
  const [memoryClips, setMemoryClips] = useState([])
  const [recycleBin, setRecycleBin] = useState([])

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Session check error:', error)
        } else if (session) {
          setUser(session.user)
          setEmail(session.user.email)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
          setEmail(session.user.email)
          setIsLoggedIn(true)
        } else {
          setUser(null)
          setEmail('')
          setIsLoggedIn(false)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert('Please enter both email and password')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address')
        return
      }

      setLoading(true)

      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        // If user doesn't exist, create account
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
          })

          if (signUpError) {
            throw signUpError
          }

          if (signUpData.user && !signUpData.session) {
            alert('Please check your email for verification link!')
            return
          }

          alert('Account created successfully!')
        } else {
          throw error
        }
      }

      console.log('Authentication successful:', data)

    } catch (error) {
      console.error('Login error:', error)
      alert(`Authentication failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: prompt('Enter new password:')
      })

      if (error) throw error

      alert('Password updated successfully!')
      setShowChangePassword(false)
    } catch (error) {
      alert(`Password change failed: ${error.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setIsLoggedIn(false)
      setUser(null)
      setEmail('')
      setPassword('')
      setActiveTab('photos')
    } catch (error) {
      console.error('Logout error:', error)
      alert('Logout failed')
    }
  }

  const handleAddPhotos = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'
    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      const newPhotos = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        dateAdded: new Date().toISOString()
      }))
      setPhotos(prev => [...prev, ...newPhotos])
    }
    input.click()
  }

  const handleDeletePhoto = (photoId) => {
    const photoToDelete = photos.find(p => p.id === photoId)
    if (photoToDelete) {
      setRecycleBin(prev => [...prev, { ...photoToDelete, deletedAt: new Date().toISOString() }])
      setPhotos(prev => prev.filter(p => p.id !== photoId))
    }
  }

  const createAlbum = () => {
    const albumName = prompt('Enter album name:')
    if (albumName) {
      const newAlbum = {
        id: Date.now(),
        name: albumName,
        photos: [],
        createdAt: new Date().toISOString()
      }
      setAlbums(prev => [...prev, newAlbum])
    }
  }

  const createMemoryClip = () => {
    const clipName = prompt('Enter memory clip name:')
    if (clipName) {
      const newClip = {
        id: Date.now(),
        name: clipName,
        photos: [],
        story: '',
        createdAt: new Date().toISOString()
      }
      setMemoryClips(prev => [...prev, newClip])
    }
  }

  // Loading screen while checking authentication
  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Memory Weaver</h2>
          <p>Loading your memories...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <button className="close-btn">×</button>
            </div>

            <h1>Log in or sign up</h1>
            <p>Access your digital sanctuary for cherished memories</p>

            <div className="auth-form">
              <div className="input-section">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  onClick={handleLogin}
                  className="continue-btn"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : 'Continue'}
                </button>
                <div className="auth-footer">
                  <p className="auth-note">
                    � Secure authentication powered by Supabase
                  </p>
                  <p className="auth-help">
                    New user? An account will be created automatically
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'photos':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Photos</h2>
              <button onClick={handleAddPhotos} className="add-btn">
                📷 Add Photos
              </button>
            </div>
            <div className="photo-grid">
              {photos.length === 0 ? (
                <div className="empty-state">
                  <h3>No photos yet</h3>
                  <p>Upload your first memories to get started</p>
                  <button onClick={handleAddPhotos} className="primary-btn">
                    Upload Photos
                  </button>
                </div>
              ) : (
                photos.map(photo => (
                  <div key={photo.id} className="photo-item">
                    <img src={photo.url} alt={photo.name} />
                    <div className="photo-overlay">
                      <button onClick={() => handleDeletePhoto(photo.id)} className="delete-btn">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case 'memory-clips':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Memory Clips</h2>
              <button onClick={createMemoryClip} className="add-btn">
                🎬 Create Clip
              </button>
            </div>
            <div className="clips-grid">
              {memoryClips.length === 0 ? (
                <div className="empty-state">
                  <h3>No memory clips yet</h3>
                  <p>Create your first memory story</p>
                  <button onClick={createMemoryClip} className="primary-btn">
                    Create Memory Clip
                  </button>
                </div>
              ) : (
                memoryClips.map(clip => (
                  <div key={clip.id} className="clip-item">
                    <h4>{clip.name}</h4>
                    <p>{clip.photos.length} photos</p>
                    <small>{new Date(clip.createdAt).toLocaleDateString()}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case 'albums':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Albums</h2>
              <button onClick={createAlbum} className="add-btn">
                📁 Create Album
              </button>
            </div>
            <div className="albums-grid">
              {albums.length === 0 ? (
                <div className="empty-state">
                  <h3>No albums yet</h3>
                  <p>Organize your photos into albums</p>
                  <button onClick={createAlbum} className="primary-btn">
                    Create Album
                  </button>
                </div>
              ) : (
                albums.map(album => (
                  <div key={album.id} className="album-item">
                    <h4>{album.name}</h4>
                    <p>{album.photos.length} photos</p>
                    <small>{new Date(album.createdAt).toLocaleDateString()}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case 'avatar':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>AI Avatar - 3D Interactive Scene</h2>
              <div className="avatar-status">
                <span className="status-indicator">🟢 3D Scene Active</span>
              </div>
            </div>
            <AvatarScene />
          </div>
        )

      case 'sharing':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Sharing</h2>
            </div>
            <div className="sharing-section">
              <div className="sharing-options">
                <div className="share-option">
                  <h4>🔗 Share Links</h4>
                  <p>Create shareable links for your albums</p>
                </div>
                <div className="share-option">
                  <h4>👥 Family Sharing</h4>
                  <p>Invite family members to view memories</p>
                </div>
                <div className="share-option">
                  <h4>📱 Social Export</h4>
                  <p>Export for social media platforms</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'recycle-bin':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Recycle Bin</h2>
              <span className="item-count">{recycleBin.length} items</span>
            </div>
            <div className="recycle-grid">
              {recycleBin.length === 0 ? (
                <div className="empty-state">
                  <h3>Recycle bin is empty</h3>
                  <p>Deleted items will appear here</p>
                </div>
              ) : (
                recycleBin.map(item => (
                  <div key={item.id} className="recycle-item">
                    <img src={item.url} alt={item.name} />
                    <div className="item-info">
                      <p>{item.name}</p>
                      <small>Deleted: {new Date(item.deletedAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      default:
        return <div>Select a section</div>
    }
  }

  return (
    <div className="app memory-weaver-app">
      <div className="app-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>Memory Weaver</h1>
            <div className="user-info">
              <span>{email}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              <span className="nav-icon">📷</span>
              Photos
              <span className="count">{photos.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'memory-clips' ? 'active' : ''}`}
              onClick={() => setActiveTab('memory-clips')}
            >
              <span className="nav-icon">🎬</span>
              Memory Clips
              <span className="count">{memoryClips.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'albums' ? 'active' : ''}`}
              onClick={() => setActiveTab('albums')}
            >
              <span className="nav-icon">📁</span>
              Albums
              <span className="count">{albums.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'avatar' ? 'active' : ''}`}
              onClick={() => setActiveTab('avatar')}
            >
              <span className="nav-icon">👤</span>
              AI Avatar
            </button>

            <button
              className={`nav-item ${activeTab === 'sharing' ? 'active' : ''}`}
              onClick={() => setActiveTab('sharing')}
            >
              <span className="nav-icon">🔗</span>
              Sharing
            </button>

            <button
              className={`nav-item ${activeTab === 'recycle-bin' ? 'active' : ''}`}
              onClick={() => setActiveTab('recycle-bin')}
            >
              <span className="nav-icon">🗑️</span>
              Recycle Bin
              <span className="count">{recycleBin.length}</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-email">
                <span className="user-icon">👤</span>
                <span className="email-text">{email}</span>
              </div>
              <div className="user-actions">
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="user-action-btn"
                  title="Change Password"
                >
                  🔑
                </button>
                <button
                  onClick={handleLogout}
                  className="user-action-btn logout-btn"
                  title="Logout"
                >
                  🚪
                </button>
              </div>
              {showChangePassword && (
                <div className="change-password-panel">
                  <p>🔐 Supabase Authentication</p>
                  <button onClick={handleChangePassword} className="admin-contact-btn">
                    Change Password
                  </button>
                </div>
              )}
            </div>
            <div className="storage-info">
              <p>Storage</p>
              <div className="storage-bar">
                <div className="storage-used" style={{ width: '15%' }}></div>
              </div>
              <small>2.4 GB used • 100 GB available</small>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="top-bar">
            <div className="search-section">
              <input type="text" placeholder="Search your memories..." className="search-input" />
              <button className="filter-btn">🔍 Quick Filter</button>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App