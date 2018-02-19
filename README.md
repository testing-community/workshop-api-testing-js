# Workshop Api Testing in Javascript

This is a Workshop about Api Testing in JavaScript

## Stages

### Configuración inicial del proyecto [(project-setup branch)](https://github.com/aperdomob/workshop-api-testing-js/tree/project-setup)

En esta primera parte se creará un proyecto node desde 0 y se configurará la primera prueba utilizando mocha. Adicionalmente este proyecto se montará en Github

1. Crear un repositorio en GitHub con el nombre de `workshop-api-testing-js`
1. Seguir las instrucciones para realizar el primer commit
1. En la configuración del repositorio de GitHub en la opción Branches proteja la rama `Master` indicando que los PR requieran revisión antes de mergear y que requiera la comprobación del estado antes de hacer merge
1. Dentro del menu colaboradores agregar a:
   * [aperdomobo](https://github.com/aperdomob)
   * [germandavid85](https://github.com/germandavid85)
   * [jhenaoz](https://github.com/jhenaoz)
   * [luigisamurai](https://github.com/luigisamurai)
1. [Instalar NodeJS](https://nodejs.org/es/download/package-manager/) en su equipo si no lo tiene instalado
1. Ejecutar en una consola `npm init` dentro de la ruta donde se encuentra el repositorio y colocar la siguiente información:

    | Parametro          | Valor                                              |
    | ------------------ | -------------------------------------------------- |
    | **Name**           | _[Por Defecto]_                                    |
    | **Version**        | _[Por Defecto]_                                    |
    | **Description**    | This is a Workshop about Api Testing in JavaScript |
    | **Entry Point**    | _[Por Defecto]_                                    |
    | **Test Command**   | `mocha`                                            |
    | **Git Repository** | _[Por Defecto]_                                    |
    | **Keywords**       | api-testing, dojo, practice                        |
    | **Author**         | _[Su nombre]_ <_[Su correo]_> (_[su github]_)      |
    | **License**        | MIT                                                |

1. Instalar la dependencia de desarrollo mocha, chai
   ```sh
   npm install --save-dev mocha chai
   ```
1. Crear el archivo `HelloWord.test.js` dentro de una carpeta test y utilizar el siguiente codigo como contenido
    ```js
    const { assert } = require('chai');

    describe('Array', () => {
      describe('#indexOf()', () => {
        it('should return -1 when the value is not present', function() {
          assert.equal(-1, [1,2,3].indexOf(4));
        });
      });
    });
    ```
1. Ejecutar el comando `npm test` y comprobar que la prueba pasa de forma satisfactoria
1. Crear el archivo **.gitignore** en la raíz del proyecto. Ingresar a la página <https://www.gitignore.io/> y en el área de texto  agregar el _sistema operativo_, _IDE's_ y _NodeJS_, ejemplo _OSX Node VisualStudioCode_. Genere el archivo y cópielo dentro del archivo **.gitignore**
1. Crear el archivo **LICENSE** en la raíz del proyecto con lo especificado en <https://en.wikipedia.org/wiki/MIT_License> (_Tenga en cuanta cambiar el año y el copyright holders_)
1. Realizar un `commit` donde incluya los 4 archivos modificados con el mensaje **“setup mocha configuration”** y subir los cambios al repositorio
1. Crear un PR y esperar por la aprobación o comentarios de los revisores
1. Una vez aprobado realizar el merge a master seleccionando la opción **“squash and merge”**

### Primera prueba de API

En esta sesión, crearemos las primeras pruebas consumiendo de distintas formas servicios API Rest. Utilizaremos una librería cliente llamada **superagent** y otra que contiene un enumerador de los principales códigos de respuesta.

1. Crear una nueva rama a partir de master: `git checkout -b <new-branch>`
1. Instalar las dependencia de desarrollo **http-status-codes**
  ```sh
  npm install --save-dev http-status-codes
  ```
1. Instalar la dependencias **superagent** y **superagent-promise**. (Tenga en cuenta que estas no son de desarrollo)
  ```sh
  npm install --save superagent superagent-promise
  ```
1. Dentro de la carpeta test crear el archivo `MyFirstApiConsume.test.js`
  ```js
  const agent = require('superagent-promise')(require('superagent'), Promise);
  const statusCode = require('http-status-codes');
  const chai = require('chai');

  const expect = chai.expect;

  describe('First Api Tests', () => {
  });
  ```
1. Agregar una prueba consumiendo un servicio GET
  ```js
  it('Consume GET Service', () => {
    return agent.get('https://httpbin.org/ip').then((response) => {
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.have.property('origin');
    });
  });
  ```
1. Agregar una prueba consumiendo un servicio GET con Query Parameters
  ```js
  it('Consume GET Service with query parameters', () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    return agent.get('https://httpbin.org/get')
      .query(query)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.args).to.eql(query);
      });
  });
  ```
1. Ejecutar las pruebas.
1. Agregar pruebas consumiendo servicios HEAD, PATCH, PUT, DELETE (Utilice https://httpbin.org/ para encontrar los servicios) y (la documentación de [superagent](http://visionmedia.github.io/superagent/)
1. Elimine el archivo test/HelloWord.test.js
1. Haga commit y push de los cambios, creen un PR y solicite la revisión. Una vez aprobado haga merge con master
