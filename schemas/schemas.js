const zod = require('zod') //zod nos ayuda en las validaciones


const movieSchema = zod.object({// con esto podemos ponerle las validaciones nesesarias
    title: zod.string({ //tambien podemos poner mesajes para identificar los errores
        invalid_type_error: 'el nombre de la pelicula debe ser un string',
        required_error: 'el titulo es requerido'
    }),
    year: zod.number().int().positive().min(1900).max(2024), //podemos encadenar las validaciones
    director: zod.string(),
    duration: zod.number().int().positive(),
    rate: zod.number().min(0).max(10),
    poster: zod.string().url().endsWith('.jpg'),
    genre: zod.array(//con esto limitamos el numero de opciones
        zod.enum(['Accion','Adventure','Comedy','Drama','Fantasy','Horror','Sci-Fi'])
    )
})


function validatedMovie (input) {
    return movieSchema.safeParse(input)
}

function validatePartialMovie (input) {
    return movieSchema.partial().safeParse(input)// partial hace que todas las propiedades sean opcionales
}

module.exports = {
    validatedMovie,
    validatePartialMovie
}
