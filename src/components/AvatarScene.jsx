import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import { ReadyPlayerMeAvatar, AvatarCreatorModal } from './ReadyPlayerMeAvatar'

// Simple room geometry
function Room() {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#f0f0f0" />
            </mesh>

            {/* Back Wall */}
            <mesh position={[0, 1, -5]}>
                <planeGeometry args={[10, 6]} />
                <meshStandardMaterial color="#e8e8e8" />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-5, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[10, 6]} />
                <meshStandardMaterial color="#f5f5f5" />
            </mesh>

            {/* Right Wall */}
            <mesh position={[5, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[10, 6]} />
                <meshStandardMaterial color="#f5f5f5" />
            </mesh>
        </group>
    )
}

// Simple chair for the avatar to sit
function Chair() {
    return (
        <group position={[0, -1, 0]}>
            {/* Seat */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1.2, 0.1, 1]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Backrest */}
            <mesh position={[0, 1.2, -0.4]}>
                <boxGeometry args={[1.2, 1.4, 0.1]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Chair legs */}
            {[[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.3], [0.5, 0.3]].map((pos, i) => (
                <mesh key={i} position={[pos[0], 0, pos[1]]}>
                    <cylinderGeometry args={[0.05, 0.05, 1]} />
                    <meshStandardMaterial color="#654321" />
                </mesh>
            ))}
        </group>
    )
}

// Placeholder avatar (will be replaced with Ready Player Me avatar)
function AvatarPlaceholder() {
    return (
        <group position={[0, -0.5, 0]}>
            {/* Head */}
            <mesh position={[0, 1.7, 0]}>
                <sphereGeometry args={[0.25]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Body */}
            <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[0.3, 0.25, 0.8]} />
                <meshStandardMaterial color="#4169E1" />
            </mesh>

            {/* Arms */}
            <mesh position={[-0.4, 1.2, 0]} rotation={[0, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.08, 0.08, 0.6]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>
            <mesh position={[0.4, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <cylinderGeometry args={[0.08, 0.08, 0.6]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.15, 0.3, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.6]} />
                <meshStandardMaterial color="#2F4F4F" />
            </mesh>
            <mesh position={[0.15, 0.3, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.6]} />
                <meshStandardMaterial color="#2F4F4F" />
            </mesh>
        </group>
    )
}

// Loading fallback
function Loader() {
    return (
        <div className="avatar-loader">
            <div className="spinner"></div>
            <p>Loading 3D scene...</p>
        </div>
    )
}

// Main 3D Scene Component
export default function AvatarScene() {
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [showCreator, setShowCreator] = useState(false)

    const handleAvatarCreated = (url) => {
        setAvatarUrl(url)
        localStorage.setItem('memoryWeaverAvatar', url) // Save for later
    }

    // Load saved avatar on component mount
    useEffect(() => {
        const savedAvatar = localStorage.getItem('memoryWeaverAvatar')
        if (savedAvatar) {
            setAvatarUrl(savedAvatar)
        }
    }, [])

    return (
        <div className="avatar-3d-container">
            <Suspense fallback={<Loader />}>
                <Canvas shadows>
                    {/* Camera setup */}
                    <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={50} />

                    {/* Lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[5, 5, 5]}
                        intensity={1}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <pointLight position={[-2, 3, -2]} intensity={0.3} />

                    {/* Scene objects */}
                    <Room />
                    <Chair />

                    {/* Avatar - Ready Player Me or Placeholder */}
                    {avatarUrl ? (
                        <ReadyPlayerMeAvatar
                            avatarUrl={avatarUrl}
                            position={[0, -0.5, 0]}
                            scale={1}
                        />
                    ) : (
                        <AvatarPlaceholder />
                    )}

                    {/* Contact shadows for realism */}
                    <ContactShadows
                        position={[0, -2, 0]}
                        opacity={0.4}
                        scale={5}
                        blur={2.5}
                        far={4}
                    />

                    {/* Environment lighting */}
                    <Environment preset="apartment" />

                    {/* Camera controls */}
                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={2}
                        maxDistance={10}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2}
                    />
                </Canvas>
            </Suspense>

            <div className="avatar-controls">
                <h3>AI Avatar Controls</h3>
                <div className="control-buttons">
                    <button
                        className="control-btn create-avatar"
                        onClick={() => setShowCreator(true)}
                    >
                        🎭 {avatarUrl ? 'Change Avatar' : 'Create Avatar'}
                    </button>
                    <button className="control-btn">👋 Wave</button>
                    <button className="control-btn">🗣️ Speak</button>
                    <button className="control-btn">📸 Show Photos</button>
                </div>
                <div className="avatar-info">
                    <p><strong>Ready Player Me:</strong> {avatarUrl ? '✅ Avatar Loaded' : '⏳ Create Avatar'}</p>
                    <p><strong>Status:</strong> {avatarUrl ? 'AI Avatar Active' : 'Placeholder Active'}</p>
                </div>
            </div>

            {/* Avatar Creator Modal */}
            <AvatarCreatorModal
                isOpen={showCreator}
                onClose={() => setShowCreator(false)}
                onAvatarCreated={handleAvatarCreated}
            />
        </div>
    )
}