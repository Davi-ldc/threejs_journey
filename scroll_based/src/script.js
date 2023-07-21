import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false

const texturelaoder = new THREE.TextureLoader()
const gradintTexture = texturelaoder.load('/textures/gradients/3.jpg')
gradintTexture.magFilter = THREE.NearestFilter //tira o efeito de gradiente pra formar 3 frases definidas 
/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded',
}

gui
    .addColor(parameters, 'materialColor').onChange( ()=>{
        material.color.set(parameters.materialColor)
        particlematerial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * obj
 */
const material = new THREE.MeshToonMaterial({color:parameters.materialColor, gradientMap:gradintTexture})

const objectsDistance = 4 // distancia entre os objetos


/**
 * particles
 */
const particlesarray = new Float32Array(1000*3)
for (let i = 1; i<1000;i++){
    const i3 = i*3
    particlesarray[i3] = (Math.random() -0.5) *10
    particlesarray[i3+1] = objectsDistance/2 - Math.random() * 15
    particlesarray[i3+2] = (Math.random() -0.5) *10 
}
const particlesGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(particlesarray, 3))
const particlematerial = new THREE.PointsMaterial({color: parameters.materialColor, sizeAttenuation:true, size:0.05})
const particles = new THREE.Points(particlesGeometry, particlematerial)
scene.add(particles)


//funciona com luz
// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

scene.add(mesh1, mesh2, mesh3)


mesh1.position.x= 2
mesh2.position.x= -2 
mesh3.position.x= 2

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2


const meshes = [mesh1, mesh2, mesh3]

/**
 * lights
 */
const light = new THREE.DirectionalLight('#ffffff',1)//sol
scene.add(light)


/**
 * Cursor
 */

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX /sizes.width - 0.5
    cursor.y = event.clientY / sizes.height -0.5

    console.log(cursor)
})


/**
 * scroll
 */
let secao = 0
let scrollY = window.scrollY

window.addEventListener('scroll', ()=>{
    scrollY = window.scrollY 
    console.log(scrollY)

    const novasecao = Math.round(scrollY / sizes.height)
    if (novasecao !== secao){
        secao = novasecao
        gsap.to(meshes[secao].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',//cmc e termina devagar
            x:'+=6',
            y:'+=3',
            z: '+=1.5'

        })
    }
})


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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6


const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
cameraGroup.add(camera)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previusTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previusTime
    previusTime = elapsedTime
    const ParallaxY = cursor.y
    const ParallaxX = -cursor.x

    cameraGroup.position.x += (ParallaxX - cameraGroup.position.x)* 5 * deltaTime
    cameraGroup.position.y += (ParallaxY - cameraGroup.position.y)* 5 * deltaTime

    for (const mesh of meshes){
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }
    camera.position.y = -scrollY / sizes.height * objectsDistance

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()