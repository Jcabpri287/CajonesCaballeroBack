import { ObjectId } from "mongodb";
import conexionDB from "../mongodb_conector.js";
import stripe from 'stripe';

//const stripeInstance = stripe(process.env.REAL_STRIPE_API_KEY);
const stripeInstance = stripe(process.env.STRIPE_API_KEY);

export const addPedido = async (req, res) => {
  try {
    const { usuario_id, productos } = req.body;
    
    if (!usuario_id || !productos) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const database = await conexionDB();
    const collection = database.collection("pedidos");
    
    const pedido = {
      usuario_id : new ObjectId(usuario_id),
      productos: productos,
      estado: "pendiente",
      fecha: new Date()
    };

    const result = await collection.insertOne(pedido);
    console.log(result);
    
    res.status(200).json({ id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor"
    });
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
            unit_amount: (precio.toFixed(2) * 100).toFixed(0),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:4200/exito?resultado=exito',
        cancel_url: 'http://localhost:4200/cancelacion?resultado=cancelado',
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error al crear sesión de pago:', error);
      res.status(500).json({ error: 'Error al procesar el pago' });
    }
}

export const getPedidosUsuario= async (req, res) => {
  const { id } = req.params;
  try {
    const database = await conexionDB();
    const collection = database.collection("pedidos");
    const pedidosUsuario = await collection.find({ usuario_id: new ObjectId(id) }).toArray();

    res.status(200).json(pedidosUsuario); 
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos del usuario' });
    throw error;
  }
}


