import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

interface ThreeDiceProps {
  diceType: string;
  quantity: number;
  onRollComplete: (rolls: number[]) => void;
  onClose: () => void;
}

function getDiceSides(diceType: string): number {
  const match = diceType.match(/d(\d+)/);
  return match && match[1] ? parseInt(match[1]) : 6;
}

function createDiceTexture(number: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Warm leather/wood background
  const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  gradient.addColorStop(0, '#5C3317');
  gradient.addColorStop(1, '#3B1F0B');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  // Subtle border
  ctx.strokeStyle = '#8B6914';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 244, 244);

  // Number
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 110px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.fillText(String(number), 128, 135);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createConvexPolyhedron(geometry: THREE.BufferGeometry): CANNON.ConvexPolyhedron {
  const g = geometry.toNonIndexed();
  const position = g.attributes.position;
  if (!position) throw new Error("Geometry has no position attribute");

  const vertices: CANNON.Vec3[] = [];
  const vertexHash: { [key: string]: number } = {};
  const faces: number[][] = [];

  for (let i = 0; i < position.count; i += 3) {
    const faceIndices: number[] = [];
    for (let j = 0; j < 3; j++) {
      const idx = i + j;
      const x = Math.round(position.getX(idx) * 1000) / 1000;
      const y = Math.round(position.getY(idx) * 1000) / 1000;
      const z = Math.round(position.getZ(idx) * 1000) / 1000;
      const hash = `${x},${y},${z}`;

      if (vertexHash[hash] === undefined) {
        vertexHash[hash] = vertices.length;
        vertices.push(new CANNON.Vec3(position.getX(idx), position.getY(idx), position.getZ(idx)));
      }
      faceIndices.push(vertexHash[hash]);
    }
    faces.push(faceIndices);
  }

  return new CANNON.ConvexPolyhedron({ vertices, faces });
}

function attachNumbersToDice(geometry: THREE.BufferGeometry, diceType: string, mesh: THREE.Mesh) {
  if (diceType === 'd6' || diceType === 'd2' || diceType === 'd100') return;

  const geom = geometry.toNonIndexed();
  let position = geom.attributes.position;
  if (!position) return;
  const numTriangles = position.count / 3;

  let trianglesPerFace = 1;
  if (diceType === 'd10' || diceType === 'd12') trianglesPerFace = 3;

  const numFaces = Math.floor(numTriangles / trianglesPerFace);

  for (let i = 0; i < numFaces; i++) {
    const centroid = new THREE.Vector3();
    let norm = new THREE.Vector3();

    for (let t = 0; t < trianglesPerFace; t++) {
      const idx = (i * trianglesPerFace + t) * 3;
      const vA = new THREE.Vector3().fromBufferAttribute(position, idx);
      const vB = new THREE.Vector3().fromBufferAttribute(position, idx + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(position, idx + 2);
      
      centroid.add(vA).add(vB).add(vC);

      if (t === 0) {
        const cb = new THREE.Vector3().subVectors(vC, vB);
        const ab = new THREE.Vector3().subVectors(vA, vB);
        cb.cross(ab).normalize();
        norm = cb;
      }
    }
    centroid.divideScalar(trianglesPerFace * 3);

    const number = i + 1;
    let displayNum = number;
    if (diceType === 'd10' && number > 10) continue;
    if (diceType === 'd10' && number === 10) displayNum = 0;
    if (diceType === 'd8' && number > 8) continue;
    if (diceType === 'd4' && number > 4) continue;
    if (diceType === 'd20' && number > 20) continue;

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 128, 128);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 65px "MedievalSharp", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(String(displayNum), 64, 70);
    
    if (displayNum === 6 || displayNum === 9) {
      ctx.fillRect(45, 105, 38, 6);
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), mat);

    plane.position.copy(centroid).addScaledVector(norm, 0.05);
    plane.lookAt(new THREE.Vector3().copy(plane.position).add(norm));
    
    // Re-orient slightly based on geometry so numbers face a logical axis if needed,
    // but the `lookAt` plus normal handles planar matching properly.
    mesh.add(plane);
  }
}

