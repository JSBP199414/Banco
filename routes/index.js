var express = require('express');
var router = express.Router();
/**Expotamos el authControllers-para usar las funciones Callback */
const authController = require('../controllers/authControllers');
/**Expotamos procesarImagenes-para optimizar imagenes*/
const procesamientoImagen = require('../classes/procesarImagenes');
const upload = require('../middleware/descargaMiddleware');


/**Routers-index*/
router.get('/', authController.isAuthenticated,(req, res, next)=>{
  res.render('index.html',{user:req.user});
});

router.get('/quienesSomos', authController.isAuthenticated,(req, res, next)=>{
  res.render('quienesSomos.html',{user:req.user});
});

router.get('/informacionAdicional', authController.isAuthenticated,(req, res, next)=>{
  res.render('informacionAdicional.html',{user:req.user});
});

router.get('/informacionInversionistas', authController.isAuthenticated,(req, res, next)=>{
  res.render('informacionInversionistas.html',{user:req.user});
});

router.get('/simuladorDeCredito', authController.isAuthenticated,(req, res, next)=>{
  res.render('simuladorDeCredito.html',{user:req.user});
});

router.get('/tarjetas', authController.isAuthenticated,(req, res, next)=>{
  res.render('tarjetas.html',{user:req.user});
});

router.get('/trabajaConNosotros', authController.isAuthenticated,(req, res, next)=>{
  res.render('trabajaConNosotros.html',{user:req.user});
});

router.post('/trabajaConNosotros/confirmacion', upload.single("photo"),authController.isAuthenticated,(req, res, next)=>{
  const imagenes = new procesamientoImagen();
  imagenes.redimensionar(req.file,128, 128).then(()=>{
    console.log(req.body);
    res.render('confirmacion.html',{datos:req.body, files:req.file, user:req.user});
  });

  })

module.exports = router;
