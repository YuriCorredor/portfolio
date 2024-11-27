import { useEffect, useState, useRef } from 'react';
import { LoaderContainer } from './threeD/Loader';
import ShapeLoader from '../../lib/ShapeLoader';
import ModelLoader from '../../lib/ModelLoader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ThreeD() {
    const refContainer = useRef();
    const mixerRef = useRef();
    const modelRef = useRef();
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef();
    const rendererRef = useRef();
    const controlsRef = useRef();
    const [loading, setLoading] = useState(true);

    // References to planets for animation
    const planetsRef = useRef([]);

    // Animation frame ID
    const requestRef = useRef();

    // Handle mouse movement for subtle astronaut animations
    const mouse = useRef({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        mouse.current.x = (clientX / innerWidth) * 2 - 1;
        mouse.current.y = -(clientY / innerHeight) * 2 + 1;
    };

    // Update astronaut model with subtle animations
    const updateModel = (model, deltaTime) => {
        // Rotate based on time and mouse position
        model.rotation.y += deltaTime / 25;
        model.rotation.x += mouse.current.y * 0.05 * deltaTime;
        model.rotation.z += mouse.current.x * 0.05 * deltaTime;

        // Clamp the rotation.x to prevent flipping
        const maxRotationX = Math.PI / 2; // 90 degrees
        const minRotationX = -Math.PI / 2; // -90 degrees
        model.rotation.x = THREE.MathUtils.clamp(model.rotation.x, minRotationX, maxRotationX);
    };

    // Handle window resize
    const handleWindowResize = () => {
        const container = refContainer.current;
        const renderer = rendererRef.current;
        const camera = cameraRef.current;
        if (container && renderer && camera) {
            const screenW = container.clientWidth;
            const screenH = container.clientHeight;

            renderer.setSize(screenW, screenH);
            camera.aspect = screenW / screenH;
            camera.updateProjectionMatrix();

            // Update controls
            if (controlsRef.current) {
                controlsRef.current.update();
            }
        }
    };

    // Target positions for smooth interpolation
    const targetCameraY = useRef(0);
    const targetModelY = useRef(0);

    const handleWindowScroll = () => {
        const t = window.scrollY;

        // Update target camera Y position
        targetCameraY.current = -t * 0.002; // Adjusted scaling factor for smoother movement

        // Update target model Y position based on scroll
        if (t >= 700) {
            targetModelY.current = (t - 700) / 100; // Adjusted axis and scaling
        } else {
            targetModelY.current = 0;
        }
    };

    // Initialize event listeners
    useEffect(() => {
        window.addEventListener('resize', handleWindowResize, false);
        window.addEventListener('scroll', handleWindowScroll, false);
        window.addEventListener('mousemove', handleMouseMove, false);

        return () => {
            window.removeEventListener('resize', handleWindowResize, false);
            window.removeEventListener('scroll', handleWindowScroll, false);
            window.removeEventListener('mousemove', handleMouseMove, false);
        };
    }, []);

    // Initialize Three.js scene
    useEffect(() => {
        const init = async () => {
            const container = refContainer.current;
            if (container && !rendererRef.current) {
                const screenH = container.clientHeight;
                const screenW = container.clientWidth;

                // Initialize Renderer
                const renderer = new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: true
                });
                renderer.physicallyCorrectLights = true;
                renderer.outputEncoding = THREE.sRGBEncoding;
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                renderer.toneMappingExposure = 1;
                renderer.setSize(screenW, screenH);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                container.appendChild(renderer.domElement);
                rendererRef.current = renderer;

                // Initialize Camera
                const camera = new THREE.PerspectiveCamera(60, screenW / screenH, 0.1, 1000);
                camera.position.set(0, 10, 10); // Reduced Z position to bring the astronaut closer
                cameraRef.current = camera;

                // Initialize OrbitControls
                const controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.enablePan = false;
                controls.minDistance = 5; // Adjusted for closer interaction
                controls.maxDistance = 50;
                controlsRef.current = controls;

                // Add Camera to Scene
                sceneRef.current.add(camera);

                // Add Lights
                const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
                sceneRef.current.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(5, 10, 7.5);
                directionalLight.castShadow = true;
                sceneRef.current.add(directionalLight);

                // Add AxesHelper for debugging (optional)
                // const axesHelper = new THREE.AxesHelper(5);
                // sceneRef.current.add(axesHelper);

                // Add Stars
                addStars();

                // Load Astronaut Model
                const { mixer, model } = await ModelLoader(sceneRef.current, mixerRef.current, '/astronaut/scene.gltf', {
                    castShadow: true,
                    receiveShadow: true,
                    scalar: 0.75, // Starting larger
                    timeScale: 1 / 25
                });

                model.rotation.set(1, 15, 10);

                // Adjust rotation to face the camera correctly
                // Removed the Y-axis rotation to prevent flipping
                model.rotation.x = Math.PI; // Rotate 90 degrees around X-axis to make it upright

                mixerRef.current = mixer;
                modelRef.current = model;

                // Optionally, adjust the model's position if necessary
                // model.position.set(0, 0, 0);

                // Add Planets
                addPlanets(sceneRef.current);

                // Add Orbit Visualizations
                addOrbitPaths(sceneRef.current);

                // Start Animation Loop
                const clock = new THREE.Clock();
                let previousTime = 0;

                const animate = () => {
                    requestRef.current = requestAnimationFrame(animate);

                    const elapsedTime = clock.getElapsedTime();
                    const deltaTime = elapsedTime - previousTime;
                    previousTime = elapsedTime;

                    // Update Mixer
                    if (mixerRef.current) mixerRef.current.update(deltaTime);

                    // Update Astronaut
                    if (modelRef.current) updateModel(modelRef.current, deltaTime);

                    // Rotate Planets
                    planetsRef.current.forEach((planet) => {
                        // Orbit Rotation
                        planet.orbit.rotation.y += planet.orbitalSpeed * deltaTime;

                        // Planet Rotation
                        planet.mesh.rotation.y += planet.rotationSpeed * deltaTime;

                        // Rotate cloud layers if present
                        if (planet.clouds) {
                            planet.clouds.rotation.y += (planet.rotationSpeed + 0.02) * deltaTime;
                        }
                    });

                    // Smoothly interpolate camera position
                    if (cameraRef.current) {
                        cameraRef.current.position.y += (targetCameraY.current - cameraRef.current.position.y) * 0.05;
                    }

                    // Smoothly interpolate model position
                    if (modelRef.current) {
                        modelRef.current.position.y += (targetModelY.current - modelRef.current.position.y) * 0.05;
                    }

                    // Update Controls
                    controls.update();

                    // Render Scene
                    renderer.render(sceneRef.current, camera);
                };

                animate();

                setLoading(false);
            }
        };

        init();

        return () => {
            // Cleanup on unmount
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
        };
    }, []);

    // Function to add stars with varying sizes and brightness
    const addStars = () => {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            sizeAttenuation: true
        });

        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        sceneRef.current.add(stars);
    };

    // Function to add orbit paths for planets
    const addOrbitPaths = (scene) => {
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
        planetsRef.current.forEach((planet) => {
            const orbitRadius = planet.orbitalRadius;

            // Validate that orbitRadius is a finite number
            if (!isFinite(orbitRadius) || orbitRadius <= 0) {
                console.warn(`Invalid orbitRadius for planet ${planet.mesh.name}: ${orbitRadius}. Skipping orbit path.`);
                return; // Skip this planet if orbitRadius is invalid
            }

            const segments = 64;
            const orbitGeometry = new THREE.BufferGeometry();
            const orbitVertices = [];
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const x = orbitRadius * Math.cos(theta);
                const z = orbitRadius * Math.sin(theta);

                // Validate that x and z are finite numbers
                if (isFinite(x) && isFinite(z)) {
                    orbitVertices.push(x, 0, z);
                } else {
                    console.warn(`Invalid orbit vertex detected for planet ${planet.mesh.name}: x=${x}, z=${z}. Skipping this vertex.`);
                }
            }

            // Ensure that orbitVertices length is a multiple of 3
            if (orbitVertices.length % 3 !== 0) {
                console.error(`orbitVertices array length for planet ${planet.mesh.name} is not a multiple of 3.`);
            }

            orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));
            const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
            scene.add(orbitLine);
        });
    };

    // Function to add planets with enhanced features
    const addPlanets = (scene) => {
        const textureLoader = new THREE.TextureLoader();

        // Define planet data
        const planets = [
            {
                name: 'Mercury',
                size: 0.5,
                orbitalRadius: 8,
                orbitalSpeed: 0.02, // Adjusted speed
                rotationSpeed: 0.04,
                texture: '/texture/mercury.jpg'
            },
            {
                name: 'Venus',
                size: 0.6,
                orbitalRadius: 12,
                orbitalSpeed: 0.015, // Adjusted speed
                rotationSpeed: 0.02,
                texture: '/texture/venus.jpg',
                atmosphere: {
                    color: 0xffa07a,
                    size: 0.65,
                    opacity: 0.3
                }
            },
            {
                name: 'Earth',
                size: 0.7,
                orbitalRadius: 16,
                orbitalSpeed: 0.01, // Adjusted speed
                rotationSpeed: 0.03,
                texture: '/texture/earth.jpg',
                clouds: {
                    texture: '/texture/earth_clouds.png',
                    size: 0.75,
                    opacity: 0.5
                }
            },
            {
                name: 'Mars',
                size: 0.5,
                orbitalRadius: 20,
                orbitalSpeed: 0.008, // Adjusted speed
                rotationSpeed: 0.025,
                texture: '/texture/mars.jpg'
            },
            {
                name: 'Jupiter',
                size: 1.2,
                orbitalRadius: 24,
                orbitalSpeed: 0.005, // Adjusted speed
                rotationSpeed: 0.04,
                texture: '/texture/jupiter.jpg'
            },
            {
                name: 'Saturn',
                size: 1.0,
                orbitalRadius: 28,
                orbitalSpeed: 0.004, // Adjusted speed
                rotationSpeed: 0.035,
                texture: '/texture/saturn.jpg',
                ring: {
                    innerRadius: 1.2,
                    outerRadius: 2.5,
                    texture: '/texture/saturn_ring.png'
                }
            },
            {
                name: 'Uranus',
                size: 0.9,
                orbitalRadius: 32,
                orbitalSpeed: 0.003, // Adjusted speed
                rotationSpeed: 0.02,
                texture: '/texture/uranus.jpg'
            },
            {
                name: 'Neptune',
                size: 0.85,
                orbitalRadius: 36,
                orbitalSpeed: 0.0025, // Adjusted speed
                rotationSpeed: 0.018,
                texture: '/texture/neptune.jpg'
            }
        ];

        planets.forEach((planetData) => {
            // Create pivot for orbit
            const orbit = new THREE.Object3D();
            // Random initial rotation to avoid alignment
            const initialAngle = Math.random() * Math.PI * 2;
            orbit.rotation.y = initialAngle;
            scene.add(orbit);

            // Create planet mesh
            const planetGeometry = new THREE.SphereGeometry(planetData.size, 64, 64);
            const planetMaterial = new THREE.MeshStandardMaterial({
                map: textureLoader.load(planetData.texture),
                metalness: 0.0,
                roughness: 1.0
            });
            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            planetMesh.castShadow = true;
            planetMesh.receiveShadow = true;
            planetMesh.position.set(planetData.orbitalRadius, 0, 0);
            orbit.add(planetMesh);

            // Add atmosphere glow if applicable
            if (planetData.atmosphere) {
                const atmosphereGeometry = new THREE.SphereGeometry(planetData.atmosphere.size, 64, 64);
                const atmosphereMaterial = new THREE.MeshBasicMaterial({
                    color: planetData.atmosphere.color,
                    side: THREE.BackSide,
                    transparent: true,
                    opacity: planetData.atmosphere.opacity
                });
                const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
                atmosphereMesh.name = 'atmosphereMesh'; // Assign a name for reference
                planetMesh.add(atmosphereMesh);
            }

            // Add cloud layer if applicable
            if (planetData.clouds) {
                const cloudGeometry = new THREE.SphereGeometry(planetData.clouds.size, 64, 64);
                const cloudMaterial = new THREE.MeshStandardMaterial({
                    map: textureLoader.load(planetData.clouds.texture),
                    transparent: true,
                    opacity: planetData.clouds.opacity,
                    depthWrite: false
                });
                const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
                cloudMesh.name = 'cloudMesh'; // Assign a name for reference
                planetMesh.add(cloudMesh);
            }

            // Add rings if applicable
            if (planetData.ring) {
                const ringGeometry = new THREE.RingGeometry(
                    planetData.ring.innerRadius,
                    planetData.ring.outerRadius,
                    64
                );
                const ringMaterial = new THREE.MeshStandardMaterial({
                    map: textureLoader.load(planetData.ring.texture),
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                ringMesh.rotation.x = Math.PI / 2;
                ringMesh.name = 'ringMesh'; // Assign a name for reference
                planetMesh.add(ringMesh);
            }

            // Store planet reference for animation
            planetsRef.current.push({
                mesh: planetMesh,
                orbit: orbit,
                orbitalSpeed: planetData.orbitalSpeed,
                rotationSpeed: planetData.rotationSpeed,
                clouds: planetData.clouds ? planetMesh.children.find(child => child.name === 'cloudMesh') : null
            });
        });
    };

    return <LoaderContainer loading={loading} ref={refContainer} />;
}
