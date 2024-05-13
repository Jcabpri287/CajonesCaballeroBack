"use strict"
import{check, validationResult} from 'express-validator'

export const validacion=[
  check("nombre").exists().notEmpty().withMessage("El nombre no puede estar vacío."),
  check("correo").exists().notEmpty().withMessage("El correo no puede estar vacío.").isEmail().withMessage("El correo debe ser válido."),
  check("contraseña").exists().notEmpty().withMessage("La contraseña no puede estar vacía.").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres."),
  check("direccion").exists().notEmpty().withMessage("La dirección no puede estar vacía."),
  check("telefono").exists().notEmpty().withMessage("El teléfono no puede estar vacío.").isNumeric().withMessage("El teléfono debe ser un número."),
    (req, res, next)=>{
        const errors=validationResult(req); //array tantas filas como campos valide
        if (!errors.isEmpty()){
            res.status(400).json({
                errors:errors.array() //devolver el mensaje
            })
        }else{ //todo correcto
            next(); //sigue la ejecución del siguiente middleware
        }
    }
]
