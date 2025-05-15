
        // 🚢 Three.js Titanic Scene with Enhanced Animations
        // =============================================
        // JavaScript Initialization
        // =============================================
        document.addEventListener('DOMContentLoaded', function() {
            // =============================================
            // 1. INITIALIZATION AND ERROR CHECKING
            // =============================================
            
            // Check if Three.js is loaded properly
            if (!THREE) {
                console.error('Three.js not loaded!');
                document.getElementById('result').textContent = "3D library failed to load";
                return;
            }

            // =============================================
            // 2. SCENE SETUP WITH FOG
            // =============================================
            
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x001d3d);
            scene.fog = new THREE.FogExp2(0x001d3d, 0.003);
            
            // =============================================
            // 3. CAMERA CONFIGURATION
            // =============================================
            
            const camera = new THREE.PerspectiveCamera(
                60,                           
                window.innerWidth / window.innerHeight,
                0.1,                          
                10000                         
            );
            
            // Store initial camera position for resetX: -131.69, Y: 45.22, Z: 55.80

            const initialCameraPosition = new THREE.Vector3(-131, 45, 55.5);
            camera.position.copy(initialCameraPosition);
            camera.lookAt(0, 0, 0);
            
            // Variables for camera animation
            let isCameraAnimating = false;
            let cameraAnimationProgress = 0;
            const cameraAnimationDuration = 1.5; // seconds
            let cameraStartPosition = new THREE.Vector3();
            let cameraTargetPosition = new THREE.Vector3(30, 15, 40); // Close-up position
            
            // =============================================
            // 4. RENDERER SETUP
            // =============================================
            
            const canvas = document.getElementById('three-canvas');
            if (!canvas) {
                console.error('Canvas element not found!');
                return;
            }
            
            const renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                antialias: true 
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;
            renderer.setClearColor(scene.fog.color);
            
            // =============================================
            // 5. HDRI ENVIRONMENT LIGHTING
            // =============================================
            
            function setupHDREnvironment() {
                const rgbeLoader = new THREE.RGBELoader();
                
                rgbeLoader.load(
                    './static/models/NightSkyHDRI003_2K-HDR.hdr',
                    function(texture) {
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        scene.background = texture;
                        scene.environment = texture;
                        renderer.toneMapping = THREE.ACESFilmicToneMapping;
                        renderer.toneMappingExposure = 0.8;
                        console.log('HDRI environment loaded successfully');
                    },
                    undefined,
                    function(error) {
                        console.error('Error loading HDRI environment:', error);
                        const ambientLight = new THREE.AmbientLight(0x404040);
                        scene.add(ambientLight);
                        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                        directionalLight.position.set(1, 1, 1);
                        scene.add(directionalLight);
                    }
                );
            }
            
            setupHDREnvironment();
            
            // =============================================
            // 6. OCEAN MODEL WITH ANIMATION
            // =============================================
            
            let oceanMixer = null;
            const oceanLoader = new THREE.GLTFLoader();
            
            oceanLoader.load(
                './static/models/free_ocean_wave_animation_ggg.glb',
                function (gltf) {
                    const ocean = gltf.scene;
                    ocean.position.set(0, -25, 0);
                    ocean.scale.set(1.75, 1.75, 1.75);
                    scene.add(ocean);
                    
                    if (gltf.animations && gltf.animations.length > 0) {
                        oceanMixer = new THREE.AnimationMixer(ocean);
                        gltf.animations.forEach((clip) => {
                            const action = oceanMixer.clipAction(clip);
                            action.play();
                        });
                    }
                },
                undefined,
                function (error) {
                    console.error('Error loading ocean model:', error);
                }
            );
            
            const oceanClock = new THREE.Clock();
            
            // =============================================
            // 7. ICEBERG AND GLACIER MODELS
            // =============================================
            
            const icebergLoader = new THREE.GLTFLoader();
            icebergLoader.load(
                './static/models/ice_berg.glb',
                function (gltf) {
                    const iceberg = gltf.scene;
                    iceberg.position.set(-5, -3, 0);
                    iceberg.scale.set(1.75, 1.75, 1.75);
                    scene.add(iceberg);
                    
                    const glacierLoader = new THREE.GLTFLoader();
                    glacierLoader.load(
                        './static/models/ice_glacier.glb',
                        function (gltf) {
                            const glacier = gltf.scene;
                            glacier.position.set(-65, -15, -20);
                            glacier.scale.set(4, 4, 4);
                            glacier.rotation.set(0, Math.PI / 4, 0);
                            scene.add(glacier);
                        },
                        undefined,
                        function (error) {
                            console.error('Error loading glacier:', error);
                        }
                    );
                },
                undefined,
                function (error) {
                    console.error('Error loading iceberg:', error);
                }
            );
            
            // =============================================
            // 8. DEBUGGING HELPERS
            // =============================================
            
            const axesHelper = new THREE.AxesHelper(5);
            scene.add(axesHelper);
            
            // =============================================
            // 9. MOON MODEL AND LIGHTING
            // =============================================
            
            const moonLoader = new THREE.GLTFLoader();
            moonLoader.load(
                './static/models/moon.glb',
                function (gltf) {
                    const moon = gltf.scene;
                    moon.position.set(85, 75, 55);
                    moon.scale.set(5, 5, 5);
                    scene.add(moon);
                    
                    const moonLight = new THREE.PointLight(0xffffff, 2, 200);
                    moonLight.position.copy(moon.position);
                    scene.add(moonLight);
                    
                    const moonAmbient = new THREE.AmbientLight(0x4040a0, 0.3);
                    scene.add(moonAmbient);
                },
                undefined,
                function (error) {
                    console.error('Error loading moon model:', error);
                    const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
                    const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
                    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                    moon.position.set(0, 50, 25);
                    scene.add(moon);
                    
                    const moonLight = new THREE.PointLight(0xffffff, 2, 200);
                    moonLight.position.copy(moon.position);
                    scene.add(moonLight);
                    
                    const moonAmbient = new THREE.AmbientLight(0x4040a0, 0.3);
                    scene.add(moonAmbient);
                }
            );
            
            // =============================================
            // 10. SHIP MODEL WITH ENHANCED ANIMATIONS
            // =============================================
            
            let ship;
            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();
            let isShipAnimating = true; // Control flag for ship animation
            
            // Enhanced ship animation parameters
            const shipAnimationParams = {
                bobHeight: 2,        // Height of bobbing motion
                bobSpeed: 0.65,        // Speed of bobbing
                rollAmount: 0.1,       // Amount of side-to-side rolling
                rollSpeed: 0.3,       // Speed of rolling
                pitchAmount: 0.05,     // Amount of front-to-back pitching
                pitchSpeed: 0.2       // Speed of pitching
            };
            
            // Create the ship popup
            const popup = document.createElement('div');
            popup.id = 'ship-popup';
            popup.innerHTML = `
                <div class="prediction-container">
            <h2 style ="color: #004071;">Titanic Survival Predictor</h2>
            <form id="prediction-form">
                <div class="form-group">
                    <label for="pclass">Passenger Class:</label>
                    <select id="pclass" name="pclass" required>
                        <option value="1">1st Class</option>
                        <option value="2">2nd Class</option>
                        <option value="3">3rd Class</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="sex">Gender:</label>
                    <select id="sex" name="sex" required>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="age">Age:</label>
                    <input type="number" id="age" name="age" required>
                </div>
                
                <div class="form-group">
                    <label for="sibsp">Number of Siblings/Spouses:</label>
                    <input type="number" id="sibsp" name="sibsp" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="parch">Number of Parents/Children:</label>
                    <input type="number" id="parch" name="parch" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="fare">Fare Paid:</label>
                    <input type="number" step="0.01" id="fare" name="fare" required>
                </div>
                
                <div class="form-group">
                    <label for="embarked">Embarked From:</label>
                    <select id="embarked" name="embarked" required>
                        <option value="C">Cherbourg</option>
                        <option value="Q">Queenstown</option>
                        <option value="S">Southampton</option>
                    </select>
                </div>
                
                <button type="submit">Predict Survival</button>
            </form>
            <br/>
            <div id="prediction-result" class="hidden">
                <h3>Prediction Result</h3>
                <p>Survival Prediction: <span id="survival-prediction"></span></p>
                <p>Probability: <span id="survival-probability"></span></p>
            </div>
        </div>
        <br/>
                <button id="close-popup">Close</button>
            `;
            document.body.appendChild(popup);
            
            // Close popup handler
            document.getElementById('close-popup').addEventListener('click', function() {
                popup.style.display = 'none';
                
                // Reset camera position when closing popup
                isCameraAnimating = true;
                cameraStartPosition.copy(camera.position);
                cameraTargetPosition.copy(initialCameraPosition);
                cameraAnimationProgress = 0;
                
                // Resume ship animation
                isShipAnimating = true;
            });
            
            try {
                const loader = new THREE.GLTFLoader();
                const modelPath = './static/models/Untitled.glb';
                
                loader.load(
                    modelPath,
                    function (gltf) {
                        ship = gltf.scene;
                        ship.scale.set(0.27, 0.27, 0.27);
                        ship.position.set(0, 0, 25);
                        ship.rotation.y = Math.PI - (Math.PI / 4);
                        
                        // Store original position for animation reference
                        ship.originalPosition = ship.position.clone();
                        ship.time = 0;
                        scene.add(ship);
                        scene.remove(axesHelper);
                        
                        // Click handler for ship selection
                        canvas.addEventListener('click', function(event) {
                            // Calculate mouse position
                            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
                            
                            raycaster.setFromCamera(mouse, camera);
                            const intersects = raycaster.intersectObject(ship, true);
                            
                            if (intersects.length > 0) {
                                // Show popup
                                popup.style.display = 'block';
                                
                                // Start camera animation
                                isCameraAnimating = true;
                                cameraStartPosition.copy(camera.position);
                                //Camera Position: X: 37.76, Y: 26.56, Z: 100.70
                                cameraTargetPosition.set(55,45,120);
                                cameraAnimationProgress = 0;
                                
                                // Pause ship animation
                                isShipAnimating = false;
                                
                                event.stopPropagation();
                            } else if (popup.style.display === 'block' && !popup.contains(event.target)) {
                                popup.style.display = 'none';
                                
                                // Reset camera position
                                isCameraAnimating = true;
                                cameraStartPosition.copy(camera.position);
                                cameraTargetPosition.copy(initialCameraPosition);
                                cameraAnimationProgress = 0;
                                
                                // Resume ship animation
                                isShipAnimating = true;
                            }
                        });
                        
                        document.getElementById('result').textContent = "Model loaded successfully!";
                    },
                    undefined,
                    function (error) {
                        console.error('Error loading model:', error);
                        document.getElementById('result').textContent = "Error loading 3D model";
                        
                        // Add placeholder cube
                        const geometry = new THREE.BoxGeometry(2, 2, 5);
                        const material = new THREE.MeshBasicMaterial({ 
                            color: 0xff0000,
                            wireframe: true 
                        });
                        const cube = new THREE.Mesh(geometry, material);
                        cube.position.y = 1;
                        scene.add(cube);
                    }
                );
            } catch (e) {
                console.error('GLTFLoader error:', e);
            }
            
            // =============================================
            // 11. ORBIT CONTROLS
            // =============================================
            
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minDistance = 5;
            controls.maxDistance = 200;
            controls.maxPolarAngle = Math.PI/2;
            
            // =============================================
            // 12. MODEL POSITIONING CONTROLS
            // =============================================
            
            let isPositioningMode = false;
            const positionSpeed = 0.05;
            const positionState = {
                forward: false,
                backward: false,
                left: false,
                right: false,
                up: false,
                down: false
            };

            document.addEventListener('keydown', (event) => {
                if (event.key.toLowerCase() === 'p') {
                    isPositioningMode = !isPositioningMode;
                    document.getElementById('positioning-status').textContent = 
                        `Positioning Mode: ${isPositioningMode ? 'ON' : 'OFF'}`;
                }

                if (!isPositioningMode) return;

                switch(event.key.toLowerCase()) {
                    case 'w': positionState.forward = true; break;
                    case 's': positionState.backward = true; break;
                    case 'a': positionState.left = true; break;
                    case 'd': positionState.right = true; break;
                    case 'q': positionState.up = true; break;
                    case 'e': positionState.down = true; break;
                    case 'r': 
                        if (ship) {
                            ship.position.set(0, 1, 0);
                            updatePositionDisplay();
                        }
                        break;
                }
            });

            document.addEventListener('keyup', (event) => {
                if (!isPositioningMode) return;
                switch(event.key.toLowerCase()) {
                    case 'w': positionState.forward = false; break;
                    case 's': positionState.backward = false; break;
                    case 'a': positionState.left = false; break;
                    case 'd': positionState.right = false; break;
                    case 'q': positionState.up = false; break;
                    case 'e': positionState.down = false; break;
                }
            });

            
            // =============================================
            // 13. MAIN ANIMATION LOOP
            // =============================================
            
            function animate() {
                requestAnimationFrame(animate);
                
                const delta = oceanClock.getDelta();
                
                // Update ocean animations
                if (oceanMixer) {
                    oceanMixer.update(delta);
                }
                
                // Update enhanced ship animation
                if (ship && isShipAnimating) {
                    ship.time += delta;
                    
                    // Enhanced bobbing animation (up/down)
                    ship.position.y = ship.originalPosition.y + 
                        Math.sin(ship.time * shipAnimationParams.bobSpeed) * shipAnimationParams.bobHeight;
                    
                    // Rolling animation (side-to-side)
                    ship.rotation.z = Math.sin(ship.time * shipAnimationParams.rollSpeed) * shipAnimationParams.rollAmount;
                    
                    // Pitching animation (front-to-back)
                    ship.rotation.x = Math.sin(ship.time * shipAnimationParams.pitchSpeed * 0.7) * shipAnimationParams.pitchAmount;
                }
                
                // ✅ Smooth orbit around the ship when popup is open
                if (popup.style.display === 'block') {
                    const radius = 100;
                    const angle = Date.now() * 0.0002; // Slow rotation

                    const x = ship.position.x + radius * Math.cos(angle);
                    const z = ship.position.z + radius * Math.sin(angle);
                    const y = camera.position.y; // Keep current height

    camera.position.set(x, y, z);
    camera.lookAt(ship.position);
}

                // Handle camera animation
                if (isCameraAnimating) {
                    cameraAnimationProgress += delta / cameraAnimationDuration;
                    
                    if (cameraAnimationProgress >= 1) {
                        cameraAnimationProgress = 1;
                        isCameraAnimating = false;
                    }
                    
                    // Smooth easing function
                    const easing = function(t) {
                        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                    };
                    
                    const easedProgress = easing(cameraAnimationProgress);
                    
                    // Interpolate camera position
                    camera.position.lerpVectors(
                        cameraStartPosition,
                        cameraTargetPosition,
                        easedProgress
                    );
                    
                    // Make camera look at ship during animation
                    if (ship) {
                        camera.lookAt(ship.position);
                    }
                }
                
                // Update controls
                controls.update();
                
                // Update model position in positioning mode
                if (isPositioningMode && ship) {
                    if (positionState.forward) ship.position.z -= positionSpeed;
                    if (positionState.backward) ship.position.z += positionSpeed;
                    if (positionState.left) ship.position.x -= positionSpeed;
                    if (positionState.right) ship.position.x += positionSpeed;
                    if (positionState.up) ship.position.y += positionSpeed;
                    if (positionState.down) ship.position.y -= positionSpeed;
                }
                
                renderer.render(scene, camera);
            }
            animate();
            
            // =============================================
            // 14. WINDOW RESIZE HANDLER
            // =============================================
            
            window.addEventListener('resize', function() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        });
        document.getElementById("prediction-form").addEventListener("submit", function(event) {
            event.preventDefault();
        
            const data = {
                Pclass: document.getElementById("pclass").value,
                Sex: document.getElementById("sex").value,
                Age: document.getElementById("age").value,
                SibSp: document.getElementById("sibsp").value,
                Parch: document.getElementById("parch").value,
                Fare: document.getElementById("fare").value,
                Embarked: document.getElementById("embarked").value
            };
        
            fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(response => {
                if (response.prediction !== undefined) {
                    const msg = response.prediction === 1 ? "🎉 Survived" : "💀 Not Survived";
                    document.getElementById("survival-prediction").textContent = msg;
                    document.getElementById("survival-probability").textContent = response.probability;
                    document.getElementById("prediction-result").classList.remove("hidden");
                } else {
                    alert("Prediction error");
                }
            })
            .catch(err => {
                console.error("Request failed", err);
                alert("An error occurred");
            });
        });
        document.addEventListener("DOMContentLoaded", function() {
            const form = document.getElementById("prediction-form");
        
            if (form) {
                form.addEventListener("submit", function(event) {
                    event.preventDefault(); // 🛑 Prevent form reload
        
                    const data = {
                        Pclass: document.getElementById("pclass").value,
                        Sex: document.getElementById("sex").value,
                        Age: document.getElementById("age").value,
                        SibSp: document.getElementById("sibsp").value,
                        Parch: document.getElementById("parch").value,
                        Fare: document.getElementById("fare").value,
                        Embarked: document.getElementById("embarked").value
                    };
        
                    fetch('/predict', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                    .then(res => res.json())
                    .then(response => {
                        if (response.prediction !== undefined) {
                            const msg = response.prediction === 1 ? "🎉 Survived" : "💀 Not Survived";
                            document.getElementById("survival-prediction").textContent = msg;
                            document.getElementById("survival-probability").textContent = response.probability;
                            document.getElementById("prediction-result").classList.remove("hidden");
                        } else {
                            alert("Prediction error.");
                        }
                    })
                    .catch(err => {
                        console.error("Prediction failed:", err);
                        alert("An error occurred.");
                    });
                });
            }
        });