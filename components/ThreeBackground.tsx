'use client';

import { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';
import { threeStore } from '@/lib/threeStore';

// ─── Constants ───────────────────────────────────────────────────────────────
const ORB_COUNT = 140;
const CONNECTION_DISTANCE = 12;
const MAX_CONNECTIONS = 55;

const NEON_COLORS = [
    new THREE.Color(0x3b82f6),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0x06b6d4),
    new THREE.Color(0xa855f7),
    new THREE.Color(0x60a5fa),
    new THREE.Color(0x7c3aed),
    new THREE.Color(0x22d3ee),
];

interface OrbData {
    x: number; y: number; z: number;
    baseScale: number;
    phaseX: number; phaseY: number;
    speed: number;
    colorIdx: number;
}

const ORB_DATA: OrbData[] = Array.from({ length: ORB_COUNT }, () => ({
    x: (Math.random() - 0.5) * 80,
    y: (Math.random() - 0.5) * 45,
    z: -2 - Math.random() * 28,
    baseScale: 0.06 + Math.random() * 0.36,
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    speed: 0.12 + Math.random() * 0.22,
    colorIdx: Math.floor(Math.random() * NEON_COLORS.length),
}));

// ─── Gradient Fallback ────────────────────────────────────────────────────────
function GradientFallback() {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 30% 40%, #1a0533 0%, #050510 50%, #0b0f2a 100%)',
            }}
        />
    );
}

// ─── WebGL Detection ──────────────────────────────────────────────────────────
function detectWebGL(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const c = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (c.getContext('webgl') || c.getContext('experimental-webgl'))
        );
    } catch {
        return false;
    }
}

