import { useGLTF, useAnimations, Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function UserAvatar({ position, user }) {
    const group = useRef()
    const [avatarError, setAvatarError] = useState(false)

    // Try to load Ready Player Me avatar, fallback to placeholder
    let avatarUrl = '/models/user-avatar.glb'

    // Use Ready Player Me avatar if available from localStorage
    const savedAvatar = localStorage.getItem('memoryWeaverAvatar')
    if (savedAvatar) {
        avatarUrl = savedAvatar
    }

    try {
        const { scene, animations } = useGLTF(avatarUrl)
        const { actions } = useAnimations(animations, group)

        useEffect(() => {
            // Play idle animation if available
            if (actions && actions['Idle']) {
                actions['Idle'].play()
            } else if (actions && Object.keys(actions).length > 0) {
                // Play first available animation
                const firstAction = Object.keys(actions)[0]
                actions[firstAction].play()
            }
        }, [actions])

        // Gentle breathing animation
        useFrame((state) => {
            if (group.current) {
                group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.02
            }
        })

        return (
            <group ref={group} position={position} scale={1}>
                <primitive object={scene} />
                <Html position={[0, 2.2, 0]} center>
                    <div style={{
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        whiteSpace: 'nowrap'
                    }}>
                        {user?.email || 'You'}
                    </div>
                </Html>
            </group>
        )
    } catch (error) {
        console.log('Avatar loading error, using placeholder:', error)
        return <AvatarPlaceholder position={position} user={user} />
    }
}

// Fallback placeholder avatar
function AvatarPlaceholder({ position, user }) {
    const meshRef = useRef()

    // Simple breathing animation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.02
        }
    })

    return (
        <group position={position}>
            <group ref={meshRef}>
                {/* Head */}
                <mesh position={[0, 1.7, 0]} castShadow>
                    <sphereGeometry args={[0.25]} />
                    <meshStandardMaterial color="#ffdbac" />
                </mesh>

                {/* Body */}
                <mesh position={[0, 1, 0]} castShadow>
                    <cylinderGeometry args={[0.3, 0.25, 0.8]} />
                    <meshStandardMaterial color="#4169E1" />
                </mesh>

                {/* Arms */}
                <mesh position={[-0.4, 1.2, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.6]} />
                    <meshStandardMaterial color="#ffdbac" />
                </mesh>
                <mesh position={[0.4, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.6]} />
                    <meshStandardMaterial color="#ffdbac" />
                </mesh>

                {/* Legs */}
                <mesh position={[-0.15, 0.3, 0]} castShadow>
                    <cylinderGeometry args={[0.1, 0.1, 0.6]} />
                    <meshStandardMaterial color="#2F4F4F" />
                </mesh>
                <mesh position={[0.15, 0.3, 0]} castShadow>
                    <cylinderGeometry args={[0.1, 0.1, 0.6]} />
                    <meshStandardMaterial color="#2F4F4F" />
                </mesh>
            </group>

            <Html position={[0, 2.2, 0]} center>
                <div style={{
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap'
                }}>
                    {user?.email || 'You'}
                </div>
            </Html>
        </group>
    )
}

// Preload the GLB files
useGLTF.preload('/models/user-avatar.glb')