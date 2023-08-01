class Robot//geralmente o nome usa letras maiusculas pra separar palavras
{
    constructor(name, legs)//roda quando agnt cria a classe
    {
        this.name = name
        this.legs = legs

        console.log(`I am ${this.name}. Thank you creator`)

        this.sayHi()
    }

    sayHi()
    {
        console.log(`Hello!, my name is ${this.name} and i have ${this.legs} legs`)
    }
}
// const wallE = new Robot('Wall-E', 0)
// const ultron = new Robot('Ultron', 2)
// const astroBoy = new Robot('Astro Boy', 2)
// console.log(wallE.name)

class FlyingRobot extends Robot
{
    constructor(name, legs){
        super(name, legs)
        super.sayHi()//agora ta se referindo ao primeiro sayhi (a classe robot)
        this.sayHi()//ai sim ta se referindo a essa classe
    }
    takeOff()
    {
        console.log(`Have a good flight ${this.name}`)
    }

    sayHi(){
        console.log(`this class was redifined`)
    }
    land()
    {
        console.log(`Welcome back ${this.name}`)
    }
}
const wallE = new Robot('Wall-E', 0)
const ultron = new FlyingRobot('Ultron', 2)
const astroBoy = new FlyingRobot('Astro Boy', 2)//continua funcionando pq essa classe é filha do robot
astroBoy.sayHi()
astroBoy.takeOff()
astroBoy.land()
wallE.sayHi()
// wallE.takeOff() vai dar erro pq dalle n tem as funções da classe flying robot