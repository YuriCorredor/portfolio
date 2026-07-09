import { useEffect, useState, useRef } from 'react';
import { LoaderContainer } from './threeD/Loader';
import ModelLoader from '../../lib/ModelLoader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PLANETS = [
    { name: 'Mercury', size: 0.5, orbitalRadius: 8, orbitalSpeed: 0.02, rotationSpeed: 0.04, texture: '/texture/mercury.jpg' },
    {
        name: 'Venus', size: 0.6, orbitalRadius: 12, orbitalSpeed: 0.015, rotationSpeed: 0.02, texture: '/texture/venus.jpg',
        atmosphere: { color: 0xffa07a, size: 0.65, opacity: 0.3 }
    },
    {
        name: 'Earth', size: 0.7, orbitalRadius: 16, orbitalSpeed: 0.01, rotationSpeed: 0.03, texture: '/texture/earth.jpg',
        atmosphere: { color: 0x6699ff, size: 0.76, opacity: 0.25 }
    },
    { name: 'Mars', size: 0.5, orbitalRadius: 20, orbitalSpeed: 0.008, rotationSpeed: 0.025, texture: '/texture/mars.jpg' },
    { name: 'Jupiter', size: 1.2, orbitalRadius: 26, orbitalSpeed: 0.005, rotationSpeed: 0.04, texture: '/texture/jupiter.jpg' },
    {
        name: 'Saturn', size: 1.0, orbitalRadius: 30, orbitalSpeed: 0.004, rotationSpeed: 0.035, texture: '/texture/saturn.jpg',
        ring: { innerRadius: 1.2, outerRadius: 2.5, texture: '/texture/saturn_ring.png' }
    },
    { name: 'Uranus', size: 0.9, orbitalRadius: 34, orbitalSpeed: 0.003, rotationSpeed: 0.02, texture: '/texture/uranus.jpg' },
    { name: 'Neptune', size: 0.85, orbitalRadius: 38, orbitalSpeed: 0.0025, rotationSpeed: 0.018, texture: '/texture/neptune.jpg' }
];

// Radial gradient sprite texture used for nebula glows and shooting star heads
const createGlowTexture = (innerColor, outerColor = 'rgba(0,0,0,0)') => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
};

