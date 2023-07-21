import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// Importe o modelo do fantasma
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { TWEEN } from 'tween.js';



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

//ghosts

const ghosts = []
const ghostSpawnRadius = 20//tamnho do circulo q eles vão nascer
const maxGhosts = 10 //numero maximo de fantasmas 

function loadGhostModel() {
  return new Promise((resolve, reject) => {
    const mtlLoader = new MTLLoader()//material
    mtlLoader.load('/Blinky.mtl', (materials) => {
      materials.preload()

      const objLoader = new OBJLoader()//geometria
      objLoader.setMaterials(materials)
      objLoader.load('/Blinky.obj', (ghost) => {
        const ghostMesh = createGhost(ghost.children[0])

        ghostMesh.rotation.set(0, Math.PI, 0)

        resolve(ghostMesh)
      }, undefined, reject)
    }, undefined, reject)
  })
}


function createGhost(originalGhost) {
  const ghost = originalGhost.clone()
  ghost.scale.set(10, 10, 10)
  ghost.rotation.x = Math.PI / 2
  return ghost
}

function spawnGhost() {
  if (ghosts.length >= maxGhosts) {
    return // Se já houver 10 fantasmas, não cria mais
  }
  loadGhostModel().then((ghostMesh) => {
      const ghost = createGhost(ghostMesh)

      // Gera uma posição aleatória dentro do círculo
      const angle = Math.random() * Math.PI * 2//volta completa
      const x = Math.cos(angle) * ghostSpawnRadius
      const z = Math.sin(angle) * ghostSpawnRadius
      const y = Math.random() * 2 + 1 // Número randômico entre 1 e 3

      ghost.position.set(x, y, z)
      scene.add(ghost)
      ghosts.push(ghost)//salva numa array pra gnt acessar els dps

      // Movimenta o fantasma em direção às paredes
      moveGhostTowardsWalls(ghost)
  }).catch((error) => {
      console.error('Erro ao carregar o modelo do fantasma:', error)
  })
}
function moveGhostTowardsWalls(ghost) {
  const speed = 0.000069 // Velocidade do movimento

  const direction = new THREE.Vector3() // Vetor de direção
  direction.subVectors(walls.position, ghost.position).normalize() // Subtrai as posições e normaliza o vetor

  ghost.position.add(direction.multiplyScalar(speed))

  // Verifica se o fantasma chegou perto o suficiente da posição da casa
  if (ghost.position.distanceTo(walls.position) < 3) {
    
  } else {
    requestAnimationFrame(() => moveGhostTowardsWalls(ghost))
  }
}

setInterval(spawnGhost, 1000)

//pontuação
let score = 0

// Elemento HTML para exibir a pontuação
const scoreElement = document.createElement('div')
scoreElement.id = 'score'
scoreElement.style.position = 'absolute'
scoreElement.style.top = '10px'
scoreElement.style.left = '10px'
scoreElement.style.color = 'white'
scoreElement.style.fontSize = '24px'
document.body.appendChild(scoreElement)

function updateScore() {
  scoreElement.textContent = `Pontuação: ${score}`
}
updateScore()

function removeGhost(ghost) {
  scene.remove(ghost)
  ghosts.splice(ghosts.indexOf(ghost), 1)
  score++
  updateScore()
}



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(16, 16)
grassAmbientOcclusionTexture.repeat.set(16, 16)
grassNormalTexture.repeat.set(16, 16)
grassRoughnessTexture.repeat.set(16, 16)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping


/**
 * House
 */

const house = new THREE.Group()
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for(let i = 0; i < 200; i++)
{
    const angle = Math.random() * Math.PI * 2 
    const radius = Math.random() * 20      
    const x = Math.cos(angle) * radius        
    const z = Math.sin(angle) * radius        

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.castShadow = true
    
    grave.position.set(x, 0.3, z)                              

    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    graves.add(grave)
}

house.add(walls)
scene.add(house)




// Floor
const floorGeometry = new THREE.PlaneGeometry(40, 40)
const floor = new THREE.Mesh(
    floorGeometry,
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)





/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.06)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.06)
moonLight.position.set(4, 5, - 2)
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff7d46', 1, 7,)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)


const light1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(light1)

const light2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(light2)

const light3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(light3)

const light4 = new THREE.PointLight('#04d4cd', 2, 3)
scene.add(light4)


/**
 * Fog
 */
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog



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
camera.position.set(0.16077357252516764, 0.6617561511686992, 6.673547081932347)
scene.add(camera)




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.type = THREE.PCFSoftShadowMap


