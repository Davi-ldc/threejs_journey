import * as THREE from 'three'
//import tudo como THREE de 'three'

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
//o primeiro arg é o campo de visão enquanto maior mais amplo, o segundo é usado pra calcular como a imagem vai ser renderizada
camera.position.z = 3 // se todo mundo fica junto agente não ve nada
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

/*
Tudo começa com uma cena que pode ter objetos, estes (meches) são formados por um formato como quadrado e um material
como madeira, pedra...
ao contrario de uma camera normal PerspectiveCamera usa perspectiva, ou seja os objetos longe dela são menores.
para podermos ver a cena precisamos renderila com webgl, geralmente dentro de um canvas
*/
