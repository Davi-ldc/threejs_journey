import * as THREE from 'three'
import Experience from "./experince";
import EventEmitter from "./utils/EventEmitter";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


export default class Camera extends EventEmitter
{
    constructor(){
        super()
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.createCamera()
        this.createControls()
    }

    createCamera(){
        this.camera = new THREE.PerspectiveCamera(
            35,
            this.sizes.height/this.sizes.width,
            0.1,
            100
            )
        this.scene.add(this.camera)
        this.camera.position.set(0,1,0)
    }

    createControls(){
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
    }

    resize(){
        this.camera.aspect = this.sizes.height/this.sizes.width
        this.camera.updateProjectionMatrix()
    }

    update(){
        this.controls.update()
        console.log(this.camera.position)
    }
}