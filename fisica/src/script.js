import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON, { Vec3 } from 'cannon'

THREE.ColorManagement.enabled = false

const som = new Audio('/sounds/hit.mp3')
const tocaSom = (força)=>{//força é pq se for uma mini colisão n vai ter som 
    if (força.contact.getImpactVelocityAlongNormal()> 1.5){
        som.volume = Math.random()
        som.currentTime =0
        som.play()
}
}
/**
 * Debug
 */
const gui = new dat.GUI()
const objct = {}
objct.creatShere = () => {
    creatShere(Math.random(), {
        x:(Math.random()-0.5) *3,
        y: Math.random()*10,
        z: (Math.random()-0.5) * 3
     })
}
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * phisics
 */

const word = new CANNON.World()
word.gravity.set(0, - 9.82, 0)
word.broadphase = new CANNON.SAPBroadphase(word)//algoritimo de colisão
word.allowSleep = true //se um objeto ta parado agnt n vai testar se ele esta colidindo com alguem
// const plastico = new CANNON.Material('plastico')//plastico é o nome
// const concreto = new CANNON.Material('concreto')
const mpadrao = new CANNON.Material('mpadrao')

const Defautmaterial = new CANNON.ContactMaterial(
    mpadrao,
    mpadrao,
    {
        friction: 0.1,
        restitution: 0.9
    }
)
word.addContactMaterial(Defautmaterial)
word.defaultContactMaterial= mpadrao

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)


const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.material = mpadrao
floorBody.addShape(floorShape)
word.addBody(floorBody)

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)//rotacionando o plano pra olhar pra cima
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const geometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})



const objetctoupdate = []
const creatShere = (raio, posição) =>{
    const mesh = new THREE.Mesh(
        geometry, material
    )
    mesh.scale.set(raio,raio,raio)
    mesh.castShadow = true
    mesh.position.copy(posição)
    scene.add(mesh)

    const shape = new CANNON.Sphere(raio)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: Defautmaterial
    })
    body.position.copy(posição)
    body.addEventListener('collide', tocaSom)
    word.addBody(body)
    objetctoupdate.push({mesh: mesh, body: body})
}
creatShere(0.5,{x:0,y:3,z:0})


// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})
const createBox = (width, height, depth, position) =>
{
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: Defautmaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', tocaSom)

    word.addBody(body)

    objetctoupdate.push({ mesh, body })
}

createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })

objct.createBox = () =>
{
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}

objct.reset = () =>
{
    for(const object of objetctoupdate)
    {
        object.body.removeEventListener('collide', tocaSom)
        word.removeBody(object.body)

        scene.remove(object.mesh)
    }
}
gui.add(objct, 'reset')
gui.add(objct, 'createBox')
gui.add(objct, 'creatShere')


/**
 * Animate
 */
const clock = new THREE.Clock()
let time = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime-time
    time = elapsedTime

    //update fisics 
    
    word.step(1/60,delta,3)
    //60 FPS, delta time, e quanto steps ele pode fazer se ficar atrazado 
    for (const object of objetctoupdate){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()