var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
var path = require('path');

function handleUpload(request, response) {
  if (request.method.toLowerCase() == 'post'){
    // Documentacion de formidable
    // https://www.npmjs.com/package/formidable
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "./temp";
    form.keepExtensions = true;
    form.multiples = false;

    // Recibe el archivo enviado por post
    form.parse(request, function(err, fields, files) {
      response.writeHead(200, {'content-type': 'text/plain'});
      response.write('Contenido Subido\n\n');
      response.end(util.inspect({fields: fields, files: files}));
    });
    // Cuando termina de subir el archivo, le cambia el nombre
    form.on('file', function(name, file) {
      // Resolve devuelve la ruta absoluta desde una ruta relativa
      fs.rename(path.resolve('./', file.path), path.resolve('./temp') + '/numeros.txt', function(err) {
        if ( err ) {
          console.log('Error renaming file: ' + err);
        } else {
          // Lee el archivo en cierta ruta, con codificacion utf8 y cuando termine, llame a la funcion
          fs.readFile(path.resolve('./temp') + '/numeros.txt', 'utf8', function(err, data){
            if (err) {
              console.log('Error readig file ' + err);
            } else {
              // Si todo sale bien, convierta los datos y se retorna en arr
              parseFile(data, function(arr) {
                console.log('\nData Array:\n');
                console.log(arr);
                // leer datos asi: arr[1][1];

  /////////////////// AQUI LLAMAR AL METODO DE CALUCLAR

              });
            }
          })
        }
      });
    });
  }
}

// Convierte a matriz, data es el input y el parametro del callback tiene el array
function parseFile (data, callback) {
  var arr = [];
  data = data.trim();
  var lines = data.split(/\r\n|\r|\n/);
  var columns = lines[0].split(',');
  for (var i = 0; i < lines.length; i++){
    var row = [];
    var nums = lines[i].split(',');
    for (var j = 0; j < columns.length; j++) {
      row.push(nums[j]);
    }
    arr.push(row);
  }

  // Asi se retorna el objeto en donde se llama
  callback(arr);
}

exports.handleUpload = handleUpload;
exports.parseFile = parseFile;