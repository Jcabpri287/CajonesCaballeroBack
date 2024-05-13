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
    try {
        const { id, nombre, correo, contraseña, direccion, telefono } = req.body;
        const database = await conexionDB();
        const collection = database.collection("usuarios");

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de usuario no válido" });
        }

        let hashedPassword;
        if (contraseña) {
            hashedPassword = await bcrypt.hash(contraseña, 10);
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    nombre: nombre,
                    correo: correo,
                    contraseña: hashedPassword,
                    direccion: direccion,
                    telefono: telefono
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ id: id });
    } catch (error) {
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