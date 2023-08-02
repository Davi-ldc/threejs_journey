import * as THREE from 'three'
import Experience from "./experince";

export default class Renderer
{
    constructor(){
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.size = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.camera
        this.criarRender()
    }
    
    criarRender()
    {
        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: this.canvas,
                antialias: true
            })
        this.renderer.useLegacyLights = true
        this.renderer.toneMapping = THREE.CineonToneMapping
        this.renderer.toneMappingExposure = 1.75
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setSize(this.size.width, this.size.height)
        this.renderer.setPixelRatio(Math.min(this.size.pixel_ratio, 2))
    }
    resize()
    {
        this.renderer.setSize(this.size.width, this.size.height)
        this.renderer.setPixelRatio(Math.min(this.size.pixel_ratio, 2))
    }
    
    update()
    {
        this.renderer.render(this.scene, this.camera)
    }
}