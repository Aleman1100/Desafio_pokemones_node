const axios = require('axios')
const http = require('http')
const url = require('url')
const fs = require('fs')

let pokemonesPromesas = []
let pokemones = []

// Hacer uso de Async/Await para las funciones que consulten los endpoints de la
// pokeapi. (3 Puntos)
async function GetPokename() {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
    const results = response?.data?.results || []
    let total = []
    for (let i = 0; i < results.length; i++){
        const single = await axios.get(results[i].url);
        nombre = single['data']['name']        
        total.push(`${nombre}`)        
    }
    return total
}

async function GetPokeimg(name) {
    const {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return data

}

GetPokename().then((results) => {
    results.forEach((p) => {
        let pokeName = p
        pokemonesPromesas.push(GetPokeimg(pokeName))
    })

    // Usar el Promise.all() para ejecutar y obtener la data de las funciones asíncronas
    // generando un nuevo arreglo con la data a entregar en el siguiente requerimiento.(3 Puntos)
    Promise.all(pokemonesPromesas).then((data) => {
        data.forEach((p) => {  
            let spritePoke = p.sprites.front_default
            let nombrePoke = p.name
            function NewPoke(img,nombre){
                const nuevo = {img,nombre}
                pokemones.push(nuevo)
            }
            NewPoke(spritePoke,nombrePoke)                                 
        })
        fs.writeFile("pokemones.json", JSON.stringify(pokemones), "utf-8", () => {})
        console.log(pokemones)        
    })
})

// Disponibilizar la ruta http://localhost:3000/pokemones que devuelva un JSON con el
// nombre y la url de una imagen de 150 pokemones, así como verás en la siguiente
// imagen. (4 Puntos)
http.createServer((req, res) => {
    if (req.url.includes("/")) {
        res.writeHead(200, {"content-type" : "text/html"})
        fs.readFile("index.html", "utf-8", (err, data) => {
            res.end(data)
        })
    }
    if (req.url.includes("/pokemones")) {
            res.writeHead(200, {"content-type" : "text/html"})
            fs.readFile("pokemones.json", "utf-8", (err, data) => {
                res.end(data)
            })    
    }      
})
.listen(3000, () => console.log("Online"))
