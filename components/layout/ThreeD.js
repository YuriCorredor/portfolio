import { useEffect, useState, useRef } from 'react'
import { LoaderContainer } from './threeD/Loader'
import ShapeLoader from '../../lib/ShapeLoader'
import ModelLoader from '../../lib/ModelLoader'
import * as THREE from 'three'

export default function ThreeD() {
    const refContainer = useRef()
    const mixerRef = useRef()
    const modelRef = useRef()
    const sceneRef = useRef(new THREE.Scene())
    const cameraRef = useRef()
    const rendererRef = useRef()
    const [loading, setLoading] = useState(true)
    const target = useRef(new THREE.Vector3(0, 1.5, 0))

    // Mouse position
    const mouse = useRef({ x: 0, y: 0 })

    // Animation frame ID
    const requestRef = useRef()

    // Handle mouse movement
    const handleMouseMove = (event) => {
        const { clientX, clientY } = event
        const { innerWidth, innerHeight } = window
        mouse.current.x = (clientX / innerWidth) * 2 - 1
        mouse.current.y = -(clientY / innerHeight) * 2 + 1
    }

    const updateModel = (model, deltaTime) => {
        // Rotate based on time and mouse position
        model.rotation.y += deltaTime / 25
        model.rotation.x += mouse.current.y * 0.05 * deltaTime
        model.rotation.z += mouse.current.x * 0.05 * deltaTime
    }

    const handleWindowResize = () => {
        const container = refContainer.current
        const renderer = rendererRef.current
        const camera = cameraRef.current
        if (container && renderer && camera) {
            const screenW = container.clientWidth
            const screenH = container.clientHeight

            renderer.setSize(screenW, screenH)
            camera.aspect = screenW / screenH
            camera.updateProjectionMatrix()
        }
    }

    const handleWindowScroll = () => {
        const container = refContainer.current
        const camera = cameraRef.current
        const model = modelRef.current
        if (container && camera && model) {
            const t = window.pageYOffset
            camera.position.y = -(t * 0.004)
            if (t >= 700) {
                model.position.z = (t - 700) / 75
            } else {
                model.position.z = 0
            }
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize, false)
        window.addEventListener('scroll', handleWindowScroll, false)
        window.addEventListener('mousemove', handleMouseMove, false)

        return () => {
            window.removeEventListener('resize', handleWindowResize, false)
            window.removeEventListener('scroll', handleWindowScroll, false)
            window.removeEventListener('mousemove', handleMouseMove, false)
        }
    }, [])

    useEffect(() => {
        const init = async () => {
            const container = refContainer.current
            if (container && !rendererRef.current) {
                const screenH = container.clientHeight
                const screenW = container.clientWidth

                // Initialize Renderer
                const renderer = new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: true
                })
                renderer.physicallyCorrectLights = true
                renderer.outputEncoding = THREE.sRGBEncoding
                renderer.toneMapping = THREE.ACESFilmicToneMapping
                renderer.toneMappingExposure = 1
                renderer.setSize(screenW, screenH)
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
                container.appendChild(renderer.domElement)
                rendererRef.current = renderer

                // Initialize Camera
                const camera = new THREE.PerspectiveCamera(75, screenW / screenH, 0.01, 100)
                camera.position.set(0, 0, 3) // Adjusted Z position for better view
                cameraRef.current = camera
                sceneRef.current.add(camera)

                // Lights
                const ambientLight = new THREE.AmbientLight(0xffffff, 2)
                sceneRef.current.add(ambientLight)

                const directionalLight = new THREE.DirectionalLight(0xffffff, 4)
                directionalLight.position.set(10, -5, 7)
                sceneRef.current.add(directionalLight)

                // Stars
                const starsGeometry = new THREE.OctahedronBufferGeometry(0.1, 0)
                const starsMaterial = new THREE.MeshMatcapMaterial({ color: 0xffffff })
                ShapeLoader(starsGeometry, starsMaterial, 1000, 80, '/texture/texture.png', sceneRef.current)

                // Load Model with Increased Scale
                const { mixer, model } = await ModelLoader(sceneRef.current, mixerRef.current, '/astronaut/scene.gltf', {
                    castShadow: false,
                    receiveShadow: false,
                    scalar: 0.35, // Increased from 0.3 to 0.35
                    timeScale: 1 / 25
                })
                mixerRef.current = mixer
                modelRef.current = model

                // Initial Camera and Model Position based on current scroll
                handleWindowScroll()

                // Start Animation
                const clock = new THREE.Clock()
                let previousTime = 0

                const animate = () => {
                    requestRef.current = requestAnimationFrame(animate)

                    const elapsedTime = clock.getElapsedTime()
                    const deltaTime = elapsedTime - previousTime
                    previousTime = elapsedTime

                    if (mixerRef.current) mixerRef.current.update(deltaTime * 10)
                    if (modelRef.current) updateModel(modelRef.current, deltaTime * 10)

                    camera.lookAt(target.current)

                    renderer.render(sceneRef.current, camera)
                }

                animate()

                setLoading(false)
            }
        }

        init()

        return () => {
            // Cleanup on unmount
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current)
            }
            if (rendererRef.current) {
                rendererRef.current.dispose()
            }
        }
    }, [])

    return <LoaderContainer loading={loading} ref={refContainer} />
}
