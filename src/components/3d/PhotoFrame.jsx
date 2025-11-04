import { useTexture } from '@react-three/drei'
import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export default function PhotoFrame({ photo, position, onClick }) {
    const [hovered, setHovered] = useState(false)
    const meshRef = useRef()

    // Handle texture loading with error fallback
    let texture
    try {
        texture = useTexture(photo.url || '/placeholder-image.jpg')
    } catch (error) {
        console.log('Texture loading error for photo:', photo.name)
        // Use a fallback color instead
        texture = null
    }

    // Gentle floating animation when hovered
    useFrame((state) => {
        if (meshRef.current && hovered) {
            meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 2) * 0.05
        }
    })

    return (
        <group position={position}>
            {/* Frame */}
            <mesh castShadow>
                <boxGeometry args={[1.2, 1.2, 0.05]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Photo */}
            <mesh
                ref={meshRef}
                position={[0, 0, 0.03]}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHovered(true)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={(e) => {
                    e.stopPropagation()
                    setHovered(false)
                    document.body.style.cursor = 'auto'
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    onClick && onClick(photo)
                }}
                scale={hovered ? 1.05 : 1}
            >
                <planeGeometry args={[1, 1]} />
                {texture ? (
                    <meshStandardMaterial map={texture} />
                ) : (
                    <meshStandardMaterial color="#f0f0f0" />
                )}
            </mesh>

            {/* Photo info overlay when hovered */}
            {hovered && (
                <mesh position={[0, -0.7, 0.1]}>
                    <planeGeometry args={[1.2, 0.3]} />
                    <meshStandardMaterial
                        color="#000"
                        transparent
                        opacity={0.7}
                    />
                </mesh>
            )}
        </group>
    )
}

// Preload placeholder image
useTexture.preload('/placeholder-image.jpg')