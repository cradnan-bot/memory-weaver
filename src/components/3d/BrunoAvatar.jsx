import { useGLTF, useAnimations, Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function BrunoAvatar({ position, shouldBark = true }) {
    const group = useRef()
    const [isBarking, setIsBarking] = useState(false)
    const [barkCount, setBarkCount] = useState(0)

    // Try to load Shih Tzu model, fallback to placeholder
    try {
        const { scene, animations } = useGLTF('/models/bruno-shih-tzu.glb')
        const { actions } = useAnimations(animations, group)

        useEffect(() => {
            // Play idle or bark animation
            if (shouldBark && barkCount < 2) {
                // Trigger bark after 2 seconds, then again after 5 seconds
                const delay = barkCount === 0 ? 2000 : 5000
                const timer = setTimeout(() => {
                    playBarkSound()
                    setIsBarking(true)
                    setBarkCount(prev => prev + 1)

                    // Stop barking after 1 second
                    setTimeout(() => setIsBarking(false), 1000)
                }, delay)

                return () => clearTimeout(timer)
            }
        }, [shouldBark, barkCount])

        useEffect(() => {
            // Play appropriate animation
            if (isBarking && actions['Bark']) {
                actions['Bark'].play()
            } else if (actions['Idle']) {
                actions['Idle'].play()
            } else if (actions && Object.keys(actions).length > 0) {
                // Play first available animation
                const firstAction = Object.keys(actions)[0]
                actions[firstAction].play()
            }
        }, [actions, isBarking])

        const playBarkSound = () => {
            try {
                const audio = new Audio('/sounds/dog-bark.mp3')
                audio.volume = 0.5
                audio.play().catch(e => console.log('Audio play failed:', e))
            } catch (error) {
                console.log('Audio not available:', error)
            }
        }

        // Tail wagging animation
        useFrame((state) => {
            if (group.current) {
                group.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1
            }
        })

        return (
            <group ref={group} position={position} scale={0.5}>
                <primitive object={scene} />
                <Html position={[0, 1.5, 0]} center>
                    <div style={{
                        background: 'rgba(139, 69, 19, 0.8)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        whiteSpace: 'nowrap'
                    }}>
                        🐕 Bruno {isBarking ? '(Woof!)' : '(Happy)'}
                    </div>
                </Html>
            </group>
        )
    } catch (error) {
        console.log('Bruno model loading error, using placeholder:', error)
        return <BrunoPlaceholder position={position} shouldBark={shouldBark} />
    }
}

// Fallback placeholder for Bruno
function BrunoPlaceholder({ position, shouldBark }) {
    const meshRef = useRef()
    const [isBarking, setIsBarking] = useState(false)
    const [barkCount, setBarkCount] = useState(0)

    useEffect(() => {
        if (shouldBark && barkCount < 2) {
            const delay = barkCount === 0 ? 2000 : 5000
            const timer = setTimeout(() => {
                playBarkSound()
                setIsBarking(true)
                setBarkCount(prev => prev + 1)

                setTimeout(() => setIsBarking(false), 1000)
            }, delay)

            return () => clearTimeout(timer)
        }
    }, [shouldBark, barkCount])

    const playBarkSound = () => {
        try {
            const audio = new Audio('/sounds/dog-bark.mp3')
            audio.volume = 0.5
            audio.play().catch(e => console.log('Audio play failed:', e))
        } catch (error) {
            console.log('Audio not available:', error)
        }
    }

    // Dog-like movement animation
    useFrame((state) => {
        if (meshRef.current) {
            // Gentle bouncing
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
            // Tail wagging effect
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.2
        }
    })

    return (
        <group position={position} scale={0.5}>
            <group ref={meshRef}>
                {/* Dog body */}
                <mesh position={[0, 0.3, 0]} castShadow>
                    <boxGeometry args={[1.2, 0.6, 0.8]} />
                    <meshStandardMaterial color="#D2B48C" />
                </mesh>

                {/* Head */}
                <mesh position={[0, 0.7, 0.5]} castShadow>
                    <boxGeometry args={[0.6, 0.5, 0.7]} />
                    <meshStandardMaterial color="#F5DEB3" />
                </mesh>

                {/* Ears */}
                <mesh position={[-0.2, 0.9, 0.3]} rotation={[0, 0, -0.3]} castShadow>
                    <boxGeometry args={[0.2, 0.4, 0.1]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0.2, 0.9, 0.3]} rotation={[0, 0, 0.3]} castShadow>
                    <boxGeometry args={[0.2, 0.4, 0.1]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>

                {/* Legs */}
                {[
                    [-0.4, 0, -0.2],
                    [0.4, 0, -0.2],
                    [-0.4, 0, 0.2],
                    [0.4, 0, 0.2]
                ].map((pos, i) => (
                    <mesh key={i} position={pos} castShadow>
                        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
                        <meshStandardMaterial color="#8B4513" />
                    </mesh>
                ))}

                {/* Tail */}
                <mesh
                    position={[0, 0.5, -0.6]}
                    rotation={[0.3 + (isBarking ? 0.5 : 0), 0, 0]}
                    castShadow
                >
                    <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>

                {/* Eyes */}
                <mesh position={[-0.15, 0.8, 0.8]}>
                    <sphereGeometry args={[0.05]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
                <mesh position={[0.15, 0.8, 0.8]}>
                    <sphereGeometry args={[0.05]} />
                    <meshStandardMaterial color="#000" />
                </mesh>

                {/* Nose */}
                <mesh position={[0, 0.7, 0.9]}>
                    <sphereGeometry args={[0.03]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
            </group>

            <Html position={[0, 1.5, 0]} center>
                <div style={{
                    background: 'rgba(139, 69, 19, 0.8)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap'
                }}>
                    🐕 Bruno {isBarking ? '(Woof!)' : '(Happy)'}
                </div>
            </Html>
        </group>
    )
}

// Preload the GLB files
useGLTF.preload('/models/bruno-shih-tzu.glb')