moonLight.castShadow = true
doorLight.castShadow = true
light1.castShadow = true
light2.castShadow = true
light3.castShadow = true
light4.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
floor.receiveShadow = true


//controls
const controls = new PointerLockControls(camera, document.body)

let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward = true
      break
    case 'KeyS':
      moveBackward = true
      break
    case 'KeyA':
      moveLeft = true
      break
    case 'KeyD':
      moveRight = true
      break
  }
})

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward = false
      break
    case 'KeyS':
      moveBackward = false
      break
    case 'KeyA':
      moveLeft = false
      break
    case 'KeyD':
      moveRight = false
      break
  }
})

const moveSpeed = 0.1



// Tela Inicial
let startsc = true
const startScreen = document.createElement('div')
startScreen.classList.add('start-screen')
startScreen.textContent = 'WASD e MOUSE movimentam. Aperte em qualquer lugar para jogar'
document.body.appendChild(startScreen)

// Habilitar controles ao clicar na tela inicial
startScreen.addEventListener('click', () => {
  startScreen.remove()
  controls.lock()
  startsc = false
  moonLight.intensity = 0.12
  ambientLight.intensity = 0.12
})


//vida
let cube; // Defina a variável cube no escopo global


function createLifeCube(x,y,z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  cube = new THREE.Mesh(geometry, material); // Atribua o Mesh ao cube global

  cube.position.set(x, y, z);
  return cube
}



// Chame a função createLifeCube() para criar o cubo
const c1 = createLifeCube(0,5,0);
const c2 = createLifeCube(1.2,5,0);
const c3 = createLifeCube(-1.2,5,0);
scene.add(c1,c2,c3);



// Função de animação
function animateCube() {
  c1.rotation.x += 0.01;
  c1.rotation.y += 0.01;

  c2.rotation.x += 0.01;
  c2.rotation.y += 0.01;

  c3.rotation.x += 0.01;
  c3.rotation.y += 0.01;
}




//tela de contratado pelo vasco
function checkBoundaries(position) {
    const floorSize = 40
    const halfFloorSize = floorSize / 2

    if (
        position.x < -halfFloorSize ||
        position.x > halfFloorSize ||
        position.z < -halfFloorSize ||
        position.z > halfFloorSize
    ) {
        // O jogador saiu dos limites do floor
        showGameOverScreen()
        controls.unlock()
    }
}

function showStartScreen() {
    if(!gameover){
    // Crie uma div para a tela inicial
    const startScreen = document.createElement('div')
    startScreen.classList.add('start-screen')
    startScreen.textContent = 'Proteja a casa!'
    document.body.appendChild(startScreen)
  
    // Habilitar controles ao clicar na tela inicial
    startScreen.addEventListener('click', () => {
      startScreen.remove()
      controls.lock()
      moonLight.intensity = 0.12
      ambientLight.intensity = 0.12
      gamePaused = false
    })
  }}




controls.addEventListener( 'unlock', function () {
  if(!gameover){
    // Crie uma div para a tela inicial
    const startScreen = document.createElement('div')
    startScreen.classList.add('start-screen')
    startScreen.textContent = 'Jogo pausado. Aperte em qualquer lugar para jogar'
    document.body.appendChild(startScreen)
  
    // Habilitar controles ao clicar na tela inicial
    startScreen.addEventListener('click', () => {
      startScreen.remove()
      controls.lock()
      moonLight.intensity = 0.12
      ambientLight.intensity = 0.12
      gamePaused = false
    })
  }})
let gameover;
function showGameOverScreen() {
    // Remova o canvas existente
    document.body.innerHTML = ''
    gameover =true

    // Crie um elemento de áudio para reproduzir a música
    const audioElement = document.createElement('audio')
    audioElement.src = '/Vlasco.mp3'
    audioElement.loop = true
    audioElement.autoplay = true
    controls.unlock()
    setInterval(()=>{
        location.reload(true)
    }, 3000)
    gameOverScreen.appendChild(audioElement)
    
    

    // Crie uma div para a tela de game over
    const gameOverScreen = document.createElement('div')
    gameOverScreen.classList.add('game-over-screen')


    // Crie um elemento de imagem para exibir a imagem
    const imageElement = document.createElement('img')
    imageElement.src = '/vasco.png'
    imageElement.alt = 'Game Over'
    gameOverScreen.appendChild(imageElement)


    // Texto de game over
    const gameOverText = document.createElement('h1')
    gameOverText.textContent = 'Você acaba de ser contratado pelo GIGANTE'

    // Botão de jogar novamente
    const playAgainButton = document.createElement('button')
    playAgainButton.textContent = 'Jogar novamente'

    // Adicione o texto e o botão à tela de game over
    gameOverScreen.appendChild(gameOverText)
    gameOverScreen.appendChild(playAgainButton)

    // Adicione a tela de game over ao corpo do documento
    document.body.appendChild(gameOverScreen)

    // Defina um ouvinte de eventos para o botão de jogar novamente
    playAgainButton.addEventListener('click', () => {
        // Recarregue a página para reiniciar o jogo
        location.reload()
    })
}