// Build geometry based on dice type
function getDiceGeometry(diceType: string): THREE.BufferGeometry {
  switch (diceType) {
    case 'd2': return new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32);
    case 'd4': return new THREE.TetrahedronGeometry(0.9, 0);
    case 'd6': return new THREE.BoxGeometry(1, 1, 1);
    case 'd8': return new THREE.OctahedronGeometry(0.9, 0);
    case 'd10': { const g = new THREE.DodecahedronGeometry(0.85, 0); g.scale(1, 0.75, 1); return g; }
    case 'd12': return new THREE.DodecahedronGeometry(0.85, 0);
    case 'd20': return new THREE.IcosahedronGeometry(0.9, 0);
    case 'd100': return new THREE.IcosahedronGeometry(1.0, 1);
    default: return new THREE.BoxGeometry(1, 1, 1);
  }
}

function getDicePhysicsShape(diceType: string, geo?: THREE.BufferGeometry): CANNON.Shape {
  if (diceType === 'd2') return new CANNON.Cylinder(0.8, 0.8, 0.15, 16);
  if (diceType === 'd6') return new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  if (diceType === 'd100' || !geo) return new CANNON.Sphere(0.85);

  try {
    return createConvexPolyhedron(geo);
  } catch(e) {
    console.warn('Physics fallback for geometry', e);
    return new CANNON.Sphere(0.8);
  }
}

function createDiceMaterial(diceType: string): THREE.Material | THREE.Material[] {
  if (diceType === 'd6') {
    return [1, 2, 3, 4, 5, 6].map(n => new THREE.MeshStandardMaterial({
      map: createDiceTexture(n),
      roughness: 0.4,
      metalness: 0.05,
    }));
  }

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5C3317'),
    roughness: 0.35,
    metalness: 0.08,
    emissive: new THREE.Color('#3B1F0B'),
    emissiveIntensity: 0.3,
  });
}

