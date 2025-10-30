import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// Ready Player Me Avatar Component
export function ReadyPlayerMeAvatar({ avatarUrl, position = [0, -0.5, 0], scale = 1 }) {
    const meshRef = useRef()
    const [avatar, setAvatar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Load avatar from URL
    useEffect(() => {
        if (!avatarUrl) return

        const loader = new GLTFLoader()
        setLoading(true)
        setError(null)

        loader.load(
            avatarUrl,
            (gltf) => {
                console.log('Avatar loaded successfully:', gltf)

                // Set up the avatar
                const avatarScene = gltf.scene
                avatarScene.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true
                        child.receiveShadow = true

                        // Ensure materials are properly set
                        if (child.material) {
                            child.material.envMapIntensity = 0.8
                        }
                    }
                })

                setAvatar(avatarScene)
                setLoading(false)
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Error loading avatar:', error)
                setError(error)
                setLoading(false)
            }
        )
    }, [avatarUrl])

    // Simple idle animation
    useFrame((state) => {
        if (meshRef.current && avatar) {
            // Gentle breathing animation
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.01

            // Subtle head movement
            if (avatar.getObjectByName('Head')) {
                const head = avatar.getObjectByName('Head')
                head.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
            }
        }
    })

    if (loading) {
        return (
            <mesh position={position} ref={meshRef}>
                <boxGeometry args={[0.5, 1.8, 0.3]} />
                <meshStandardMaterial color="#cccccc" transparent opacity={0.5} />
            </mesh>
        )
    }

    if (error || !avatar) {
        return (
            <mesh position={position} ref={meshRef}>
                <boxGeometry args={[0.5, 1.8, 0.3]} />
                <meshStandardMaterial color="#ff6b6b" />
            </mesh>
        )
    }

    return (
        <primitive
            ref={meshRef}
            object={avatar}
            position={position}
            scale={scale}
        />
    )
}

// Avatar Creator Modal Component
export function AvatarCreatorModal({ isOpen, onClose, onAvatarCreated }) {
    const iframeRef = useRef()

    useEffect(() => {
        if (!isOpen) return

        // Listen for messages from Ready Player Me iframe
        const handleMessage = (event) => {
            if (event.data.source === 'readyplayerme') {
                console.log('Ready Player Me event:', event.data)

                if (event.data.eventName === 'v1.avatar.exported') {
                    const avatarUrl = event.data.data.url
                    console.log('Avatar exported:', avatarUrl)
                    onAvatarCreated(avatarUrl)
                    onClose()
                }
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [isOpen, onAvatarCreated, onClose])

    if (!isOpen) return null

    return (
        <div className="avatar-creator-modal">
            <div className="avatar-creator-content">
                <div className="avatar-creator-header">
                    <h2>Create Your AI Avatar</h2>
                    <button onClick={onClose} className="close-btn">✕</button>
                </div>
                <iframe
                    ref={iframeRef}
                    src="https://demo.readyplayer.me/avatar?frameApi&bodyType=halfbody"
                    className="avatar-creator-iframe"
                    allow="camera *; microphone *"
                />
            </div>
            <div className="avatar-creator-overlay" onClick={onClose}></div>
        </div>
    )
}