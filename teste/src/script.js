import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


THREE.ColorManagement.enabled = false

/**
 * Base
*/


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
   
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
    // Render
    renderer.render(scene, camera)


    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
