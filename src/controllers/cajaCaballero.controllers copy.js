import { ObjectId } from "mongodb";
import conexionDB from "../mongodb_conector.js";

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

export const addUsuario=async(req, res)=>{
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

export const getTareas=async(req, res)=>{
    try {
        const database = await conexionDB();
        const collection = database.collection("Tarea"); 
        const result = await collection.find({}).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const getTarea=async(req, res)=>{
    try {
        const {id}=req.params
        const database = await conexionDB();
        const collection = database.collection("Tarea"); 
        const result = await collection.find({_id : new ObjectId(id)}).toArray();
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const getTareasUsuario=async(req, res)=>{
    try {
        const {id}=req.params
        const database = await conexionDB();
        const collection = database.collection("Tarea"); 
        const result = await collection.find({
            idUsuarioAsignado: id,
          }).toArray();
        console.log(result);
        res.status(200).json(result); 
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const getCompletadas=async(req, res)=>{
    try {
        const database = await conexionDB();
        const collection = database.collection("Tarea"); 
        const result = await collection.find({estado:"completada"}).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const getProgreso=async(req, res)=>{
    try {
        const database = await conexionDB();
        const collection = database.collection("Tarea"); 
        const result = await collection.find({
            estado: "progreso",
          }).toArray();
        res.status(200).json(result); 
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const getPendiente=async(req, res)=>{
    try {
        const database = await conexionDB();
        const collection = database.collection("Tarea"); 
        const result = await collection.find({
            estado: "pendiente",
          }).toArray();
        res.status(200).json(result); 
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
};

export const addTarea=async(req, res)=>{
    try {
        const {titulo, descripcion,estado,user_id,importancia}=req.body;
        const database = await conexionDB();
        const collection = database.collection("Tarea");
        const result = await collection.insertOne({titulo: titulo,descripcion:descripcion, fechaCreacion: new Date(), estado: estado, idUsuarioAsignado:user_id,importancia:importancia});
        console.log(result);
    res.status(200).json({id:result.insertId});//la  respuesta que devuelve el servidor
    } catch (error) {
        res.status(500).json({
            message:"Error en el servidor"
        })
    }
}

export const editTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, estado, user_id, importancia } = req.body;
        const database = await conexionDB();
        const collection = database.collection("Tarea");
        
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    titulo,
                    descripcion,
                    estado,
                    idUsuarioAsignado: user_id,
                    importancia,
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(400).json({
                message: 'No existe la tarea',
            });
        }

        res.status(200).json({
            message: 'Tarea actualizada exitosamente',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error en el servidor",
        });
    }
};

export const delTarea=async(req, res)=>{
    try {
        const {id}=req.params
        const database = await conexionDB();
        const collection = database.collection("Tarea");
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