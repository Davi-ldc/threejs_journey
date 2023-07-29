import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

THREE.ColorManagement.enabled = false

let gltf = null
const loader = new GLTFLoader()
loader.load('/models/Duck/glTF-Binary/Duck.glb',(_gltf)=>{
    gltf = _gltf.scene
    scene.add(_gltf.scene)
})
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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)
object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

/**
 * raycaster
 */
const raycaster = new THREE.Raycaster()
// const origen = new THREE.Vector3(-3,0,0)
// const raydirection = new THREE.Vector3(10,0,0)

// const intersec = raycaster.intersectObject(object1)
// const intersecs = raycaster.intersectObjects([object1,object2,object3])
/*
 *distance: distancia entre o objeto e a origem da array 
 *face: cara da geometria
 *object: o objeto q atingiu a array 
 *point: lugar da colisão
 *uv: as cordenadas uv
*/

// raydirection.normalize()//o vector precisa medir 1
// raycaster.set()


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * light
 */
const ambientLight = new THREE.AmbientLight('#ffffff',1)
scene.add(ambientLight)
/**
 * mouse
 */
let mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>{//valores vão de -1 a 1 
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () =>
{
    if(currentIntersect)
    {
        switch(currentIntersect.object)
        {
            case object1:
                console.log('click on object 1')
                break

            case object2:
                console.log('click on object 2')
                break

            case object3:
                console.log('click on object 3')
                break
        }
    }
})


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
let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //animate
    object1.position.y=Math.sin(elapsedTime+1)*1.5
    object2.position.y=Math.sin(elapsedTime+2)*1.5
    object3.position.y=Math.sin(elapsedTime+3)*1.5

    raycaster.setFromCamera(mouse, camera)
    const objectToTest = [object1, object2, object3]



    // const origen = new THREE.Vector3(-3,0,0)
    // const raydirection = new THREE.Vector3(1,0,0)
    // raydirection.normalize()
    // raycaster.set(origen, raydirection)

    const intersecs = raycaster.intersectObjects(objectToTest)
    if (gltf){
        const ModelIntersec = raycaster.intersectObject(gltf)
        if (ModelIntersec.length){
            gltf.scale.set(1.2,1.2,1.2)
        }
        else{
            gltf.scale.set(1,1,1)
        }
    }


    for (const obj of objectToTest){
        obj.material.color.set('#ff0000')
    }
    for (const objetoquetoconalinha of intersecs){
        objetoquetoconalinha.object.material.color.set('#0000ff')
    }

    if(intersecs.length)
    {
        if(!currentIntersect)
        {
            console.log('mouse enter')
        }

        currentIntersect = intersecs[0]
    }
    else
    {
        if(currentIntersect)
        {
            console.log('mouse leave')
        }
        
        currentIntersect = null
    }


    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()