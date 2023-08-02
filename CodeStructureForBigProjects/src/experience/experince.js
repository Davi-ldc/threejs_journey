import * as THREE from 'three'
import Sizes from "./utils/sizes"
import Time from "./utils/time"
import Camera from './camera'
import Renderer from './renderer'
import World from '../world/world.js'

let instance = null
export default class Experience
{
    constructor(canvas){

        if(instance)
        {
            return instance
        }
        instance = this

        window.Experience = this
        this.canvas = canvas

        this.sizes = new Sizes()
        this.Time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.render = new Renderer()
        this.world = new World()

        this.sizes.on('resize', ()=>{
            //a função vai ouvir o evento gerado pela outra classe
            this.resize()
        })

        this.Time.on('tick', ()=>{
            this.update()
        })
    }

    resize()
    {

        this.camera.resize()
        this.render.resize()
    }

    update()
    {
        this.camera.update()
        this.render.update()
    }

}
//a classe time contra o tick e aciona um evento td vez q um tick acontece, ai agnt escuta ele e chama a função update