"use strict"
import {Router} from 'express'
import {getUsuario, getUsuarios,correosUsuarios, delUsuario, verifyAccount, addUsuario, loginUsuario, updateUsuario, getUsuarioConGmail, confirmarPedido} from '../controllers/usuarios.controllers.js';
import {addProducto, getProductos} from '../controllers/productos.controllers.js';
import {validacion } from '../validators/cajaCaballero.validator.js';
import { getMarca, getMarcas } from '../controllers/marcas.controllers.js';
import { addComentario, deleteComentario, getComentarios, getComentariosProducto } from '../controllers/comentarios.controllers.js';
import { addPedido, pago,getPedidosUsuario, getPedidos, deletePedido, updatePedido } from '../controllers/pedidos.controllers.js';

const router=Router();

/**
 * Endpoints para el get
 */

/**
 * Endpoints para los usuarios
 */
router.get("/usuarios/:id", getUsuario)
router.get("/usuarios", getUsuarios)
router.get("/usuario/:gmail", getUsuarioConGmail)
router.post("/login", loginUsuario)
router.post("/usuarios",validacion,addUsuario);
router.put("/usuarios/:id",validacion, updateUsuario);
router.delete("/usuarios/:id", delUsuario);
router.get("/correos", correosUsuarios);
router.post("/verify-code", verifyAccount);
router.post("/confirmar", confirmarPedido);

/**
 * Endpoints para los productos
 */
router.get("/productos", getProductos)
router.post("/productos", addProducto)


/**
 * Endpoints para las marcas
 */
router.get("/marcas", getMarcas)
router.get("/marcas/:id", getMarca)

/**
 * Endpoints para los comentarios
 */
router.get("/comentarios", getComentarios)
router.get("/comentarios/:id", getComentariosProducto)
router.post("/comentarios", addComentario)
router.delete("/comentarios/:id", deleteComentario)

/**
 * Endpoints para los pedidos
 */
router.get("/pedidos", getPedidos)
router.get("/pedidos/:id", getPedidosUsuario)
router.post("/pedidos", addPedido)
router.post("/crear-sesion-pago", pago)
router.delete('/pedidos/:id', deletePedido);
router.put('/pedidos/:id', updatePedido);
export default router; //exportamos