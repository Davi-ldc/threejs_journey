import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.27)//ilumina uniformemente tudo na cena
ambientLight.intensity = 0.27
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

// const directionallight = new THREE.DirectionalLight(0x00fffc,0.3)//tipo o sol, vem de cima
// scene.add(directionallight)
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)
// directionallight.intensity = 0.58
// gui.add(directionallight, 'intensity').min(0).max(1).step(0.01)


// const HemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff,1)//primeira cor ver de cima e a segunda por baixo, no meio fica algo entre os 2
// scene.add(HemisphereLight)
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)
// gui.add(HemisphereLight, 'intensity').min(0).max(1).step(0.01)

const pointLight = new THREE.PointLight(0xff9000, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)
gui.add(pointLight, 'intensity').min(0).max(1).step(0.01)
gui.add(pointLight, 'decay').min(0).max(1).step(0.01)
gui.add(pointLight, 'distance').min(0.1).max(100).step(0.1)//se tiver mais longe da distancia a luz para de funcionar dcay é o tanto que demora pra parar de funcionar

// const RectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
// scene.add(RectAreaLight)
// RectAreaLight.position.set(- 1.5, 0, 1.5)
// RectAreaLight.lookAt(new THREE.Vector3())
// gui.add(RectAreaLight, 'intensity').min(0).max(1).step(0.01)

// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
// spotLight.position.set(0, 2, 5)
// spotLight.target.position.x = - 0.75//pra onde ela ta olhando
// scene.add(spotLight.target)
// scene.add(spotLight)
// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)
// gui.add(spotLight, 'intensity').min(0).max(1).step(0.01)

//se tem muita luz, talvez seja melhor deixar o efeito dela dentro da textura o nome disso é baking



/**
 * Objects
 */
// Material

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.42
gui.add(material, 'roughness').min(0).max(1).step(0.01)
gui.add(material, 'metalness').min(0).max(1).step(0.01)

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()