//Incluimos la libreria unir directorios para saber su direccion
const path = require("path");
//Incluimos la libreria Helmet para seguridad
const helmet = require("helmet")
//Incluimos la libreria Cookie
const cookieParser = require('cookie-parser')
//Comprimir archivos public para que la carga sea mas rapida
const compression = require('compression')

let tiempo = 1*365*24*60*60*1000;


//1.Invocamos a express
const express = require("express");
const app = express();

//Invocamos compression para que la carga sea mas rapida
app.use(compression());

//Invocamos Helmet despues de express()
app.use(helmet.referrerPolicy({
  policy: ["origin", "unsafe-url"],
}));

//Para poder trabajar con Cookies
app.use(cookieParser());

//2.Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3.Invocamos a dotenv
const dotenv = require("dotenv");
const { create } = require("domain");
const createHttpError = require("http-errors");
dotenv.config({path:'./env/.env'})

//4.El directorio public
app.use('/public', express.static('public'));
app.use('/public', express.static(path.join(__dirname + '/public'),{maxAge:tiempo}));//Agregamos maxAge junto con compression para que sea mas rapida la carga de archivos

//5.Establecemos el motor de las plantillas
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//6.Establecemos las rutas
app.use(require('./routes/index'));
app.use(require('./routes/users'));

//7.Errores
//Aplicamos error 404 a todos los subindices
app.get('*', function(req, res){
    res.send('Error 404 pagina no encontrada', 404);
  });

//8.Invocamos a bcryptjs (Encriptacion la contraseña-seguridad)
const bcryptjs = require('bcryptjs');

//9.Var de session(Sesiones del usuario-se guarda  id de sesion en la memoria)
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//10.Invocamos a la conexion de BD
const connection = require('./dataBase/db');

app.listen(3000,(req,res)=>{
    console.log('Server running at port http://localhost:3000');
    })