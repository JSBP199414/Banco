const { Router } = require('express');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

//1.Seteamos urlencoded para capturar los datos del formulario
router.use(express.urlencoded({extended:false}));
router.use(express.json());

//2.Invocamos a bcryptjs (Encriptacion la contraseña-seguridad)
var bcryptjs = require('bcryptjs');

//3.Var de session(Sesiones del usuario-se guarda  id de sesion en la memoria)
const session = require('express-session');
router.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//4.Invocamos a la conexion de BD
const connection = require('../dataBase/db');

//5.Invocamos express-validator
const {body, validationResult} = require('express-validator');

//Router para los metodos de controller

router.get('/users', function(req, res) {
  res.render('users.html',{alert:false});
});
router.post('/users',authController.login);

router.get('/users/registrarse', function(req, res) {
  res.render('registrarse.html');
});
router.post('/users/registrarse', authController.registrar);

router.get('/users/tablaClientes',authController.tabla);

router.get('/users/tablaClientes/editar/:id', authController.listarTablaUsuario);
router.post('/users/tablaClientes/editar/:id',authController.actualizar);

router.get('/users/tablaClientes/eliminar/:id', authController.eliminar);

router.get('/logout',authController.logout);


module.exports = router;