//colisions
  
let previousPlayerPosition = new THREE.Vector3()

function checkCollision(position) {
  const wallsSizes = new THREE.Vector3(4, 2.5, 4)

  // Check collision with walls
  const playerHalfWidth = 0.5
  const playerHalfHeight = 1.5
  const playerHalfDepth = 0.5

  const playerBox = new THREE.Box3(
    new THREE.Vector3(
      position.x - playerHalfWidth,
      position.y - playerHalfHeight,
      position.z - playerHalfDepth
    ),
    new THREE.Vector3(
      position.x + playerHalfWidth,
      position.y + playerHalfHeight,
      position.z + playerHalfDepth
    )
  )

  const wallsBox = new THREE.Box3(
    new THREE.Vector3(
      -wallsSizes.x / 2,
      0,
      -wallsSizes.z / 2
    ),
    new THREE.Vector3(
      wallsSizes.x / 2,
      wallsSizes.y,
      wallsSizes.z / 2
    )
  )

  // Check collision with walls
  if (playerBox.intersectsBox(wallsBox)) {
    // Handle collision with walls
    controls.getObject().position.copy(previousPlayerPosition)
  }

  // Check collision with door
  const doorHalfWidth = 1.1
  const doorHalfHeight = 1.1
  const doorHalfDepth = 0.1

  const doorBox = new THREE.Box3(
    new THREE.Vector3(
      house.position.x + door.position.x - doorHalfWidth,
      house.position.y + door.position.y - doorHalfHeight,
      house.position.z + door.position.z - doorHalfDepth
    ),
    new THREE.Vector3(
      house.position.x + door.position.x + doorHalfWidth,
      house.position.y + door.position.y + doorHalfHeight,
      house.position.z + door.position.z + doorHalfDepth
    )
  )

  // Check collision with door
  if (playerBox.intersectsBox(doorBox)) {
    // Handle collision with door
    controls.getObject().position.copy(previousPlayerPosition)
  }

  // Store the current position as the previous position for the next frame
  previousPlayerPosition.copy(position)
}







// Crosshair
const crosshairTexture = new THREE.TextureLoader().load('/chrosshair.png')
const crosshairSize = 0.2

const crosshairGeometry = new THREE.PlaneGeometry(crosshairSize, crosshairSize)
const crosshairMaterial = new THREE.MeshBasicMaterial({ map: crosshairTexture, transparent: true })
const crosshairMesh = new THREE.Mesh(crosshairGeometry, crosshairMaterial)

crosshairMesh.position.z = -1
camera.add(crosshairMesh)


//lazer

// Função para criar um gradiente de cores
function createGradientMaterial(color1, color2) {
  const gradientCanvas = document.createElement('canvas')
  gradientCanvas.width = 256
  gradientCanvas.height = 1

  const gradientContext = gradientCanvas.getContext('2d')
  const gradient = gradientContext.createLinearGradient(0, 0, gradientCanvas.width, 0)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)

  gradientContext.fillStyle = gradient
  gradientContext.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height)

  const gradientTexture = new THREE.CanvasTexture(gradientCanvas)
  gradientTexture.wrapS = THREE.ClampToEdgeWrapping
  gradientTexture.wrapT = THREE.ClampToEdgeWrapping

  const gradientMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.8,
      transparent: true,
      map: gradientTexture
  })

  return gradientMaterial
}


// Array para armazenar os lasers disparados
const lasers = []
let canShoot = true
const shootCooldown = 0.001 // Tempo de espera entre os disparos do laser em segundos