export default function ThreeDice({ diceType, quantity, onRollComplete, onClose }: ThreeDiceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    world: CANNON.World;
    diceBodies: CANNON.Body[];
    diceMeshes: THREE.Mesh[];
    animationId: number;
    isDragging: boolean;
    dragStart: { x: number; y: number; time: number };
    dragCurrent: { x: number; y: number };
    mouseConstraint: CANNON.PointToPointConstraint | null;
    mouseBody: CANNON.Body | null;
    hasThrown: boolean;
    settled: boolean;
    settleTimer: number;
    selectedDiceIndex: number;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    throwVelocities: { x: number; y: number; time: number }[];
  } | null>(null);

  const [phase, setPhase] = useState<'grab' | 'throwing' | 'settling' | 'result'>('grab');
  const [resultValues, setResultValues] = useState<number[]>([]);
  const onRollCompleteRef = useRef(onRollComplete);
  onRollCompleteRef.current = onRollComplete;

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    // --- THREE.JS SCENE ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d0805');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 14, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Lights - warm tones, not red
    const ambient = new THREE.AmbientLight(0xffe0c0, 0.6);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
    mainLight.position.set(5, 15, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -15;
    mainLight.shadow.camera.right = 15;
    mainLight.shadow.camera.top = 15;
    mainLight.shadow.camera.bottom = -15;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xd4a574, 0.3);
    fillLight.position.set(-5, 8, -5);
    scene.add(fillLight);

    // Floor - dark wooden/leather look
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1a0f08'),
      roughness: 0.8,
      metalness: 0.02,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Floor decorative ring
    const ringGeo = new THREE.RingGeometry(8, 8.15, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xD4A574,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // Subtle atmospheric particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 30;
      pPositions[i * 3 + 1] = Math.random() * 15;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFFD700,
      size: 0.06,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- CANNON.JS PHYSICS ---
    const world = new CANNON.World();
    world.gravity.set(0, -30, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    (world.solver as CANNON.GSSolver).iterations = 15;

    // Contact material for good bouncing
    const diceMaterial = new CANNON.Material('dice');
    const floorMaterial = new CANNON.Material('floor');
    const contactMat = new CANNON.ContactMaterial(diceMaterial, floorMaterial, {
      friction: 0.6,
      restitution: 0.25,
    });
    world.addContactMaterial(contactMat);

    // Floor body at y=0
    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      material: floorMaterial,
      shape: new CANNON.Plane(),
    });
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    floorBody.position.set(0, 0, 0);
    world.addBody(floorBody);

    // Walls to keep dice in bounds (tighter for modal)
    const wallDefs = [
      { pos: [8, 5, 0], axis: [0, 1, 0], angle: -Math.PI / 2 },
      { pos: [-8, 5, 0], axis: [0, 1, 0], angle: Math.PI / 2 },
      { pos: [0, 5, 8], axis: [1, 0, 0], angle: Math.PI },
      { pos: [0, 5, -8], axis: [1, 0, 0], angle: 0 },
      { pos: [0, 16, 0], axis: [1, 0, 0], angle: Math.PI / 2 },
    ];
    wallDefs.forEach(w => {
      const wb = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane() });
      wb.quaternion.setFromAxisAngle(new CANNON.Vec3(w.axis[0]!, w.axis[1]!, w.axis[2]!), w.angle);
      wb.position.set(w.pos[0]!, w.pos[1]!, w.pos[2]!);
      world.addBody(wb);
    });

    // Create dice - start DYNAMIC but with velocity zero and floating position
    const diceBodies: CANNON.Body[] = [];
    const diceMeshes: THREE.Mesh[] = [];
    const spacing = quantity > 1 ? 2.5 : 0;

    for (let i = 0; i < quantity; i++) {
      const geo = getDiceGeometry(diceType);
      const mat = createDiceMaterial(diceType);
      const mesh = new THREE.Mesh(geo, mat as any);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Attach visual numbers to polyhedra
      attachNumbersToDice(geo, diceType, mesh);

      const offsetX = (i - (quantity - 1) / 2) * spacing;
      mesh.position.set(offsetX, 5, 5);
      scene.add(mesh);
      diceMeshes.push(mesh);

      // Physics body - start as KINEMATIC so we control position directly
      const shape = getDicePhysicsShape(diceType, geo);
      const body = new CANNON.Body({
        mass: 2,
        shape,
        material: diceMaterial,
        linearDamping: 0.2,
        angularDamping: 0.2,
      });
      body.position.set(offsetX, 5, 5);
      // KINEMATIC type: we move it, physics doesn't affect it yet
      body.type = CANNON.Body.KINEMATIC;
      world.addBody(body);
      diceBodies.push(body);
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    sceneRef.current = {
      scene, camera, renderer, world,
      diceBodies, diceMeshes,
      animationId: 0,
      isDragging: false,
      dragStart: { x: 0, y: 0, time: 0 },
      dragCurrent: { x: 0, y: 0 },
      mouseConstraint: null,
      mouseBody: null,
      hasThrown: false,
      settled: false,
      settleTimer: 0,
      selectedDiceIndex: -1,
      raycaster, mouse,
      throwVelocities: [],
    };

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let floatAngle = 0;

    const animate = () => {
      const s = sceneRef.current;
      if (!s) return;
      s.animationId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      // Always step physics
      world.step(1 / 60, delta, 3);

      // Phase 1: Dice floating, waiting to be grabbed or actively being dragged
      if (!s.hasThrown) {
        floatAngle += delta * 2;
        s.diceMeshes.forEach((mesh, i) => {
          const body = s.diceBodies[i];
          const offsetX = (i - (quantity - 1) / 2) * spacing;
          
          if (!s.isDragging || s.selectedDiceIndex !== i) {
            // Float animation
            const floatY = 5 + Math.sin(floatAngle + i * 0.7) * 0.4;
            mesh.rotation.y += delta * 0.8;
            mesh.rotation.x = Math.sin(floatAngle * 0.5 + i) * 0.1;
            mesh.position.set(offsetX, floatY, 5);
            
            if (body) {
              if (body.type !== CANNON.Body.KINEMATIC) {
                body.type = CANNON.Body.KINEMATIC;
                body.velocity.set(0, 0, 0);
                body.angularVelocity.set(0, 0, 0);
              }
              body.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
            }
          } else {
            // Being dragged dynamically - sync mesh to physics body!
            if (body) {
              mesh.position.set(body.position.x, body.position.y, body.position.z);
              mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
            }
          }
        });
      }

      // Phase 2: Physics simulation after throw
      if (s.hasThrown && !s.settled) {

        // Copy physics -> mesh
        s.diceBodies.forEach((body, i) => {
          const mesh = s.diceMeshes[i];
          if (mesh) {
            mesh.position.set(body.position.x, body.position.y, body.position.z);
            mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
          }
        });

        // Check if all dice have settled
        const totalVel = s.diceBodies.reduce((sum, b) =>
          sum + b.velocity.length() + b.angularVelocity.length(), 0
        );
        const isOnFloor = s.diceBodies.every(b => b.position.y < 2);

        if (totalVel < 0.8 && isOnFloor) {
          s.settleTimer += delta;
          if (s.settleTimer > 0.6) {
            s.settled = true;
            const sides = getDiceSides(diceType);
            const rolls = s.diceBodies.map(() => Math.floor(Math.random() * sides) + 1);
            setResultValues(rolls);
            setPhase('result');

            // Apply number textures to settled dice
            s.diceMeshes.forEach((mesh, i) => {
              const val = rolls[i];
              if (mesh && val !== undefined && !Array.isArray(mesh.material)) {
                (mesh.material as THREE.MeshStandardMaterial).map = createDiceTexture(val);
                (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
              }
            });

            setTimeout(() => {
              onRollCompleteRef.current(rolls);
            }, 1800);
          }
        } else {
          s.settleTimer = 0;
        }
      }

      // Animate particles
      const posAttr = particles.geometry.attributes.position;
      if (posAttr) {
        const arr = posAttr.array as Float32Array;
        for (let pi = 0; pi < particleCount; pi++) {
          const idx = pi * 3 + 1;
          arr[idx] = (arr[idx] ?? 0) + delta * 0.2;
          if ((arr[idx] ?? 0) > 15) arr[idx] = 0;
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [diceType, quantity]);

  // --- MOUSE / TOUCH HELPERS ---
  const getMousePos = useCallback((e: MouseEvent | TouchEvent) => {
    const isTouchEvent = 'touches' in e;
    let clientX: number, clientY: number;
    if (isTouchEvent) {
      const touch = (e as TouchEvent).touches[0] || (e as TouchEvent).changedTouches[0];
      clientX = touch ? touch.clientX : 0;
      clientY = touch ? touch.clientY : 0;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    return { x: clientX, y: clientY };
  }, []);

  const screenToWorld = useCallback((sx: number, sy: number, planeY: number) => {
    const s = sceneRef.current;
    if (!s) return new THREE.Vector3(0, planeY, 0);
    const rect = s.renderer.domElement.getBoundingClientRect();
    s.mouse.x = ((sx - rect.left) / rect.width) * 2 - 1;
    s.mouse.y = -((sy - rect.top) / rect.height) * 2 + 1;
    s.raycaster.setFromCamera(s.mouse, s.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -planeY);
    const target = new THREE.Vector3();
    s.raycaster.ray.intersectPlane(plane, target);
    return target;
  }, []);

  // --- POINTER DOWN: grab a die ---
  const handlePointerDown = useCallback((e: MouseEvent | TouchEvent) => {
    const s = sceneRef.current;
    if (!s || s.hasThrown) return;
    e.preventDefault();
    const pos = getMousePos(e);

    // Raycast to see if we hit a die
    const rect = s.renderer.domElement.getBoundingClientRect();
    s.mouse.x = ((pos.x - rect.left) / rect.width) * 2 - 1;
    s.mouse.y = -((pos.y - rect.top) / rect.height) * 2 + 1;
    s.raycaster.setFromCamera(s.mouse, s.camera);

    const hits = s.raycaster.intersectObjects(s.diceMeshes);
    let targetIdx = -1;
    let hitPoint: THREE.Vector3 | null = null;

    if (hits.length > 0 && hits[0].object) {
      targetIdx = s.diceMeshes.indexOf(hits[0].object as THREE.Mesh);
      hitPoint = hits[0].point;
    } else {
      // Fallback: finding closest mesh by distance on XZ plane for easier grabbing
      let minDist = 3.0; // quite forgiving radius
      s.diceMeshes.forEach((mesh, index) => {
        const meshPos = mesh.position.clone();
        meshPos.y = 0;
        const targetPos = screenToWorld(pos.x, pos.y, 5);
        if (targetPos) {
          targetPos.y = 0;
          const dist = meshPos.distanceTo(targetPos);
          if (dist < minDist) {
            minDist = dist;
            targetIdx = index;
            hitPoint = mesh.position.clone();
            // Pick a slightly offset hitpoint so it dangles interestingly
            hitPoint.y += 0.5; 
            hitPoint.x += (Math.random() - 0.5) * 0.5;
          }
        }
      });
    }

    if (targetIdx >= 0) {
      s.isDragging = true;
      s.selectedDiceIndex = targetIdx;
      s.dragStart = { x: pos.x, y: pos.y, time: Date.now() };
      s.dragCurrent = { x: pos.x, y: pos.y };
      s.throwVelocities = [];

      const mesh = s.diceMeshes[targetIdx];
      const body = s.diceBodies[targetIdx];
      if (mesh) mesh.scale.setScalar(1.15);
      if (body && mesh && hitPoint) {
        // Randomize quaternion to prevent cheating
        const euler = new CANNON.Vec3(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        body.quaternion.setFromEuler(euler.x, euler.y, euler.z);
        mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
        
        // Physics constraint setup for dangling physics!
        body.type = CANNON.Body.DYNAMIC;
        body.wakeUp();

        s.mouseBody = new CANNON.Body({ type: CANNON.Body.KINEMATIC });
        s.mouseBody.position.set(hitPoint.x, 6, hitPoint.z);
        s.mouseBody.collisionFilterGroup = 0;
        s.mouseBody.collisionFilterMask = 0;
        s.world.addBody(s.mouseBody);

        const localPivot = body.pointToLocalFrame(new CANNON.Vec3(hitPoint.x, hitPoint.y, hitPoint.z));
        s.mouseConstraint = new CANNON.PointToPointConstraint(body, localPivot, s.mouseBody, new CANNON.Vec3(0,0,0));
        s.world.addConstraint(s.mouseConstraint);
      }
      setPhase('throwing');
    }
  }, [getMousePos, screenToWorld]);

  // --- POINTER MOVE: drag the die ---
  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    const s = sceneRef.current;
    if (!s || !s.isDragging || s.hasThrown) return;
    e.preventDefault();
    const pos = getMousePos(e);

    s.throwVelocities.push({
      x: pos.x - s.dragCurrent.x,
      y: pos.y - s.dragCurrent.y,
      time: Date.now(),
    });
    // Keep last ~8 samples for velocity
    if (s.throwVelocities.length > 8) s.throwVelocities.shift();

    s.dragCurrent = { x: pos.x, y: pos.y };

    // Move die to follow mouse in 3D
    const worldPos = screenToWorld(pos.x, pos.y, 5);
    if (worldPos && s.selectedDiceIndex >= 0 && s.mouseBody) {
      const clampedX = Math.max(-7, Math.min(7, worldPos.x));
      const clampedZ = Math.max(-7, Math.min(7, worldPos.z));
      
      const dt = 1/60; // Approximate dt for velocity calculation
      const dx = clampedX - s.mouseBody.position.x;
      const dz = clampedZ - s.mouseBody.position.z;
      
      // Setting velocity on kinematic body allows the constraint to exert momentum naturally!
      s.mouseBody.velocity.set(dx / dt, 0, dz / dt);
      s.mouseBody.position.set(clampedX, 6, clampedZ);
    }
  }, [getMousePos, screenToWorld]);

  // --- POINTER UP: throw the dice ---
  const handlePointerUp = useCallback((e: MouseEvent | TouchEvent) => {
    const s = sceneRef.current;
    if (!s || !s.isDragging || s.hasThrown) return;
    e.preventDefault();

    s.isDragging = false;
    s.hasThrown = true;

    // Calculate throw velocity from recent samples
    let avgVx = 0, avgVy = 0;
    const recent = s.throwVelocities.slice(-5);
    if (recent.length > 0) {
      recent.forEach(v => { avgVx += v.x; avgVy += v.y; });
      avgVx /= recent.length;
      avgVy /= recent.length;
    }

    // Convert screen velocity to 3D
    const forceMultiplier = 1.8;
    const throwVx = avgVx * forceMultiplier * 0.3;
    const throwVz = avgVy * forceMultiplier * -0.3;

    // Remove constraint first
    if (s.mouseConstraint && s.mouseBody) {
      s.world.removeConstraint(s.mouseConstraint);
      s.world.removeBody(s.mouseBody);
      s.mouseConstraint = null;
      s.mouseBody = null;
    }

    // Switch ALL dice from KINEMATIC to DYNAMIC and apply forces
    s.diceBodies.forEach((body, i) => {
      body.type = CANNON.Body.DYNAMIC;
      body.mass = 2;
      body.updateMassProperties();
      body.wakeUp();

      if (i === s.selectedDiceIndex) {
        // Retain inertia from the constraint, but add a slight forward/downward nudge
        body.velocity.x += throwVx;
        body.velocity.z += throwVz;
        body.velocity.y -= 2; // slam down softly
      } else {
        body.velocity.set(
          (Math.random() - 0.5) * 8,
          6 + Math.random() * 4,
          -4 + (Math.random() - 0.5) * 4,
        );
        body.angularVelocity.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
        );
      }

      // Reset visual scale
      const mesh = s.diceMeshes[i];
      if (mesh) mesh.scale.setScalar(1);
    });

    setPhase('settling');
  }, [getMousePos]);

  // --- LIFECYCLE ---
  useEffect(() => {
    const cleanup = initScene();
    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        sceneRef.current.renderer.domElement.remove();
      }
      cleanup?.();
    };
  }, [initScene]);

  // Attach event listeners to canvas
  useEffect(() => {
    const canvas = sceneRef.current?.renderer?.domElement;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    canvas.addEventListener('touchend', handlePointerUp, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('touchend', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  const phaseText: Record<string, string> = {
    grab: '🎲 Pegue o dado e jogue!',
    throwing: '✊ Arraste e solte para lançar!',
    settling: '🎲 Rolando...',
    result: `✨ Resultado: ${resultValues.join(' + ')} = ${resultValues.reduce((a, b) => a + b, 0)}`,
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 transition-all duration-500">
      <div className="relative w-full max-w-[850px] h-[80vh] max-h-[800px] rounded-3xl overflow-hidden shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),inset_0_0_80px_rgba(120,53,15,0.2)] bg-[#110A07] border-2 border-[#8B4513]/40">
        
        {/* Background texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("/fundo-rpg.png")', backgroundSize: 'cover' }}></div>

        {/* 3D canvas container */}
        <div ref={containerRef} className="absolute inset-0" style={{
          cursor: phase === 'grab' ? 'grab' : phase === 'throwing' ? 'grabbing' : 'default',
        }} />

        {/* Header / Instruction text */}
        <div className="absolute top-0 left-0 right-0 p-6 text-center pointer-events-none z-10 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
          <p className="font-['MedievalSharp'] text-3xl text-amber-500 m-0 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wide">
            {phaseText[phase]}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-[#2C160B]/90 border-2 border-amber-700/50 text-amber-600 font-bold text-xl cursor-pointer hover:bg-amber-900 hover:text-amber-400 hover:scale-110 hover:border-amber-500 transition-all duration-300 shadow-lg"
        >
          ✕
        </button>

        {/* Result card */}
        {phase === 'result' && (
          <div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center"
            style={{ animation: 'resultPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <div className="bg-[#1a0f0a]/95 border-2 border-[#D4A574]/60 rounded-2xl py-6 px-12 backdrop-blur-md shadow-[0_0_50px_rgba(139,69,19,0.5),0_10px_30px_rgba(0,0,0,0.8)]">
              <p className="font-['MedievalSharp'] text-[5rem] text-[#FFD700] m-0 leading-none drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                {resultValues.reduce((a, b) => a + b, 0)}
              </p>
              {resultValues.length > 1 && (
                <p className="font-['Cormorant_Garamond'] text-xl text-[#D4A574]/90 m-0 mt-3 font-bold tracking-wider">
                  {resultValues.join(' + ')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}