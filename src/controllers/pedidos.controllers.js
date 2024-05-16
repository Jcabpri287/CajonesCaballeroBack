import { ObjectId } from "mongodb";
import conexionDB from "../mongodb_conector.js";
import stripe from 'stripe';

//const stripeInstance = stripe(process.env.REAL_STRIPE_API_KEY);
const stripeInstance = stripe(process.env.STRIPE_API_KEY);

export const addPedido=async(req, res)=>{
    try {
        const {nombre, correo, contraseña, direccion, telefono}=req.body;
        const database = await conexionDB();
        const collection = database.collection("usuarios");
        const result = await collection.insertOne(
            {
                nombre: nombre,
                correo:correo, 
                contraseña:contraseña, 
                rol: "cliente",
                direccion: direccion, 
                telefono:telefono , 
                fecha_registro:new Date() 
            });
        console.log(result);
        res.status(200).json({id:result.insertId});
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const pago= async (req, res) => {
    const { nombre, descripcion, precio } = req.body.producto;

    console.log(nombre);
  console.log(descripcion);
  console.log(precio);
    try {
      // Crear la sesión de pago en Stripe
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: nombre,
              description: descripcion
            },
            unit_amount: precio * 100, // El precio debe estar en centavos
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://cajonescaballero.netlify.app/exito?resultado=exito',
        cancel_url: 'https://cajonescaballero.netlify.app/cancelacion?resultado=cancelado',
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error al crear sesión de pago:', error);
      res.status(500).json({ error: 'Error al procesar el pago' });
    }
}
