import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**
 * Sizes
 */
const sizes = {
    width: 1000,
    height: 800
}

/**
 * Camera 
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0,0,3)


scene.add(camera)


/**
 * Objects 
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.x = 0
// mesh.position.length()//distancia dele pro centro da cena
// mesh.position.distanceTo(camera.position)//distancia pra alguma coisa 
// mesh.position.normalize()//reduz a distancia de objeto pro centro da camera pra 1
// mesh.position.set(0,0,1)//xyz
// mesh.scale.set(1,1,1)//xyz


const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
mesh2.position.x = 1.2

const mesh3 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,), new THREE.MeshBasicMaterial({ color: 0x0000ff }))
mesh3.position.x = -1.2
const grupo = new THREE.Group()
scene.add(grupo)
grupo.add(mesh, mesh2, mesh3)
grupo.rotateY(1)

/* dependendo do jeito q vc rotanciona um objeto um eixo fica prezo https://pt.wikipedia.org/wiki/Gimbal_lock
pra resolver isso podemos mudar a ordem em que a rotação é aplicada tipo mesh.rotation.reorder('yxz') ou usar
Quaternions*/

//mostra os eixos
const helper = new THREE.AxesHelper()
helper.position.set(1,0,0)
scene.add(helper)


camera.lookAt(grupo.position)//olha pra o cubo

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)