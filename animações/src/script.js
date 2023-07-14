import * as THREE from 'three'
import gsap from 'gsap'
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//função de animação:

//tempo
const clock = new THREE.Clock()

gsap.to(mesh.position, {duration:2, delay:2, x:2,y:1.5})

const tick = () =>
{


    const elapsedTime = clock.getElapsedTime()
    console.log(elapsedTime)
    // atualiza objetos
    // mesh.position.set(Math.cos(elapsedTime),Math.sin(elapsedTime),0)
    // mesh.rotation.set(elapsedTime,elapsedTime,elapsedTime)
    //mesh.rotation.y = elapsedTime*(Math.PI*2) //uma volta por segundo
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
/*se na função acima vc usar so rotation.y += 0.01 dependendo do fps o
 cubo gira mais rapido por isso usamos o tempo como referencia*/