// ─── Main Component ───────────────────────────────────────────────────────────
function ThreeBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!detectWebGL() || !containerRef.current) return;

        const container = containerRef.current;
        const W = container.clientWidth;
        const H = container.clientHeight;

        // ── Renderer ──────────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(W, H);
        renderer.setClearColor(0x050510, 1);
        container.appendChild(renderer.domElement);

        // ── Camera & Scene ────────────────────────────────────────────────────
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
        camera.position.set(0, 0, 22);
        const scene = new THREE.Scene();

        // ── Lights ────────────────────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0xffffff, 0.05));
        const p1 = new THREE.PointLight(0x8b5cf6, 2, 100, 2); p1.position.set(0, 0, 5); scene.add(p1);
        const p2 = new THREE.PointLight(0x3b82f6, 1.5, 100, 2); p2.position.set(-20, 10, -5); scene.add(p2);
        const p3 = new THREE.PointLight(0x06b6d4, 1.5, 100, 2); p3.position.set(20, -10, -5); scene.add(p3);

        // ── Instanced Orbs ────────────────────────────────────────────────────
        const orbGeo = new THREE.SphereGeometry(1, 7, 7);
        const orbMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
        });
        const orbs = new THREE.InstancedMesh(orbGeo, orbMat, ORB_COUNT);
        orbs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        // Assign per-instance colors
        ORB_DATA.forEach((orb, i) => orbs.setColorAt(i, NEON_COLORS[orb.colorIdx]));
        if (orbs.instanceColor) orbs.instanceColor.needsUpdate = true;

        const group = new THREE.Group();
        group.add(orbs);
        scene.add(group);

        // ── Connection Lines ──────────────────────────────────────────────────
        const maxVerts = MAX_CONNECTIONS * 2;
        const linePositions = new Float32Array(maxVerts * 3);
        const lineColors = new Float32Array(maxVerts * 3);
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
        lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));
        const lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        lines.visible = false;
        scene.add(lines);

        // ── Position buffer (shared per frame) ───────────────────────────────
        const posBuffer = new Float32Array(ORB_COUNT * 3);
        const dummy = new THREE.Object3D();
        const clock = new THREE.Clock();

        // ── Resize handling ───────────────────────────────────────────────────
        const onResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        // ── Mouse parallax ────────────────────────────────────────────────────
        const onMouse = (e: MouseEvent) => {
            threeStore.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            threeStore.mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouse, { passive: true });

        // ── Animation loop ────────────────────────────────────────────────────
        let animId: number;

        const animate = () => {
            animId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            const { inputFocused, isSubmitting, isSuccess, mouseX, mouseY } = threeStore;

            // Camera drift
            const targetZ = isSubmitting || isSuccess ? 17 : 22;
            camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
            camera.position.y += (mouseY * 1.0 - camera.position.y) * 0.04;
            camera.position.z += (targetZ - camera.position.z) * 0.04;
            camera.lookAt(0, 0, 0);

            // Group rotation
            const rotSpeed = isSubmitting || isSuccess ? 0.006 : 0.0015;
            group.rotation.y = t * rotSpeed;
            group.rotation.x = Math.sin(t * 0.0008) * 0.04;

            const burstBoost = isSubmitting || isSuccess ? 1.6 : 1;

            // Update orbs
            ORB_DATA.forEach((orb, i) => {
                const floatX = Math.sin(t * orb.speed + orb.phaseX) * 1.8;
                const floatY = Math.cos(t * orb.speed * 0.7 + orb.phaseY) * 1.4;

                const px = orb.x + floatX + mouseX * (10 - Math.abs(orb.z) * 0.3);
                const py = orb.y + floatY + mouseY * (7 - Math.abs(orb.z) * 0.2);
                const pz = orb.z;

                posBuffer[i * 3] = px;
                posBuffer[i * 3 + 1] = py;
                posBuffer[i * 3 + 2] = pz;

                const distCenter = Math.sqrt(px * px + py * py);
                const focusBoost = inputFocused && distCenter < 18 ? 1.35 : 1;
                const scale = orb.baseScale * burstBoost * focusBoost;

                dummy.position.set(px, py, pz);
                dummy.scale.setScalar(scale);
                if (isSubmitting || isSuccess) dummy.rotation.y = t * 3;
                dummy.updateMatrix();
                orbs.setMatrixAt(i, dummy.matrix);
            });
            orbs.instanceMatrix.needsUpdate = true;

            // Update connection lines
            if (!inputFocused && !isSubmitting) {
                lines.visible = false;
            } else {
                lines.visible = true;
                lineMat.opacity = isSubmitting ? 0.8 : 0.45;

                let connCount = 0;
                const posAttr = lineGeo.attributes.position as THREE.BufferAttribute;
                const colAttr = lineGeo.attributes.color as THREE.BufferAttribute;

                outer: for (let i = 0; i < ORB_COUNT; i++) {
                    const ax = posBuffer[i * 3], ay = posBuffer[i * 3 + 1], az = posBuffer[i * 3 + 2];
                    if (Math.sqrt(ax * ax + ay * ay) > 25) continue;
                    for (let j = i + 1; j < ORB_COUNT; j++) {
                        if (connCount >= MAX_CONNECTIONS) break outer;
                        const bx = posBuffer[j * 3], by = posBuffer[j * 3 + 1], bz = posBuffer[j * 3 + 2];
                        const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);
                        if (dist < CONNECTION_DISTANCE) {
                            const s = 1 - dist / CONNECTION_DISTANCE;
                            const vi = connCount * 2;
                            posAttr.setXYZ(vi, ax, ay, az);
                            posAttr.setXYZ(vi + 1, bx, by, bz);
                            const ca = NEON_COLORS[ORB_DATA[i].colorIdx];
                            const cb = NEON_COLORS[ORB_DATA[j].colorIdx];
                            colAttr.setXYZ(vi, ca.r * s, ca.g * s, ca.b * s);
                            colAttr.setXYZ(vi + 1, cb.r * s, cb.g * s, cb.b * s);
                            connCount++;
                        }
                    }
                }
                posAttr.needsUpdate = true;
                colAttr.needsUpdate = true;
                lineGeo.setDrawRange(0, connCount * 2);
            }

            renderer.render(scene, camera);
        };

        animate();

        // ── Cleanup ───────────────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouse);
            renderer.dispose();
            orbGeo.dispose();
            orbMat.dispose();
            lineGeo.dispose();
            lineMat.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        />
    );
}

export default memo(ThreeBackground);
