import { ObjectId } from "mongodb";
import conexionDB from "../mongodb_conector.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lacajacaballero@gmail.com',
      pass: 'hnzfbimtumbnddmr' 
    }
  });

/**
 * Usuarios
 */

export const getUsuarios=async(req, res)=>{
    try {
        const database = await conexionDB();
        const collection = database.collection("usuarios"); 
        const result = await collection.find({}).toArray();
        console.log(result);
        res.status(200).json(result); 
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const correosUsuarios = async (req, res) => {
    try {
        const database = await conexionDB();
        const collection = database.collection("usuarios"); 
        const result = await collection.find({}).toArray();
        const correos = result.map(usuario => usuario.correo);

        res.status(200).json(correos);
    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor"
        });
    }
};

export const getUsuario=async(req, res)=>{
    try {
        const {id}=req.params
        const database = await conexionDB();
        const collection = database.collection("usuarios"); 
        const result = await collection.find({
            _id: new ObjectId(id),
          }).toArray();
        console.log(result);
        res.status(200).json(result[0]); 
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const getUsuarioConGmail = async (req, res) => {
    try {
        const { gmail } = req.params; 
        const database = await conexionDB();
        const collection = database.collection("usuarios"); 
        const result = await collection.findOne({ correo : gmail }); 
        if (result) {
            console.log(result);
            res.status(200).json(result); 
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const loginUsuario = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const database = await conexionDB();
        const collection = database.collection("usuarios");
        
        const usuario = await collection.findOne({ correo: correo });
        
        if (!usuario) {
            return res.status(401).json({ message: "Correo electrónico o contraseña incorrectos" });
        }
        
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        
        if (!contraseñaValida) {
            return res.status(401).json({ message: "Correo electrónico o contraseña incorrectos" });
        }
        
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor"
        });
    }
};

export const addUsuario=async(req, res)=>{
    try {
        const {nombre, correo, contraseña, direccion, telefono}=req.body;
        
        const database = await conexionDB();
        const collection = database.collection("usuarios");
        
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        const result = await collection.insertOne(
            {
                nombre: nombre,
                correo: correo, 
                contraseña: hashedPassword,
                rol: "cliente",
                direccion: direccion, 
                telefono: telefono, 
                fecha_registro: new Date()
            });
            const insertedUser = await collection.findOne({ _id: result.insertedId });
            
            res.status(200).json(insertedUser);
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const updateUsuario = async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const { _id, nombre, correo, direccion, telefono } = req.body;
        const database = await conexionDB();
        const collection = database.collection("usuarios");

        if (!ObjectId.isValid(_id)) {
            console.log("Invalid ID:", _id);
            return res.status(400).json({ message: "ID de usuario no válido" });
        }

        const userId = new ObjectId(_id);

        // Verificar si el documento existe antes de actualizar
        const existingUser = await collection.findOne({ _id: userId });
        if (!existingUser) {
            console.log("Usuario no encontrado con ID:", _id);
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("Usuario encontrado:", existingUser);

        // Verificar si los valores a actualizar son diferentes
        const updateFields = {};
        if (existingUser.nombre !== nombre) updateFields.nombre = nombre;
        if (existingUser.correo !== correo) updateFields.correo = correo;
        if (existingUser.direccion !== direccion) updateFields.direccion = direccion;
        if (existingUser.telefono !== telefono) updateFields.telefono = telefono;

        if (Object.keys(updateFields).length === 0) {
            console.log("No hay cambios para actualizar");
            return res.status(200).json({ message: "No se realizaron cambios porque los valores son los mismos" });
        }

        const result = await collection.updateOne(
            { _id: userId },
            { $set: updateFields }
        );
        console.log("hola4");

        if (result.modifiedCount === 0) {
            console.log("No se modificó ningún documento");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("hola5");
        res.status(200).json({ id: _id });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({
            message: "Error en el servidor"
        });
    }
};

export const delUsuario=async(req, res)=>{
    try {
        const {id}=req.params
        const database = await conexionDB();
        const collection = database.collection("usuarios");
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.affectedRows==0){
            return res.status(400).json({
                message:'no existe'
            })
        }else{
            return res.status(200).json({
                message:'ha sido borrado'
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
}

export const verifyAccount=async(req, res)=>{
    const { code, email } = req.body;
    try {
        const mailOptions = {
          from: 'lacajacaballero@gmail.com',
          to: email,
          subject: 'Código de Verificación',
          text: `Tu código de verificación es: ${code}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico de verificación enviado correctamente');
      } catch (error) {
        console.error('Error al enviar el correo electrónico de verificación:', error);
      }
}

export const confirmarPedido=async (req, res) => {
    const { orden, email } = req.body;
    try {
      const productosHtml = orden.productos.map(producto => `
        <li>
          <p>Nombre: ${producto.nombre}</p>
          <p>Descripción: ${producto.descripcion}</p>
          <p>Cantidad: ${producto.cantidad}</p>
          <p>Precio unitario: ${producto.precio_unitario}€</p>
          <p>Total: ${producto.total}€</p>
        </li>
      `).join('');
  
      const mailOptions = {
        from: 'lacajacaballero@gmail.com',
        to: email,
        subject: 'Confirmación de Pedido',
        html: `
          <h1>Tu pedido se ha realizado correctamente</h1>
          <p>Detalles del pedido:</p>
          <ul>
            ${productosHtml}
          </ul>
          <p>Total del pedido: ${orden.productos.reduce((acc, prod) => acc + prod.total, 0)}€</p>
        `
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Correo electrónico de confirmación enviado correctamente');
      res.status(200).send({ message: 'Correo de confirmación enviado' });
    } catch (error) {
      console.error('Error al enviar el correo electrónico de confirmación:', error);
      res.status(500).send({ message: 'Error al enviar el correo electrónico de confirmación' });
    }
  };