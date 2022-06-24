var Jimp = require("jimp");

module.exports = class ProcesaImagenes {
  redimensionar(_infoDeArchivo, ancho = 250, alto = 250) {
    return new Promise((resolve, reject) => {
      Jimp.read(_infoDeArchivo.path)
        .then(imagen => {
          return imagen
            .resize(ancho, Jimp.AUTO)
            .quality(80)
            .writeAsync(
              `./public/images/optimizadas/${_infoDeArchivo.filename}`
            )
            .then(() => {
              resolve();
            });
        })
        .catch(_error => {
          console.error(_error);
          reject();
        });
    });
  }
};