export default function ThreeD() {
    const refContainer = useRef();
    const mixerRef = useRef();
    const modelRef = useRef();
    const sceneRef = useRef();
    const cameraRef = useRef();
    const rendererRef = useRef();
    const controlsRef = useRef();
    const [loading, setLoading] = useState(true);

    const planetsRef = useRef([]);
    const starLayersRef = useRef([]);
    const asteroidBeltRef = useRef();
    const galaxiesRef = useRef([]);
    const meteorsRef = useRef([]);
    const ufoRef = useRef(null);
    const requestRef = useRef();

    const mouse = useRef({ x: 0, y: 0 });
    // Reclined "lost in space" pose: visor toward the camera, gentle drift on y
    const modelBaseRotation = useRef({ x: -0.6, y: 0.4, z: 0.2 });

    // Target positions for smooth interpolation. The camera rests slightly
    // above the orbital plane so belts/orbits read as ellipses, not lines.
    const CAMERA_BASE_Y = 3;
    // Slightly below the orbit plane so the astronaut reads as screen-centered
    // from the camera's elevated viewpoint.
    const MODEL_BASE_Y = -1.4;
    const targetCameraY = useRef(CAMERA_BASE_Y);
    const targetModel = useRef({ x: 0, y: MODEL_BASE_Y, z: 0 });

    const handleMouseMove = (event) => {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Ease the astronaut toward a mouse-driven target instead of accumulating
    // rotation every frame, so it reacts to the cursor without drifting away.
    const updateModel = (model, deltaTime) => {
        model.rotation.y += deltaTime / 25;

        const targetX = modelBaseRotation.current.x + mouse.current.y * 0.25;
        const targetZ = modelBaseRotation.current.z + mouse.current.x * 0.25;
        model.rotation.x += (targetX - model.rotation.x) * 0.04;
        model.rotation.z += (targetZ - model.rotation.z) * 0.04;
    };

    const handleWindowResize = () => {
        const container = refContainer.current;
        const renderer = rendererRef.current;
        const camera = cameraRef.current;
        if (container && renderer && camera) {
            renderer.setSize(container.clientWidth, container.clientHeight);
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        }
    };

    const handleWindowScroll = () => {
        const t = window.scrollY;
        targetCameraY.current = CAMERA_BASE_Y - t * 0.004;
        // The astronaut starts centered and drifts up, sideways and away into
        // deep space as the page scrolls — genuinely "lost in space".
        targetModel.current = {
            x: t * 0.01,
            y: MODEL_BASE_Y + t * 0.006,
            z: -t * 0.035
        };
    };

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

    useEffect(() => {
        const init = async () => {
            const container = refContainer.current;
            if (!container || rendererRef.current) return;

            const scene = new THREE.Scene();
            sceneRef.current = scene;

            const screenW = container.clientWidth;
            const screenH = container.clientHeight;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.physicallyCorrectLights = true;
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.setSize(screenW, screenH);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            const camera = new THREE.PerspectiveCamera(60, screenW / screenH, 0.1, 1000);
            camera.position.set(0, CAMERA_BASE_Y, 11);
            cameraRef.current = camera;
            scene.add(camera);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enablePan = false;
            controls.enableZoom = false; // keep the mouse wheel free for page scrolling
            controlsRef.current = controls;

            addLights(scene);
            addStars(scene);
            addNebulae(scene);
            addGalaxies(scene);

            const { mixer, model } = await ModelLoader(scene, mixerRef.current, '/astronaut/scene.gltf', {
                castShadow: true,
                receiveShadow: true,
                scalar: 0.75,
                timeScale: 1 / 25
            });

            model.rotation.set(modelBaseRotation.current.x, modelBaseRotation.current.y, modelBaseRotation.current.z);
            mixerRef.current = mixer;
            modelRef.current = model;

            addPlanets(scene);
            addOrbitPaths(scene);
            addAsteroidBelt(scene);
            addMeteors(scene);
            addUfo(scene);

            const clock = new THREE.Clock();
            let previousTime = 0;

            const animate = () => {
                requestRef.current = requestAnimationFrame(animate);

                const elapsedTime = clock.getElapsedTime();
                const deltaTime = elapsedTime - previousTime;
                previousTime = elapsedTime;

                if (mixerRef.current) mixerRef.current.update(deltaTime);
                if (modelRef.current) {
                    updateModel(modelRef.current, deltaTime);
                    const pos = modelRef.current.position;
                    pos.x += (targetModel.current.x - pos.x) * 0.05;
                    pos.y += (targetModel.current.y - pos.y) * 0.05;
                    pos.z += (targetModel.current.z - pos.z) * 0.05;
                }

                planetsRef.current.forEach((planet) => {
                    planet.orbit.rotation.y += planet.orbitalSpeed * deltaTime;
                    planet.mesh.rotation.y += planet.rotationSpeed * deltaTime;
                });

                // Slow counter-rotating star layers create a parallax depth effect
                starLayersRef.current.forEach((layer, i) => {
                    layer.rotation.y += (i % 2 === 0 ? 1 : -1) * 0.004 * deltaTime;
                });

                if (asteroidBeltRef.current) {
                    asteroidBeltRef.current.rotation.y += 0.006 * deltaTime;
                }

                // Spin each galaxy disc around its own axis (the tilt lives on the parent group)
                galaxiesRef.current.forEach((galaxy) => {
                    galaxy.rotation.y += 0.012 * deltaTime;
                });

                updateMeteors(deltaTime, elapsedTime);
                updateUfo(deltaTime, elapsedTime);

                camera.position.y += (targetCameraY.current - camera.position.y) * 0.05;

                controls.update();
                renderer.render(scene, camera);
            };

            animate();
            setLoading(false);
        };

        init();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (controlsRef.current) controlsRef.current.dispose();
            if (sceneRef.current) {
                sceneRef.current.traverse((obj) => {
                    if (obj.geometry) obj.geometry.dispose();
                    if (obj.material) {
                        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                        materials.forEach((material) => {
                            if (material.map) material.map.dispose();
                            material.dispose();
                        });
                    }
                });
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (rendererRef.current.domElement.parentNode) {
                    rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current = null;
            }
        };
    }, []);

    const addLights = (scene) => {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        // Key light
        const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.1);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Cool rim lights for a more cinematic space look
        const blueRim = new THREE.DirectionalLight(0x4466ff, 0.6);
        blueRim.position.set(-10, 4, -8);
        scene.add(blueRim);

        const purpleRim = new THREE.DirectionalLight(0xaa44ff, 0.4);
        purpleRim.position.set(8, -6, -10);
        scene.add(purpleRim);

        // Warm core light so orbiting planets are lit from the center
        const coreLight = new THREE.PointLight(0xfff0dd, 0.8, 120);
        scene.add(coreLight);
    };

    // Layered star field: three shells of varying size/brightness for depth
    const addStars = (scene) => {
        const layers = [
            { count: 4500, size: 0.15, spread: 2000, color: 0xffffff, opacity: 0.9 },
            { count: 2500, size: 0.35, spread: 1200, color: 0xbfd4ff, opacity: 0.8 },
            { count: 800, size: 0.7, spread: 700, color: 0xffe9c4, opacity: 0.7 }
        ];

        layers.forEach(({ count, size, spread, color, opacity }) => {
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            for (let i = 0; i < count; i++) {
                vertices.push(
                    (Math.random() - 0.5) * spread,
                    (Math.random() - 0.5) * spread,
                    (Math.random() - 0.5) * spread
                );
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            const material = new THREE.PointsMaterial({
                color,
                size,
                sizeAttenuation: true,
                transparent: true,
                opacity,
                depthWrite: false
            });

            const stars = new THREE.Points(geometry, material);
            scene.add(stars);
            starLayersRef.current.push(stars);
        });
    };

    // Big soft additive glows far behind everything to tint the void
    const addNebulae = (scene) => {
        const nebulae = [
            { color: 'rgba(90, 60, 200, 0.35)', position: [-180, 60, -320], scale: 420 },
            { color: 'rgba(40, 120, 220, 0.3)', position: [220, -80, -380], scale: 500 },
            { color: 'rgba(200, 60, 140, 0.18)', position: [40, 160, -420], scale: 360 }
        ];

        nebulae.forEach(({ color, position, scale }) => {
            const material = new THREE.SpriteMaterial({
                map: createGlowTexture(color),
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(material);
            sprite.position.set(...position);
            sprite.scale.setScalar(scale);
            scene.add(sprite);
        });
    };

    // Procedural spiral galaxies: points distributed along spiral arms with a
    // warm core fading to a cool rim, placed far behind the solar system.
    const addGalaxies = (scene) => {
        const makeGalaxy = ({ count, radius, branches, spin, randomness, insideColor, outsideColor, size, position, tilt, opacity }) => {
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const colorInside = new THREE.Color(insideColor);
            const colorOutside = new THREE.Color(outsideColor);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const r = Math.pow(Math.random(), 1.5) * radius;
                const branchAngle = ((i % branches) / branches) * Math.PI * 2;
                const spinAngle = (r / radius) * spin;

                const randomOffset = () =>
                    Math.pow(Math.random(), 2.5) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

                positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomOffset();
                positions[i3 + 1] = randomOffset() * 0.3;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomOffset();

                const mixedColor = colorInside.clone().lerp(colorOutside, r / radius);
                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size,
                sizeAttenuation: true,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity,
                depthWrite: false
            });

            const disc = new THREE.Points(geometry, material);

            // Bright core glow at the center of the disc
            const coreMaterial = new THREE.SpriteMaterial({
                map: createGlowTexture('rgba(255, 220, 180, 0.9)'),
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthWrite: false
            });
            const core = new THREE.Sprite(coreMaterial);
            core.scale.setScalar(radius * 0.5);
            disc.add(core);

            const pivot = new THREE.Group();
            pivot.rotation.set(...tilt);
            pivot.position.set(...position);
            pivot.add(disc);
            scene.add(pivot);

            galaxiesRef.current.push(disc);
        };

        makeGalaxy({
            count: 7000,
            radius: 90,
            branches: 4,
            spin: 5,
            randomness: 0.25,
            insideColor: 0xffc98a,
            outsideColor: 0x6a5bff,
            size: 1.1,
            opacity: 0.85,
            position: [-220, 110, -340],
            tilt: [1.1, 0.25, 0.5]
        });

        makeGalaxy({
            count: 4500,
            radius: 55,
            branches: 3,
            spin: 6,
            randomness: 0.3,
            insideColor: 0xffe0f0,
            outsideColor: 0x3fb8c9,
            size: 0.9,
            opacity: 0.7,
            position: [260, -70, -420],
            tilt: [0.7, -0.4, -0.3]
        });
    };

    const addOrbitPaths = (scene) => {
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.08
        });

        planetsRef.current.forEach((planet) => {
            const segments = 128;
            const vertices = [];
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                vertices.push(planet.orbitalRadius * Math.cos(theta), 0, planet.orbitalRadius * Math.sin(theta));
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            scene.add(new THREE.LineLoop(geometry, orbitMaterial));
        });
    };

    const addPlanets = (scene) => {
        const textureLoader = new THREE.TextureLoader();
        const loadTexture = (path) => {
            const texture = textureLoader.load(path);
            texture.encoding = THREE.sRGBEncoding;
            return texture;
        };

        PLANETS.forEach((planetData) => {
            const orbit = new THREE.Object3D();
            orbit.rotation.y = Math.random() * Math.PI * 2;
            scene.add(orbit);

            const planetGeometry = new THREE.SphereGeometry(planetData.size, 48, 48);
            const planetMaterial = new THREE.MeshStandardMaterial({
                map: loadTexture(planetData.texture),
                metalness: 0.0,
                roughness: 1.0
            });
            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            planetMesh.castShadow = true;
            planetMesh.receiveShadow = true;
            planetMesh.position.set(planetData.orbitalRadius, 0, 0);
            orbit.add(planetMesh);

            if (planetData.atmosphere) {
                const atmosphereGeometry = new THREE.SphereGeometry(planetData.atmosphere.size, 48, 48);
                const atmosphereMaterial = new THREE.MeshBasicMaterial({
                    color: planetData.atmosphere.color,
                    side: THREE.BackSide,
                    transparent: true,
                    opacity: planetData.atmosphere.opacity,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                planetMesh.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));
            }

            if (planetData.ring) {
                const ringGeometry = new THREE.RingGeometry(planetData.ring.innerRadius, planetData.ring.outerRadius, 64);
                const ringMaterial = new THREE.MeshStandardMaterial({
                    map: loadTexture(planetData.ring.texture),
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                ringMesh.rotation.x = Math.PI / 2.2;
                planetMesh.add(ringMesh);
            }

            planetsRef.current.push({
                mesh: planetMesh,
                orbit,
                orbitalRadius: planetData.orbitalRadius,
                orbitalSpeed: planetData.orbitalSpeed,
                rotationSpeed: planetData.rotationSpeed
            });
        });
    };

    // Instanced asteroid belt between Mars and Jupiter
    const addAsteroidBelt = (scene) => {
        const count = 350;
        const geometry = new THREE.DodecahedronGeometry(0.06, 0);
        const material = new THREE.MeshStandardMaterial({ color: 0x5a544c, roughness: 1 });
        const belt = new THREE.InstancedMesh(geometry, material, count);

        const dummy = new THREE.Object3D();
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 22 + (Math.random() - 0.5) * 2.5;
            dummy.position.set(
                radius * Math.cos(angle),
                (Math.random() - 0.5) * 0.8,
                radius * Math.sin(angle)
            );
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            dummy.scale.setScalar(0.3 + Math.random() * 1.0);
            dummy.updateMatrix();
            belt.setMatrixAt(i, dummy.matrix);
        }
        belt.instanceMatrix.needsUpdate = true;

        scene.add(belt);
        asteroidBeltRef.current = belt;
    };

    // Small pool of shooting stars that streak across the far background
    const addMeteors = (scene) => {
        const headTexture = createGlowTexture('rgba(255,255,255,1)');

        for (let i = 0; i < 3; i++) {
            const material = new THREE.SpriteMaterial({
                map: headTexture,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(2.5, 0.5, 1);
            scene.add(sprite);

            meteorsRef.current.push({
                sprite,
                velocity: new THREE.Vector3(),
                life: 0,
                nextLaunch: 3 + Math.random() * 8
            });
        }
    };

    // Procedural flying saucer: metallic hull, glass dome, blinking rim lights
    // and a green under-glow. Wanders slowly around the background on its own.
    const addUfo = (scene) => {
        const group = new THREE.Group();
        group.scale.setScalar(4);

        const hull = new THREE.Mesh(
            new THREE.SphereGeometry(1.6, 32, 16),
            new THREE.MeshStandardMaterial({ color: 0x9aa4b5, metalness: 0.9, roughness: 0.35 })
        );
        hull.scale.y = 0.28;
        group.add(hull);

        const dome = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshStandardMaterial({
                color: 0x66ffcc,
                metalness: 0.2,
                roughness: 0.1,
                emissive: 0x114433,
                transparent: true,
                opacity: 0.75
            })
        );
        dome.position.y = 0.3;
        group.add(dome);

        // Rim bulbs live in their own group so they can spin around the hull
        const rimGroup = new THREE.Group();
        const rimMaterials = [];
        const bulbGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        for (let i = 0; i < 10; i++) {
            const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0x7cff6b });
            const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
            const angle = (i / 10) * Math.PI * 2;
            bulb.position.set(Math.cos(angle) * 1.45, -0.05, Math.sin(angle) * 1.45);
            rimGroup.add(bulb);
            rimMaterials.push(bulbMaterial);
        }
        group.add(rimGroup);

        const glow = new THREE.Sprite(new THREE.SpriteMaterial({
            map: createGlowTexture('rgba(120, 255, 120, 0.7)'),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        }));
        glow.position.y = -0.5;
        glow.scale.setScalar(3.5);
        group.add(glow);

        scene.add(group);

        ufoRef.current = {
            group,
            rimGroup,
            rimMaterials,
            prevX: 0
        };
    };

    // Slow ambient wander: layered sines with incommensurate frequencies trace
    // an organic, never-repeating path around the background, always in frame.
    const updateUfo = (deltaTime, elapsedTime) => {
        const ufo = ufoRef.current;
        if (!ufo) return;
        const { group } = ufo;

        // Blinking rim lights chase around the hull
        ufo.rimGroup.rotation.y += deltaTime * 2.5;
        ufo.rimMaterials.forEach((material, i) => {
            const pulse = 0.5 + 0.5 * Math.sin(elapsedTime * 6 + i * 0.9);
            material.color.setHSL(0.33, 1, 0.35 + pulse * 0.4);
        });

        const t = elapsedTime;
        group.position.x = 45 * Math.sin(t * 0.05) + 20 * Math.sin(t * 0.013 + 2);
        group.position.y = 2 + 9 * Math.sin(t * 0.037 + 1) + 4 * Math.sin(t * 0.09);
        group.position.z = -80 + 18 * Math.sin(t * 0.021 + 4);

        // Bank gently into the horizontal drift
        const velocityX = (group.position.x - ufo.prevX) / Math.max(deltaTime, 0.001);
        ufo.prevX = group.position.x;
        group.rotation.z += (-velocityX * 0.03 - group.rotation.z) * 0.05;
    };

    const updateMeteors = (deltaTime, elapsedTime) => {
        meteorsRef.current.forEach((meteor) => {
            if (meteor.life > 0) {
                meteor.life -= deltaTime;
                meteor.sprite.position.addScaledVector(meteor.velocity, deltaTime);
                meteor.sprite.material.opacity = Math.max(0, Math.min(1, meteor.life));
                if (meteor.life <= 0) {
                    meteor.sprite.material.opacity = 0;
                    meteor.nextLaunch = elapsedTime + 4 + Math.random() * 10;
                }
            } else if (elapsedTime >= meteor.nextLaunch) {
                meteor.life = 1.5 + Math.random();
                meteor.sprite.position.set(
                    (Math.random() - 0.5) * 300,
                    60 + Math.random() * 60,
                    -150 - Math.random() * 100
                );
                meteor.velocity.set(-40 - Math.random() * 40, -25 - Math.random() * 15, 0);
            }
        });
    };

    return <LoaderContainer loading={loading} ref={refContainer} />;
}
