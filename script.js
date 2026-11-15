function changeSlide(direction) {
    const slides = Array.from(document.querySelectorAll('input[name="slider"]'));

    if (!slides.length) return;

    const currentIndex = slides.findIndex(slide => slide.checked);
    const nextIndex = (currentIndex + direction + slides.length) % slides.length;

    slides[nextIndex].checked = true;
}

const slider = document.getElementById('slides');

if (slider) {
    let swipeStartX = null;
    let autoLoop;

    function resetAutoLoop() {
        clearInterval(autoLoop);
        autoLoop = setInterval(() => {
            changeSlide(1);
        }, 4000);
    }

    slider.addEventListener('pointerdown', event => {
        slider.setPointerCapture(event.pointerId);
        swipeStartX = event.clientX;
    });

    slider.addEventListener('pointerup', event => {
        if (swipeStartX === null) return;

        const distance = event.clientX - swipeStartX;

        if (Math.abs(distance) >= 50) {
            changeSlide(distance < 0 ? 1 : -1);
            resetAutoLoop();
        }

        swipeStartX = null;
    });

    slider.addEventListener('pointercancel', () => {
        swipeStartX = null;
    });

    resetAutoLoop();
}

        (() => {
            const viewers = document.querySelectorAll('.new-arrivals-model, .product-3d-model');
            const productPage = document.querySelector('[data-product-page]');
            const products = {
                airdots: {
                    name: 'Airdots 300 Pro',
                    model: 'clip',
                    shell: '#000000',
                    accent: '#f59a1b',
                    price: '$3,999',
                    oldPrice: '$12,999',
                    savings: 'Save 69%',
                    rating: '4.8 (108 reviews)',
                    description: 'Enjoy clear calls and everyday listening with Airdots 300 Pro. Its unique clip design and Quad Mic ENC make it a comfortable, practical companion throughout your day.',
                    highlights: ['Quad Mic ENC', 'Unique Clip Design', 'Multiple Color Options'],
                    specs: [['Design', 'CLIP-ON'], ['Microphones', 'QUAD MIC ENC'], ['Color', 'COLOR OPTIONS']]
                },
                matrix: {
                    name: 'Matrix Airdots 400',
                    model: 'rgb',
                    shell: '#000000',
                    accent: '#2bd4f0',
                    price: '$3,999',
                    oldPrice: '$14,999',
                    savings: 'Save 73%',
                    rating: '4.9 (183 reviews)',
                    description: 'Get responsive wireless audio with Matrix Airdots 400. 45ms low latency and eye-catching RGB lights make these earbuds ready for gaming and everyday listening.',
                    highlights: ['45ms Low Latency', 'RGB Lights', 'Wireless Earbuds'],
                    specs: [['Latency', '45ms LOW LATENCY'], ['Lighting', 'RGB LIGHTS'], ['Color', 'BLACK / WHITE']]
                },
                alpha: {
                    name: 'Alpha Airdots 500',
                    model: 'anc',
                    shell: '#aaaaaa',
                    accent: '#64748b',
                    price: '$499',
                    oldPrice: '$999',
                    savings: 'Save 50%',
                    rating: '4.8 (266 reviews)',
                    description: 'Tune your listening with Alpha Airdots 500. Quad Mic ANC and EQ modes bring flexible sound and clearer listening to your everyday routine.',
                    highlights: ['Quad Mic ANC', 'EQ Modes', 'Multiple Color Options'],
                    specs: [['Microphones', 'QUAD MIC ANC'], ['Sound', 'EQ MODES'], ['Color', 'MULTIPLE OPTIONS']]
                },
                mark: {
                    name: 'Mark Pro',
                    model: 'watch',
                    shell: '#000000',
                    accent: '#ff6a3d',
                    price: '$6,999',
                    oldPrice: '$16,999',
                    savings: 'Save 59%',
                    rating: '4.9 (15 reviews)',
                    description: 'Stay connected with Mark Pro. Bluetooth calling and up to 7 days of backup make this smartwatch a convenient companion throughout the week.',
                    highlights: ['Bluetooth Calling', '7 Days Backup', 'Smartwatch'],
                    specs: [['Calling', 'BLUETOOTH CALLING'], ['Backup', 'UP TO 7 DAYS'], ['Color', 'MULTIPLE OPTIONS']]
                }
            };

            if (productPage) {
                const selectedProduct = new URLSearchParams(window.location.search).get('product')
                    || productPage.dataset.productPage
                    || 'airdots';
                const hasSelectedProduct = Object.prototype.hasOwnProperty.call(products, selectedProduct);
                const product = hasSelectedProduct ? products[selectedProduct] : products.airdots;
                const buyNowLink = productPage.querySelector('[data-buy-now]');
                if (buyNowLink) {
                    const orderProduct = hasSelectedProduct ? selectedProduct : 'airdots';
                    buyNowLink.href = `buy-now.html?product=${encodeURIComponent(orderProduct)}`;
                }
                const viewer = productPage.querySelector('.product-3d-model');
                const rating = productPage.querySelector('[data-product-rating]');

                document.title = product.name;
                productPage.querySelector('[data-product-name]').textContent = product.name;
                productPage.querySelector('[data-product-price]').textContent = product.price;
                productPage.querySelector('[data-old-price]').textContent = product.oldPrice;
                productPage.querySelector('[data-save-badge]').textContent = product.savings;
                productPage.querySelector('[data-rating-text]').textContent = product.rating;
                rating.setAttribute('aria-label', `${product.rating.split(' ')[0]} out of 5 stars, ${product.rating.match(/\((.*?)\)/)?.[1] || ''}`);
                productPage.querySelector('[data-product-description]').textContent = product.description;

                const highlights = productPage.querySelector('[data-product-highlights]');
                highlights.replaceChildren(...product.highlights.map(text => {
                    const item = document.createElement('span');
                    item.className = 'highlight';
                    item.textContent = `✔ ${text}`;
                    return item;
                }));

                const specs = productPage.querySelector('[data-product-specs]');
                specs.replaceChildren(...product.specs.map(([label, value]) => {
                    const item = document.createElement('li');
                    const title = document.createElement('span');
                    const detail = document.createElement('strong');
                    title.textContent = label;
                    detail.textContent = value;
                    item.append(title, detail);
                    return item;
                }));

                viewer.dataset.model = product.model;
                viewer.dataset.shell = product.shell;
                viewer.dataset.accent = product.accent;
                viewer.setAttribute('aria-label', `Interactive 3D preview of ${product.name}`);
                viewer.closest('.viewer-panel').setAttribute('aria-label', `${product.name} 3D product viewer`);
                productPage.querySelector('.info-panel').setAttribute('aria-label', `${product.name} product information`);

                productPage.querySelectorAll('.color-swatch').forEach(swatch => {
                    swatch.addEventListener('click', () => {
                        const color = swatch.dataset.color;
                        if (!color) return;

                        viewer.dataset.shell = color;
                        viewer._setColor?.(color);
                        productPage.querySelectorAll('.color-swatch').forEach(option => {
                            option.setAttribute('aria-pressed', String(option === swatch));
                        });
                        productPage.querySelector('[data-selected-color]').textContent = swatch.dataset.colorName;
                    });
                });
            }

            if (!viewers.length) return;

            const showError = (viewer, message) => {
                viewer.classList.add('is-error');
                viewer.dataset.error = message;
            };

            let threePromise;
            function loadThree() {
                if (window.THREE) return Promise.resolve(window.THREE);
                if (!threePromise) {
                    threePromise = new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
                        script.onload = () => window.THREE
                            ? resolve(window.THREE)
                            : reject(new Error('Three.js loaded without exposing its API.'));
                        script.onerror = () => reject(new Error('Could not load Three.js.'));
                        document.head.appendChild(script);
                    });
                }
                return threePromise;
            }

            function createEarbud(group, material, darkMaterial, x, y, withHook) {
                const bud = new THREE.Group();
                const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 20), material);
                body.scale.set(1, 1.15, 0.82);
                body.castShadow = true;
                bud.add(body);

                const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), darkMaterial);
                tip.position.set(0, -0.04, 0.22);
                bud.add(tip);

                if (withHook) {
                    const hook = new THREE.Mesh(
                        new THREE.TorusGeometry(0.32, 0.065, 12, 32, Math.PI * 1.55),
                        material
                    );
                    hook.position.set(0.19, 0.05, -0.02);
                    hook.rotation.z = -0.5;
                    hook.castShadow = true;
                    bud.add(hook);
                } else {
                    const stem = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.065, 0.05, 0.42, 16),
                        material
                    );
                    stem.position.set(0, -0.36, 0.04);
                    stem.rotation.x = 0.15;
                    stem.castShadow = true;
                    bud.add(stem);
                }

                bud.position.set(x, y, 0);
                bud.rotation.z = x < 0 ? 0.14 : -0.14;
                group.add(bud);
            }

            function createEarbudSet(scene, modelType, shellColor, accentColor) {
                const group = new THREE.Group();
                const shell = new THREE.MeshStandardMaterial({
                    color: shellColor,
                    roughness: modelType === 'anc' ? 0.28 : 0.38,
                    metalness: modelType === 'anc' ? 0.35 : 0.12
                });
                const dark = new THREE.MeshStandardMaterial({ color: 0x202124, roughness: 0.45 });
                const accent = new THREE.MeshStandardMaterial({
                    color: accentColor,
                    emissive: modelType === 'rgb' ? accentColor : 0x000000,
                    emissiveIntensity: modelType === 'rgb' ? 0.65 : 0,
                    metalness: 0.3,
                    roughness: 0.25
                });

                const caseBody = new THREE.Mesh(new THREE.SphereGeometry(0.86, 36, 28), shell);
                caseBody.scale.set(1.2, 0.62, 0.68);
                caseBody.position.y = -0.6;
                caseBody.castShadow = true;
                group.add(caseBody);

                const seam = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.012, 8, 48), dark);
                seam.scale.set(1.2, 0.62, 0.68);
                seam.position.y = -0.6;
                seam.rotation.x = Math.PI / 2;
                group.add(seam);

                const led = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), accent);
                led.position.set(0, -0.62, 0.58);
                group.add(led);

                if (modelType === 'rgb') {
                    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 10, 32), accent);
                    ring.position.set(0, -0.6, 0.62);
                    group.add(ring);
                }

                createEarbud(group, shell, dark, -0.66, 0.58, modelType === 'clip');
                createEarbud(group, shell, dark, 0.66, 0.58, modelType === 'clip');
                group.rotation.y = 0.25;
                scene.add(group);
                return {
                    model: group,
                    setColor: color => shell.color.set(color)
                };
            }

            function createWatch(scene, shellColor, accentColor) {
                const group = new THREE.Group();
                const shell = new THREE.MeshStandardMaterial({ color: shellColor, roughness: 0.28, metalness: 0.6 });
                const band = new THREE.MeshStandardMaterial({ color: 0x292929, roughness: 0.72 });
                const screen = new THREE.MeshStandardMaterial({
                    color: 0x17202d,
                    emissive: accentColor,
                    emissiveIntensity: 0.22,
                    roughness: 0.18
                });

                const upperStrap = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.8, 0.16), band);
                upperStrap.position.y = 1.18;
                upperStrap.castShadow = true;
                group.add(upperStrap);
                const lowerStrap = upperStrap.clone();
                lowerStrap.position.y = -1.18;
                group.add(lowerStrap);

                const caseBody = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.35, 0.34), shell);
                caseBody.castShadow = true;
                caseBody.receiveShadow = true;
                group.add(caseBody);

                const display = new THREE.Mesh(new THREE.BoxGeometry(1.08, 1.17, 0.025), screen);
                display.position.z = 0.19;
                group.add(display);

                const hand = new THREE.Mesh(
                    new THREE.BoxGeometry(0.035, 0.37, 0.02),
                    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4 })
                );
                hand.position.set(0, 0.08, 0.22);
                hand.rotation.z = -0.55;
                group.add(hand);

                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.13, 20), shell);
                crown.rotation.z = Math.PI / 2;
                crown.position.set(0.68, 0.12, 0);
                group.add(crown);

                group.rotation.x = -0.12;
                group.rotation.y = 0.35;
                scene.add(group);
                return {
                    model: group,
                    setColor: color => shell.color.set(color)
                };
            }

            function initializeViewer(viewer) {
                let renderer;
                try {
                    const width = viewer.clientWidth;
                    const height = viewer.clientHeight;
                    const scene = new THREE.Scene();
                    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
                    camera.position.set(0, 0.25, 5.2);

                    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                    renderer.setSize(width, height);
                    renderer.shadowMap.enabled = true;
                    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    viewer.appendChild(renderer.domElement);
                    renderer.domElement.setAttribute('aria-hidden', 'true');

                    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
                    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
                    keyLight.position.set(-3, 4, 5);
                    keyLight.castShadow = true;
                    scene.add(keyLight);
                    const rimLight = new THREE.DirectionalLight(0xcbdcff, 0.45);
                    rimLight.position.set(4, 2, -3);
                    scene.add(rimLight);

                    const shellColor = Number.parseInt(viewer.dataset.shell.slice(1), 16);
                    const accentColor = Number.parseInt(viewer.dataset.accent.slice(1), 16);
                    const product = viewer.dataset.model === 'watch'
                        ? createWatch(scene, shellColor, accentColor)
                        : createEarbudSet(scene, viewer.dataset.model, shellColor, accentColor);
                    const ground = new THREE.Mesh(
                        new THREE.PlaneGeometry(12, 12),
                        new THREE.ShadowMaterial({ opacity: 0.18 })
                    );
                    ground.rotation.x = -Math.PI / 2;
                    ground.position.y = -1.58;
                    ground.receiveShadow = true;
                    scene.add(ground);

                    let dragging = false;
                    let lastX = 0;
                    let lastY = 0;
                    let active = false;
                    let frameId;

                    const render = () => {
                        if (!active) return;
                        product.model.rotation.y += dragging ? 0 : 0.004;
                        renderer.render(scene, camera);
                        frameId = requestAnimationFrame(render);
                    };
                    const setActive = isActive => {
                        if (active === isActive) return;
                        active = isActive;
                        if (active) {
                            render();
                        } else {
                            cancelAnimationFrame(frameId);
                        }
                    };

                    renderer.domElement.addEventListener('pointerdown', event => {
                        dragging = true;
                        lastX = event.clientX;
                        lastY = event.clientY;
                        renderer.domElement.setPointerCapture(event.pointerId);
                    });
                    renderer.domElement.addEventListener('pointermove', event => {
                        if (!dragging) return;
                        product.model.rotation.y += (event.clientX - lastX) * 0.008;
                        product.model.rotation.x = Math.max(
                            -0.45,
                            Math.min(0.45, product.model.rotation.x + (event.clientY - lastY) * 0.006)
                        );
                        lastX = event.clientX;
                        lastY = event.clientY;
                    });
                    renderer.domElement.addEventListener('pointerup', () => { dragging = false; });
                    renderer.domElement.addEventListener('pointercancel', () => { dragging = false; });

                    const resize = () => {
                        const nextWidth = viewer.clientWidth;
                        const nextHeight = viewer.clientHeight;
                        camera.aspect = nextWidth / nextHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(nextWidth, nextHeight);
                    };
                    const resizeObserver = new ResizeObserver(resize);
                    resizeObserver.observe(viewer);
                    viewer._setActive = setActive;
                    viewer._setColor = product.setColor;
                } catch (error) {
                    renderer?.dispose();
                    showError(viewer, '3D preview is unavailable in this browser.');
                    console.error('Could not initialize New Arrivals 3D preview:', error);
                }
            }

            viewers.forEach(viewer => {
                const card = viewer.closest('.new-arrivals-card');
                if (card) {
                    card.querySelectorAll('.new-arrivals-swatches input').forEach(input => {
                        input.addEventListener('change', () => {
                            const color = input.nextElementSibling.style.getPropertyValue('--c').trim();
                            if (!color) return;
                            viewer.dataset.shell = color;
                            viewer._setColor?.(color);
                        });
                    });

                    const selectedColor = card.querySelector('.new-arrivals-swatches input:checked')
                        ?.nextElementSibling.style.getPropertyValue('--c').trim();
                    if (selectedColor) viewer.dataset.shell = selectedColor;
                }

                if ('IntersectionObserver' in window) {
                    const scrollContainer = viewer.closest('.new-arrivals-track');
                    const observer = new IntersectionObserver(entries => {
                        entries.forEach(entry => {
                            viewer._visible = entry.isIntersecting;
                            if (entry.isIntersecting && !viewer._setActive && !viewer.dataset.initializing) {
                                viewer.dataset.initializing = 'true';
                                loadThree()
                                    .then(() => {
                                        initializeViewer(viewer);
                                        viewer._setActive?.(viewer._visible);
                                    })
                                    .catch(error => {
                                        showError(viewer, '3D preview could not be loaded.');
                                        console.error('Could not load New Arrivals 3D preview:', error);
                                    });
                            }
                            viewer._setActive?.(entry.isIntersecting);
                        });
                    }, { root: scrollContainer, threshold: 0.1 });
                    observer.observe(viewer);
                } else {
                    viewer.dataset.initializing = 'true';
                    loadThree()
                        .then(() => {
                            initializeViewer(viewer);
                            viewer._setActive?.(true);
                        })
                        .catch(error => {
                            showError(viewer, '3D preview could not be loaded.');
                            console.error('Could not load New Arrivals 3D preview:', error);
                        });
                }
            });
        })();
