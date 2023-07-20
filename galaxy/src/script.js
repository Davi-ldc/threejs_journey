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
 * Test cube
 */
const parametros = {
    count:100000,
    size:0.01,
    radios:2,
    divisao:5,
    spin: 2,
    random:0.2,
    randompower:10,
    sizeAttenuation:true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    insideColor:'#ff6030',
    outsideColor:'#1b3984'

}


let geometry, material, particles = null

const generateG = ()=>{
    //manda a galaxya antiga pro vasco
    if (particles !== null){
        geometry.dispose()
        material.dispose()
        scene.remove(particles)
    }
    const colorInside = new THREE.Color(parametros.insideColor)
    const colorOutside = new THREE.Color(parametros.outsideColor)

    
    
    const geometryarray = new Float32Array(parametros.count*3)
    const colors = new Float32Array(parametros.count*3)


    //geometria
    for (let i = 0; i<parametros.count; i++){
        const i3 = i * 3
        //para i = 0 i3 é x, i3+1 é y e i3 + 2 = z 
        //para i = 1 i3(3) é x mais se fosse i sem multiplicar por 3 seria y do primeiro vertice
        
        
        const radius = Math.random() * parametros.radios
        const branchAngle = (i % parametros.divisao) / parametros.divisao * Math.PI * 2
        //calcula um angulo com o resto da divisão de i por parametros.divisao 
        const spinAngle = radius * parametros.spin//quando vc aumenta o raio o tamnho aumenta por causa do spin
        
        const randomX = Math.pow(Math.random(), parametros.randompower) * (Math.random() <0.5? 1:-1)
        const randomY = Math.pow(Math.random(), parametros.randompower) * (Math.random() <0.5? 1:-1)
        const randomZ = Math.pow(Math.random(), parametros.randompower) * (Math.random() <0.5? 1:-1)
        //                                                                   se menor q 0.5 então 1 se n -1
        //a n ser q o numero seja 1 ou 0, quanto elevamos random a x  o numero diminue
        
        
        geometryarray[i3    ] = Math.cos(branchAngle+spinAngle) * radius + randomX
        geometryarray[i3 + 1] = randomY
        geometryarray[i3 + 2] = Math.sin(branchAngle+spinAngle) * radius + randomZ

        // cor 
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parametros.radios)

        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

    }
    
    geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(geometryarray, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors,3))
    material = new THREE.PointsMaterial({size:parametros.size,
        sizeAttenuation: parametros.sizeAttenuation,
        depthWrite: parametros.depthWrite,
        blending: parametros.blending,
        vertexColors: true
    })
    

    particles = new THREE.Points(geometry,material)
    scene.add(particles)
}

generateG()

gui.add(parametros, 'count').min(1).max(300000).onFinishChange(generateG)
gui.add(parametros, 'size').min(0.01).max(1).onFinishChange(generateG)
gui.add(parametros, 'radios').min(0.1).max(8).onFinishChange(generateG)
gui.add(parametros, 'divisao').min(2).max(15).step(1).onChange(generateG)
gui.add(parametros, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateG)
gui.add(parametros, 'random').min(0).max(2).step(0.001).onFinishChange(generateG)
gui.add(parametros, 'randompower').min(0).max(50).step(0.001).onFinishChange(generateG)

gui.addColor(parametros, 'insideColor').onFinishChange(generateG)
gui.addColor(parametros, 'outsideColor').onFinishChange(generateG)


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
camera.position.x = 3
camera.position.y = 3
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



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()