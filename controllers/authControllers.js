"use strict"

const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const connection = require('../dataBase/db');
const {promisify}= require("util");
const {body, validationResult} = require('express-validator');
const { token } = require("morgan");

//1.Registrarse-Registrarse
exports.registrar=async (req,res)=>{
    try {
        const cedula = req.body.cedula;
        const usuario = req.body.usuario;
        const nombres = req.body.nombres;
        const apellidos = req.body.apellidos;
        const celular = req.body.celular;
        const ciudad = req.body.ciudad;
        const email = req.body.email;
        const contrasena = req.body.password;
        let passwordHass = await bcryptjs.hash(contrasena,8);
        
            connection.query('INSERT INTO clientes SET ?',{cedula:cedula, usuario:usuario, nombres:nombres, apellidos:apellidos, celular:celular, ciudad:ciudad, email:email, password:passwordHass}, async(error,result)=>{
              if (error) {
                res.render('registrarse.html', {
                    alert:true,
                      alertTitle:"Error",
                      alertMessage: "Llenar todos los campos requeridos!!!",
                      alertIcon:"error",
                      showConfirmButton:true,
                      timer:3000,
                      ruta:'users/registrarse'
                })
                }else{
                 // console.log(users)
                  res.render('registrarse.html', {
                    alert:true,
                        alertTitle:"Registro",
                        alertMessage: "Registro exitoso!!!",
                        alertIcon:"success",
                        showConfirmButton:true,
                        timer:3000,
                        ruta:'users'
                  });
                }
            })
        
    } catch (error) {
        console.log(error);
        
    }
  }
//2.Login
exports.login= async (req,res)=>{
    try {
    const cc= req.body.cedula;
    const pass = req.body.password;
    if (!cc || !pass) {
        res.render('users.html',{
            alert:true,
            alertTitle:"Advertencia",
            alertMessage: "Ingrese un usuario y contraseña!!",
            alertIcon:"error",
            showConfirmButton:true,
            timer:3000,
            ruta:'users'
          });
        }else{
        connection.query('SELECT * FROM clientes  WHERE cedula = ?',[cc], async(error, result)=>{
                if (result.length == 0 || !(await bcryptjs.compare(pass, result[0].password))) {
                    res.render('users.html',{
                        alert:true,
                        alertTitle:"Error",
                        alertMessage: "Usuario y/o contraseña incorrecta!!",
                        alertIcon:"error",
                        showConfirmButton:false,
                        timer:3000,
                        ruta:'users'
                      });
                } else{
                    const id = result[0].idClientes
                    const token = jwt.sign({id:id},process.env.JWT_SECRETO,{
                        
                    })
                    //console.log(token);
                    const cookieOptions ={
                        expires: new Date(Date.now()+process.env.JWT_COOKIES_EXPIRES*24*60*60*1000),
                        httpOnly:true
                    }
                    res.cookie('jwt',token,cookieOptions)
                    res.render('users.html',{
                        alert:true,
                        alertTitle:"Conexion exitosa",
                        alertMessage: "Login correcto!!",
                        alertIcon:"success",
                        showConfirmButton:false,
                        timer:4000,
                        ruta:''})
                } 
        })
    }
    
    }
     catch (error) {
        console.log(error);
        
    }
}
//3.Autotenticacion
exports.isAuthenticated = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM clientes WHERE idClientes = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                //console.log(req.user);
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/users')        
    }
}
//4.Cerrar sesion
exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}
/**--------------------------Pagina tablaClientes---------------------*/
//6 Tabla clientes
exports.tabla =  (req, res)=>{     
    connection.query('SELECT * FROM clientes',(error, results)=>{
        if(error){
            throw error;
        } else {                       
            res.render('tablaClientes.html', {results:results});  
            //console.log(results);          
        }   
    })
}
//7.Listar tabla del usuario cliente
exports.listarTablaUsuario = (req,res)=>{    
    const id = req.params.id;
    connection.query('SELECT * FROM clientes WHERE idClientes=?',[id] , (error, results) => {
        if (error) {
            throw error;
        }else{            
            res.render('editar.html', {user:results[0]});            
        }        
    });
}
//8.Actualizar
exports.actualizar = (req,res)=>{
        const id = req.body.id;
        const cedula = req.body.cedula;
        const usuario = req.body.usuario;
        const nombres = req.body.nombres;
        const apellidos = req.body.apellidos;
        const celular = req.body.celular;
        const ciudad = req.body.ciudad;
        const email = req.body.email;
        connection.query('UPDATE clientes SET ? WHERE idClientes = ?',[{cedula:cedula, usuario:usuario, nombres:nombres, apellidos:apellidos, celular:celular, ciudad:ciudad, email:email},id],(error,result)=>{
              if (error) {
                console.log(error);
                res.redirect('/users')
                }else{
                 // console.log(users)
                  res.redirect('/users/tablaClientes');
                }
            })
    } 
//9.Eliminar cliente
exports.eliminar= (req,res)=>{    
    const id = req.params.id;
    connection.query('DELETE FROM clientes WHERE idClientes = ?',[id] , (error, results) => {
        if (error) {
            throw error;
        }else{            
            res.redirect('/users/tablaClientes');           
        }        
    });
}

