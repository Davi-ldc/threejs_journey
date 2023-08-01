import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter
{
    constructor(){
        super()
        this.start = Date.now()
        this.current = this.now
        this.elapsed = 0 
        this.delta = 16 // pq a galera roda a 16 fps

        window.requestAnimationFrame(()=>{
            this.tick()//pq se agnt chamar direto sem esperar um tick tamo comparando Date.now() com Date.now() e delta vai ser 0 
        })
    }
    
    tick(){
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')
        window.requestAnimationFrame(()=>{
            this.tick()
        })
    }
}