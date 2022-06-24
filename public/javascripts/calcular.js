"use strict"

const btn = document.querySelector('[data-button-calcular]');

const calcular = () =>{
   const monto = document.querySelector('[data-form-monto]').value;
   const meses = document.querySelector('[data-form-meses]').value;
   const tasas = document.querySelector('[data-form-tasas]').value;

   const valorTotal = ((monto * tasas) /100 ) + parseInt(monto);
   console.log(valorTotal);
   const cuotas = parseInt(valorTotal/meses);
   
   const respuesta = document.querySelector('[data-respuesta]');
   const contenido = ` <h4>Credito-tasa de interes del ${tasas}%</h4> <br>
   <p>
       Monto a desembolsar del $${monto} <br>
       Cuotas a ${meses} meses por un valor del $${cuotas} <br>
       Valor total a pagar $${valorTotal}
   </p>`;
  respuesta.innerHTML=contenido;
};

btn.addEventListener("click", calcular);
