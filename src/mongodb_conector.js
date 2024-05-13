"use strict"

//importar el paquete mysql para realizar la conexión

import {MongoClient} from "mongodb"; //para trabajar con promesas
const URI = "mongodb+srv://Yo:afLHsgvITNm529N3@cluster0.k4hxhu2.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(URI);
let conexion
const conexionDB = async ()=>{
    try {
        if (!conexion) {
            conexion = await client.connect();
            console.log("Conectada la BD MongoDB");
        }
        return conexion.db("TFGDatabase")
    } catch (error) {
        console.log("Error! BD no conectada.");
    }
}

export default conexionDB;