// Função para atirar
function shoot() {
    if (!canShoot) return

    // Criar uma partícula que se parece com um laser
    const laserGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.4)
    const laserMaterial = createGradientMaterial('#0000ff', '#ff0000')
    const laser = new THREE.Mesh(laserGeometry, laserMaterial)

    // Posicionar o laser na mesma posição da câmera
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    laser.position.copy(camera.position)
    laser.position.addScaledVector(cameraDirection, 1) // Ajustar a posição para a frente da câmera

    // Definir a velocidade do laser
    const laserSpeed = Math.random() *1+0.3
    const laserVelocity = cameraDirection.multiplyScalar(laserSpeed)
    laser.userData.velocity = laserVelocity

    // Adicionar o laser à cena
    laser.lookAt(laser.position.clone().add(laser.userData.velocity))
    scene.add(laser)
    lasers.push(laser)

    // Aguardar o tempo de espera entre os disparos
    canShoot = false
    setTimeout(() => {
        canShoot = true
    }, shootCooldown * 1000)


}

// Atualização dos lasers
function updateLasers() {
    lasers.forEach((laser, index) => {
        // Atualizar a posição do laser com base na sua velocidade
        laser.position.add(laser.userData.velocity)
        laser.lookAt(laser.position.clone().add(laser.userData.velocity))


        // Remover o laser da cena se sair dos limites
        const maxDistance = 100 // Distância máxima que o laser pode percorrer
        if (laser.position.distanceTo(camera.position) > maxDistance) {
            laser.geometry.dispose();
            laser.material.dispose();
            scene.remove(laser)
            lasers.splice(index, 1)
        }
    })
}

// Event listener para o disparo do laser
window.addEventListener('click', shoot)

let lives = 3
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
   
    updateLasers()
    checkBoundaries(controls.getObject().position)
    animateCube()
    const elapsedTime = clock.getElapsedTime()

    

    const playerPosition = controls.getObject().position
    checkCollision(playerPosition)

    
    // Update controls

    const cameraDirection = controls.getDirection(new THREE.Vector3()).clone()
    const cameraRight = new THREE.Vector3()
    cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize()
    
    if (moveForward) {
      controls.getObject().position.addScaledVector(cameraDirection, moveSpeed)
    }
    if (moveBackward) {
      controls.getObject().position.addScaledVector(cameraDirection, -moveSpeed)
    }
    if (moveLeft) {
      controls.getObject().position.addScaledVector(cameraRight, -moveSpeed)
    }
    if (moveRight) {
      controls.getObject().position.addScaledVector(cameraRight, moveSpeed)
    }
    console.log(lives)

    //atualiza fantasmas
    if (!startsc){
    ghosts.forEach((ghost) => {
      moveGhostTowardsWalls(ghost)
      if (ghost.position.distanceTo(walls.position) < 3){
        lives--
        if (lives===2){
          scene.remove(c3)
        }
        if (lives===1){
          scene.remove(c2)
        }

        if (lives <= 0) {
          // Todas as vidas foram perdidas, mostrar tela de game over
          showGameOverScreen()
          controls.unlock()
       } 
       removeGhost(ghost)

      }
    })}

 
    // Lights
    const light1Angle = elapsedTime * 0.5
    light1.position.x = Math.cos(light1Angle) * 4
    light1.position.z = Math.sin(light1Angle) * 4
    light1.position.y = Math.sin(elapsedTime * 3)

    const light2Angle = - elapsedTime * 0.32
    light2.position.x = Math.cos(light2Angle) * 5
    light2.position.z = Math.sin(light2Angle) * 5
    light2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const light3Angle = - elapsedTime * 0.18
    light3.position.x = Math.cos(light3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    light3.position.z = Math.sin(light3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    light3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    camera.position.y=0.5

    const light4Angle = - elapsedTime * 0.6
    light4.position.x = Math.cos(light4Angle) * (7 + Math.sin(elapsedTime * 0.32))
    light4.position.z = Math.sin(light4Angle) * (7 + Math.sin(elapsedTime * 0.5))
    light4.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    camera.position.y=0.5

      // Verificar colisões entre os lasers e os fantasmas
    lasers.forEach((laser) => {
      ghosts.forEach((ghost) => {
        const laserBox = new THREE.Box3().setFromObject(laser)
        const ghostBox = new THREE.Box3().setFromObject(ghost)
        if (laserBox.intersectsBox(ghostBox)) {
          removeGhost(ghost)
          // Remover o laser da cena se atingir um fantasma
          scene.remove(laser)
          lasers.splice(lasers.indexOf(laser), 1)
        }
      })
    })


    
  

    
    // Render
    renderer.render(scene, camera)


    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
