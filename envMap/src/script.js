import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js'

const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const global = {}
global.envMapIntensity = 1


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = global.envMapIntensity
        }
    })
}
gui.add(global, 'envMapIntensity').min(0).max(10).step(0.001).onChange(()=>{
    updateAllMaterials()
})
gui.add(scene, 'backgroundBlurriness').min(0).max(0.3).step(0.0001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.01)
/**
 * Models
 */
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)
    }
)

// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png',
//     '/environmentMaps/0/nx.png',
//     '/environmentMaps/0/py.png',
//     '/environmentMaps/0/ny.png',
//     '/environmentMaps/0/pz.png',
//     '/environmentMaps/0/nz.png'
// ])
// scene.background = environmentMap
// scene.environment = environmentMap

//hdr (RGBE) equirectangular
// rgbeLoader.load('/environmentMaps/0/2k.hdr',(envMap)=>{
//     envMap.mapping = THREE.EquirectangularReflectionMapping
//     scene.background = envMap
//     scene.environment = envMap
//     console.log(envMap)
// })

// const environmentMap = textureLoader.load('/2.jpg')
// environmentMap.mapping = THREE.EquirectangularReflectionMapping
// environmentMap.colorSpace = THREE.SRGBColorSpace

// scene.background = environmentMap
// scene.environment = environmentMap

// textureLoader.load('/4.jpg', (environmentMap) =>
// {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping
//     scene.environment = environmentMap
//     const skybox = new GroundProjectedSkybox(environmentMap)
//     skybox.scale.setScalar(100)
//     skybox.radius = 120
//     skybox.height = 11
//     gui.add(skybox, 'radius', 1, 200, 0.1).name('skyboxRadius')
//     gui.add(skybox, 'height', 1, 100, 0.1).name('skyboxHeight')
//     scene.add(skybox)
// })

const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace
scene.background = environmentMap

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
    256,
    {
        type: THREE.HalfFloatType
    }
)
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)
scene.environment = cubeRenderTarget.texture

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 1, color: 0xaaaaaa })
)
torusKnot.position.y = 4
torusKnot.position.x = -4

scene.add(torusKnot)

const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
)
holyDonut.layers.enable(1)
holyDonut.position.y = 3.5
scene.add(holyDonut)

/**
 * lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff,1)
scene.add(ambientLight)
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()
    updateAllMaterials()

    if(holyDonut)
    {
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2
        cubeCamera.update(renderer, scene)
    }
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()