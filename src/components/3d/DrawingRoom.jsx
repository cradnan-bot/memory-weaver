import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Html } from '@react-three/drei'
import { Suspense } from 'react'
import UserAvatar from './UserAvatar'
import BrunoAvatar from './BrunoAvatar'
import PhotoFrame from './PhotoFrame'

export default function DrawingRoom({ photos = [], onPhotoClick, user }) {
    return (
        <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
            <Canvas shadows>
                {/* Camera Setup */}
                <PerspectiveCamera makeDefault position={[0, 1.6, 5]} fov={75} />

                {/* Camera Controls - User can navigate the room */}
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={2}
                    maxDistance={10}
                    maxPolarAngle={Math.PI / 2}
                    target={[0, 1, 0]}
                    enableDamping={true}
                    dampingFactor={0.05}
                />

                {/* Lighting Setup */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
                <pointLight position={[-5, 3, -5]} intensity={0.5} />

                {/* Environment Map for Realistic Reflections */}
                <Environment preset="apartment" background />

                {/* Room Structure */}
                <Suspense fallback={<LoadingScreen />}>
                    <Room />
                    <UserAvatar position={[-1.5, 0, 0]} user={user} />
                    <BrunoAvatar position={[1.5, 0, 0]} shouldBark={true} />
                    <PhotoGalleryWall photos={photos} onPhotoClick={onPhotoClick} />
                </Suspense>
            </Canvas>
        </div>
    )
}

// Loading screen component
function LoadingScreen() {
    return (
        <Html center>
            <div style={{
                color: 'white',
                background: 'rgba(0,0,0,0.8)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid rgba(255,255,255,0.3)',
                    borderTop: '4px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 15px'
                }}></div>
                <div>Loading your memory room...</div>
            </div>
        </Html>
    )
}

// Room geometry component
function Room() {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#8B7355" />
            </mesh>

            {/* Walls - Box with inside visible */}
            <mesh position={[0, 2.5, 0]}>
                <boxGeometry args={[10, 5, 10]} />
                <meshStandardMaterial color="#E8DCC4" side={2} /> {/* side={2} = DoubleSide */}
            </mesh>

            {/* Furniture - Simple table */}
            <mesh position={[0, 0.4, 2]} castShadow>
                <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
                <meshStandardMaterial color="#654321" />
            </mesh>

            {/* Table legs */}
            {[
                [-0.6, 0, -0.6],
                [0.6, 0, -0.6],
                [-0.6, 0, 0.6],
                [0.6, 0, 0.6]
            ].map((pos, i) => (
                <mesh key={i} position={[pos[0], 0.2, 2 + pos[2]]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                    <meshStandardMaterial color="#4A4A4A" />
                </mesh>
            ))}

            {/* Chairs around the table */}
            <Chair position={[0, 0, 3.2]} />
            <Chair position={[1.2, 0, 2]} rotation={[0, -Math.PI / 2, 0]} />
            <Chair position={[-1.2, 0, 2]} rotation={[0, Math.PI / 2, 0]} />
        </group>
    )
}

// Chair component
function Chair({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Seat */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.5, 0.05, 0.5]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Backrest */}
            <mesh position={[0, 0.8, -0.22]} castShadow>
                <boxGeometry args={[0.5, 0.6, 0.05]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Chair legs */}
            {[
                [-0.2, 0.25, -0.2],
                [0.2, 0.25, -0.2],
                [-0.2, 0.25, 0.2],
                [0.2, 0.25, 0.2]
            ].map((pos, i) => (
                <mesh key={i} position={pos} castShadow>
                    <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                    <meshStandardMaterial color="#654321" />
                </mesh>
            ))}
        </group>
    )
}

// Photo gallery wall component
function PhotoGalleryWall({ photos, onPhotoClick }) {
    if (!photos || photos.length === 0) {
        return (
            <group position={[0, 2, -4.8]}>
                <Html position={[0, 0, 0]} center>
                    <div style={{
                        color: '#666',
                        padding: '20px',
                        textAlign: 'center',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        Upload photos to see them displayed here!
                    </div>
                </Html>
            </group>
        )
    }

    return (
        <group position={[0, 2, -4.8]}>
            {photos.slice(0, 6).map((photo, index) => (
                <PhotoFrame
                    key={photo.id}
                    photo={photo}
                    position={[
                        (index % 3) * 1.5 - 1.5,
                        Math.floor(index / 3) * 1.2,
                        0
                    ]}
                    onClick={() => onPhotoClick && onPhotoClick(photo)}
                />
            ))}
        </group>
    )
}