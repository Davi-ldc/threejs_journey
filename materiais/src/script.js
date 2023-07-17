import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

//textures 
const textureLoader = new THREE.TextureLoader()
const cubeLoader = new THREE.CubeTextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeLoader.load([
    '/textures/environmentMaps/1/px.jpg',//x
    '/textures/environmentMaps/1/nx.jpg',//-x
    '/textures/environmentMaps/1/py.jpg',//y
    '/textures/environmentMaps/1/ny.jpg',//-y
    '/textures/environmentMaps/1/pz.jpg',//z
    '/textures/environmentMaps/1/nz.jpg'//-z
])
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('green')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap =doorAlphaTexture
//material.side = THREE.DoubleSide //pra poder ver os 2 lados do plano 

//const material = new THREE.MeshNormalMaterial()
//muito bom para ver o formato de um objeto e as caracteristicas dele.
// Ele atribui uma cor diferente a cada face do objeto com base na direção da normal

// const material = new THREE.MeshMatcapMaterial()//literalmente MeshBasicMaterial so que melhor
// material.matcap = matcapTexture4
//ao invez de empacotar a textura como o MeshBasicMaterial ele pega os pixels da textura e os move
//para o objeto 3d, dessa forma imagens 2d de texturas como /textures/matcaps/1.png perdem o efeito
//2d que é mantido pelo MeshBasicMaterial
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial()//loge fica preto e perto branco, bom pra coisas jogos com zombies nublados

// const material = new THREE.MeshLambertMaterial() //usa a luz pra progetar os objetos

// const material = new THREE.MeshPhongMaterial()//MeshLambertMaterial so que com reflexão da luz
// material.shininess = 1000//intencidade da reflexão da luz
// material.specular = new THREE.Color(0x1188ff)//cor da reflexão


// const material = new THREE.MeshToonMaterial()//efeito cartunistico 
// material.gradientMap = gradientTexture
const material = new THREE.MeshStandardMaterial()//mais usado pq é parecido com o blender
material.roughness = 0.2
material.metalness = 0.7
material.envMap = environmentMapTexture//ambiente envolta da cena
// material.transparent = true
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.displacementMap = doorHeightTexture
// material.side = THREE.DoubleSide
// material.roughnessMap = doorRoughnessTexture
// material.metalnessMap = doorMetalnessTexture
// material.normalMap = doorNormalTexture
// material.alphaMap = doorAlphaTexture

//guo pro StandardMaterial

const gui = new dat.GUI()
gui.add(material, 'roughness').min(0).max(1).step(0.01)
gui.add(material, 'metalness').min(0).max(1).step(0.01)
// gui.add(material, 'displacementScale').min(0).max(1).step(0.01)
// gui.add(material.normalScale, 'x').min(0).max(1).step(0.01)
// gui.add(material.normalScale, 'y').min(0).max(1).step(0.01)

// gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01).onChange( ()=>{
//     material.needsUpdate = true 
// })

/*Enquanto o Map é uma textura usada para adicionar detalhes e cor a um objeto 3D (textura),
 o aoMap é um tipo específico de textura que simula sombras suaves com base na oclusão ambiental.
No geral se usa aoMap junto com a textura para contornar malhor as partes escuras
ai você pega a textura refaz ela so com o contorno e o resto e branco e combina ela com a textura original
para destacar o contorno (botando uma textura em cima da outra ignorando as partes em branco) */

//gui feita pra MeshMatcapMaterial
// const gui = new dat.GUI()
// const materialFolder = gui.addFolder('Material')
// materialFolder.add(material, 'transparent')
// materialFolder.add(material, 'opacity', 0, 1)
// materialFolder.add(material, 'wireframe')

// //flatShading
// gui.add(material, 'flatShading').onChange(value => {
//     material.flatShading = value //true or false
//     material.needsUpdate = true // atualiza o material
//   })

// //color
// materialFolder.addColor(material, 'color')

// //side
// const sideOptions = {
//     Front: THREE.FrontSide,
//     Back: THREE.BackSide,
//     Double: THREE.DoubleSide
//   }
  
// gui.add(material, 'side', sideOptions).onChange(value => {
//     material.side = value
//   })

// //textures
// const textureControls = {

//     a: () => {
//     material.matcap = matcapTexture1
//     material.needsUpdate = true
//     },
//     b: () => {
//     material.matcap = matcapTexture2
//     material.needsUpdate = true
//     },
//     c: () => {
//         material.matcap = matcapTexture3
//         material.needsUpdate = true
//     },
//     removeTexture: ()=>{
//       material.matcap = null
//       material.needsUpdate = true

//     }
//   }

// materialFolder.add(textureControls, 'a')
// materialFolder.add(textureControls, 'b')
// materialFolder.add(textureControls, 'c')
// materialFolder.add(textureControls, 'removeTexture')




const esfera = new THREE.Mesh(new THREE.SphereGeometry(0.5,64,64), material)
esfera.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1,100,100), material)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3,0.2,64,128), material)
torus.position.x =1.5
scene.add(esfera, plane, torus)

/**
 * ligths
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
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

    //atualiza os objetos
    esfera.rotation.set(1*elapsedTime,1*elapsedTime,0)
    plane.rotation.set(1*elapsedTime,1*elapsedTime,0)
    torus.rotation.set(1*elapsedTime,1*elapsedTime,0)



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()