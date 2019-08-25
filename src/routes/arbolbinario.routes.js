const express = require('express');
const router = express.Router();

// Modelo de cada hoja del arbol
const Nodo = require('../models/nodo');

// Adicionar un Nodo
router.post('/', async   (req, res) => {
  const indice = 0;
  var { valor } = req.body;
  if( isNaN(valor) ){
    res.json({status: 'error', mensaje: `Valores no válidos.`});
  }else{
    valor = Math.floor(valor);
    if(valor<0){valor++};
    const arbol = await Nodo.find();
    if (arbol[0]==null){
      const nodo = new Nodo({indice, valor});
      await nodo.save();
      res.json({status: 'ok', indice, mensaje: `Nodo guardado en el índice: ${indice}.`});
    } else{
      const buscarNodo = async function (indice){
        const arbolFiltrado = arbol.filter(nodo => nodo.indice == indice);
        if (valor < arbolFiltrado[0].valor){
          const nodoIzquierdo = 2*indice+1;
          const arbolNodoIzquierdo = arbol.filter(nodo => nodo.indice == nodoIzquierdo);
          if (arbolNodoIzquierdo[0]==undefined){
            const nodo = new Nodo({'indice': nodoIzquierdo, valor});
            await nodo.save();
            res.json({status: 'ok', indice: nodoIzquierdo, mensaje: `Nodo guardado en el índice: ${nodoIzquierdo}.`});
            return;
          } else {
            return buscarNodo(nodoIzquierdo);
          }
        }else if (valor > arbolFiltrado[0].valor){
          const nodoDerecho = 2*indice+2;
          const arbolNodoDerecha = arbol.filter(nodo => nodo.indice == nodoDerecho);
          if (arbolNodoDerecha[0]==undefined){
            const nodo = new Nodo({'indice': nodoDerecho, valor});
            await nodo.save();
            res.json({status: 'ok', indice: nodoDerecho, mensaje: `Nodo guardado en el índice: ${nodoDerecho}.`});
            return;
          } else {
            return buscarNodo(nodoDerecho);
          };
        }else {
          res.json({status: 'error', mensaje: `El nodo con valor ${valor} ya existe.`});
          return;
        };
      };
      return buscarNodo(indice);
    };
  };
});

// Recuperar todos los Nodos
router.get('/', async (req, res) => {
  const arbol = await Nodo.find({}, { _id: 0 , __v: 0});
  res.json(arbol);
});

// Obtener Ancestro Común
router.get('/:valor1/:valor2', async (req, res) => {
  var valor1 = req.params.valor1, valor2 = req.params.valor2;
  //Validando valores ingresados
  if(isNaN(valor1)|isNaN(valor2)){
    res.json({status: 'error', mensaje: 'Valores inválidos'});
  }else{
    valor1 = Math.floor(valor1);
    valor2 = Math.floor(valor2);
    if(valor1<0){valor1++}; 
    if(valor2<0){valor2++};
    const arbol = await Nodo.find();
    const Nodo1 = arbol.filter(nodo => nodo.valor == valor1);
    const Nodo2 = arbol.filter(nodo => nodo.valor == valor2);
    if (Nodo1[0] == undefined | Nodo2[0] == undefined){
      res.json({status: 'error', mensaje: 'Por lo menos un nodo no existe.'});
    } else{
      const indice1 = Nodo1[0].indice, indice2 = Nodo2[0].indice;
      if (indice1 == 0 | indice2 == 0){
        res.json({status: 'ok', ancestro: arbol[0].valor, mensaje: `El primer ancestro común entre ${valor1} y ${valor2} es ${arbol[0].valor}.`});
      } else{
        var camino1 = new Array(), camino2 = new Array(), ancestroComun = new Array();
        camino1[0] = indice1, camino2[0] = indice2, ancestroComun[0] = 0;
        var i = indice1, j = 0;
        while (i != 0){
          i = Math.floor((i-1)/2);
          camino1[j+1]=i;
          j++;
        };
        i = indice2, j = 0;
        while (i != 0){
          i = Math.floor((i-1)/2);
          camino2[j+1]=i;
          j++;
        };
        for (k=0;k<camino1.length;k++){
          ancestroComun = camino2.filter(coincidencia => coincidencia == camino1[k]);
          if (ancestroComun[0]!=undefined){
            nodoAncestroComun = arbol.filter(nodo => nodo.indice == ancestroComun[0]);
            res.json({status: 'ok', ancestro: nodoAncestroComun[0].valor, mensaje: `El primer ancestro común entre ${valor1} y ${valor2} es ${nodoAncestroComun[0].valor}.`});
            break;
          };
        };
      };
    };
  };  
});

// Eliminar el arbol binario
router.delete('/', async (req, res) => {
  const arbol = await Nodo.deleteMany({});
  res.json({status: 'ok', mensaje: 'El arbol ha sido eliminado.'});
});

module.exports = router;