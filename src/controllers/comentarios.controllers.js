import { ObjectId } from "mongodb";
import conexionDB from "../mongodb_conector.js";

/**
 * Usuarios
 */

export const getComentarios=async(req, res)=>{
    try {
        const database = await conexionDB();
        const collection = database.collection("comentarios"); 
        const result = await collection.find({}).toArray();
        res.status(200).json(result); 
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const getComentariosProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const database = await conexionDB();
        const collection = database.collection("comentarios");

        const result = await collection.find({
            producto_id: new ObjectId(id),
        }).sort({ fecha: -1 }).toArray();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor"
        });
    }
};

export const addComentario=async(req, res)=>{
    try {
        console.log(req.body);
        const {usuario_id, producto_id, texto, nombreUsuario}=req.body;
        
        const database = await conexionDB();
        const collection = database.collection("comentarios");
        
        const result = await collection.insertOne(
            {
                usuario_id: new ObjectId(usuario_id),
                producto_id: new ObjectId(producto_id), 
                texto: texto,
                fecha: new Date(),
                nombreUsuario: nombreUsuario
            });

        console.log(result);
        res.status(200).json({id:result.insertId});
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const deleteComentario = async (req, res) => {
    try {
        console.log(req.params);    
        const { id } = req.params;
        const database = await conexionDB();
        const collection = database.collection("comentarios");
        
        const result = await collection.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 1) {
            console.log("Comentario eliminado");
            res.status(200).json({ message: "Comentario eliminado" });
        } else {
            console.log("No se encontró el comentario");
            res.status(404).json({ message: "Comentario no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error en el servidor"
        });
    }
};
