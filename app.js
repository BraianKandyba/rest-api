const express = require('express') // utilizamos common js
const movies = require('./movies.json') //llamamos al json
const crypto = require ('node:crypto') // libreria de node
const cors = require('cors')



const { validatedMovie, validatePartialMovie } = require('./schemas/schemas')

const app = express() // creamos la app con express
app.use(express.json())// para acceder al req.body sin la nesesidad de nobrar uno por uno

app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:3000',
        'https://movies.com',
    ]
    if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
    }
    if (!origin) {
        return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
    }
}))
 
 
app.disable('x-powered-by')

app.get('/movies',  (req,res) => { //cada recurso se identifca con una url diferente en este caso recurso movies
    // res.header('Access-Control-Allow-Origin','*')//admite todos los origenes
    const { genre } = req.query //recuperamos los datos que queramos
    
    if(genre){
        const filterMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())//buscamos el genero de la pelicula
            //el genero es un array
        )
        return res.json(filterMovies)
    }
    res.json(movies)
})

app.get('/movies/:id',  (req,res) => { //segmento dinamico
    const {id} = req.params
    const movie = movies.find(movie => movie.id === id)
    if(movie){
        return res.json(movie)
    }
    
    res.status(404).json({message: 'not found'})
})

app.post('/movies', (req,res) => {
    const result = validatedMovie(req.body) // de esta forma aplicamos el esquema de validaciones
    if(result.error){
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    
    const newMovie = {
        id: crypto.randomUUID(), //esto cra un id automaticamente
        ...result.data //si los datos son validos extraemos la info
    }

    movies.push(newMovie)// enviamos los datos
    
    res.status(201).json(newMovie) // si el puhs es satifactorio le enviamos que se creo la pelicula
})

app.patch('/movies/:id', (req,res) => {
    const { id } = req.params //recuperamos la id
    const result = validatePartialMovie(req.body)
    if(result.error){
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const movieIndex = movies.findIndex(movie => movie.id === id) //buscamos la pelicula

    if(movieIndex === -1) return res.status(404).json({message: 'not found'})
    
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    
    movies[movieIndex] = updateMovie
    
    return res.json(updateMovie)
})



const desiredPort = process.env.PORT ?? 3000//buscamos un puerto disponible


app.listen(desiredPort, () => { //escuchamos el puerto para iniciar
    console.log(`server listening on port http://localhost:${desiredPort}`)
})
