/*Debug ui é uma janelinha que aparece no canto da tela e te possibilita
mudar os parametros de forma eficiente rpa achar o melhor valor para eles*/
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
*/
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Debug
 */
const gui = new dat.GUI()
// gui.add(mesh.position, 'y').min(- 3).max(3).step(0.01)
//adicione a opção de mudar a posição y o minimo é -3 o maximo é 3 e vai aumentando/diminuindo de 0.01 em 0.01
gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation')

gui.add(mesh, 'visible')
gui.add(material, 'wireframe')


const subdivisionOptions = { subdivisions: 1 }; // Valor inicial é 1
const size = { s: 1 };
//subdivision
const updateGeometrySubDiv = () => {
  // remove-a do mesh
  mesh.geometry.dispose();

  const newGeometry = new THREE.BoxGeometry(
    size.s,
    size.s,
    size.s,
    subdivisionOptions.subdivisions,
    subdivisionOptions.subdivisions,
    subdivisionOptions.subdivisions
  );

  // Atualizando a geometria do mesh
  mesh.geometry = newGeometry;
};

gui
  .add(subdivisionOptions, "subdivisions")
  .min(1)
  .max(10)
  .step(1)
  .name("Subdivisões")
  .onChange(updateGeometrySubDiv);

//sizes
const updateSize = () => {
  mesh.geometry.dispose();

  const newGeometry = new THREE.BoxGeometry(
    size.s,
    size.s,
    size.s,
    subdivisionOptions.subdivisions,
    subdivisionOptions.subdivisions,
    subdivisionOptions.subdivisions
  );

  mesh.geometry = newGeometry;
};

gui
  .add(size, "s")
  .min(1)
  .max(10)
  .step(1)
  .name("Tamanho")
  .onChange(updateSize);
  
const parameters = {
    color: 0xff0000
}
//color
gui
    .addColor(parameters, 'color')
    .onChange(() =>
    {
        material.color.set(parameters.color)
    })

//spin
const rotation = {
    spin: () =>
    {
        gsap.to(mesh.rotation, {duration: 0.8, y: mesh.rotation.y + Math.PI * 2 })
    }
}
gui.add(rotation, 'spin')

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