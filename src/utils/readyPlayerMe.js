// Ready Player Me Integration Helper
// This file will be configured once you get your Application ID from Ready Player Me

// Configuration object - CONFIGURED WITH YOUR ACTUAL APPLICATION ID
export const readyPlayerMeConfig = {
    // Your actual Application ID from Ready Player Me
    applicationId: '69039770ce04903d21dc1c5b',

    // Avatar customization options
    bodyType: 'halfbody', // 'fullbody' or 'halfbody'

    // Avatar appearance settings
    gender: 'male', // 'male' or 'female'

    // Asset filtering (what customization options to show)
    assets: {
        filter: {
            brand: 'readyplayerme',
            type: 'character',
            style: 'default'
        }
    }
}

// Initialize Ready Player Me iframe
export function createAvatarCreator(container, onAvatarExported) {
    const iframe = document.createElement('iframe')
    iframe.src = `https://readyplayer.me/avatar?frameApi&bodyType=${readyPlayerMeConfig.bodyType}`
    iframe.style.width = '100%'
    iframe.style.height = '600px'
    iframe.style.border = 'none'

    // Listen for avatar creation events
    window.addEventListener('message', (event) => {
        const json = parse(event)

        if (json?.source !== 'readyplayerme') {
            return
        }

        // Avatar export complete
        if (json.eventName === 'v1.avatar.exported') {
            console.log('Avatar exported:', json.data.url)
            if (onAvatarExported) {
                onAvatarExported(json.data.url)
            }
        }

        // Frame loading complete
        if (json.eventName === 'v1.frame.ready') {
            console.log('Ready Player Me frame is ready')
        }
    })

    container.appendChild(iframe)
    return iframe
}

// Load avatar GLB model for Three.js
export async function loadAvatarModel(avatarUrl) {
    try {
        // The avatar URL from Ready Player Me is already a GLB file
        // We'll use this with GLTFLoader in our 3D scene
        return avatarUrl
    } catch (error) {
        console.error('Error loading avatar model:', error)
        throw error
    }
}

// Parse Ready Player Me messages
function parse(event) {
    try {
        return JSON.parse(event.data)
    } catch (error) {
        return null
    }
}

// Avatar animation presets
export const avatarAnimations = {
    idle: 'idle',
    wave: 'wave',
    speaking: 'speaking',
    pointing: 'pointing',
    thinking: 'thinking'
}

// Helper to validate Application ID format
export function validateAppId(appId) {
    const appIdPattern = /^[a-zA-Z0-9_-]+$/
    return appIdPattern.test(appId) && appId !== 'YOUR_APP_ID'
}

// Setup instructions for developers
export const setupInstructions = {
    steps: [
        "1. Visit https://readyplayer.me/developers",
        "2. Create account and sign in",
        "3. Click 'Create New Application'",
        "4. Choose 'Web' platform",
        "5. Enter app details:",
        "   - Name: Memory Weaver",
        "   - Description: AI avatars for photo memory narration",
        "   - Domain: localhost:5173",
        "6. Copy your Application ID",
        "7. Replace 'YOUR_APP_ID' in readyPlayerMeConfig.applicationId",
        "8. Install Ready Player Me SDK: npm install @readyplayerme/visage"
    ],
    notes: [
        "Keep your Application ID secure",
        "Test with localhost first, then add production domain",
        "Ready Player Me avatars are GLB format, compatible with Three.js"
    ]
}