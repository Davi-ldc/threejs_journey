import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
THREE.ColorManagement.enabled = false

/**
 * Base
 */

//texturas


const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = () =>
// {
//     console.log('loading started')
// }
// loadingManager.onLoad = () =>
// {
//     console.log('loading finished')
// }
// loadingManager.onProgress = () =>
// {
//     console.log('loading progressing')
// }
// loadingManager.onError = () =>
// {
//     console.log('loading error')
// }

const textureLoader = new THREE.TextureLoader(loadingManager)


const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
// colorTexture.repeat.set(3,2)

colorTexture.wrapS= THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
//repete a imagem, uma vez normal outra espelhada pra repetir normal usa o THREE.RepeatWrapping
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
//normalmente a referencia pra rotacionar a textura é o canto inferior esquerdo
//agora é 0.5 mais pra cima e pro lado. Ou seja no centro (por que o circulo mede 1)
// colorTexture.rotation = Math.PI/4

colorTexture.minFilter = THREE.LinearMipMapLinearFilter
//mil filter é pra quando a img vai ser reduzida e o mag pra quando vai ser aumentada
colorTexture.magFilter = THREE.NearestFilter
const gui = new dat.GUI()


gui
    .add(colorTexture, 'rotation')
    .min(0)
    .max(Math.PI*4)
    .step(0.01)
    .name('rotation')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map:colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
