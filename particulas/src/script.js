import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * particles
 */
// Geometry
const tl = new THREE.TextureLoader()
const map = tl.load('/textures/particles/2.png')


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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1,1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
 * particles
 */
// Geometry

const count = 25000

const positions = new Float32Array(count*3)//caunt é o numero d particulas e ta vezes 3 pq e xyz
const colors = new Float32Array(count*3)//*3 pq é rgb
for (let i = 1; i<count*3; i++){
    positions[i] = (Math.random()-0.5) *10
    colors[i] = Math.random()-0.01
}




const particlesGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3))
const particlesmaterial = new THREE.PointsMaterial({sizeAttenuation:true })
// sizeAttenuation é perpectiva 

particlesmaterial.vertexColors=true// pra usar as cores q eu criei

// particlesmaterial.color = new THREE.Color(0xff88cc)
particlesmaterial.alphaMap = map
particlesmaterial.alphaTest = 0.001 //deixa o material mais transparente
//particlesmaterial.depthTest = false //agora se vc tiver uma esfera atraz de um cubo a gpu so desenha os 2 idependente de quem ta na frente
//particlesmaterial.depthWrite = false // mesma coisa do di cima mais se tiver z positivo não desenha nada que ta atraz dele
particlesmaterial.blending = THREE.AdditiveBlending//quando 2 particulas tão no msm pixel, ele soma as cores dela (pode ser pesado)
particlesmaterial.transparent = true
particlesmaterial.size = 0.1

const particles = new THREE.Points(particlesGeometry, particlesmaterial)
scene.add(particles)



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
camera.position.z = 3


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

    // particles.rotation.y = elapsedTime*0.25


    for(let i = 0; i < count; i++)
    {
        let i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)//x é pra dar o efeito de onda, já que quando mais pra direta maior o valor d x. ai agnt add elapsed time pra dar o efeito de animação
    }
    particlesGeometry.attributes.position.needsUpdate = true



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()