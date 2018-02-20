# Workshop Api Testing in Javascript

This is a Workshop about Api Testing in JavaScript

## Stages

### Configuración inicial del proyecto

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
1. Una vez aprobado realizar el merge a master seleccionando la opción **“squash and merge”**.

### Primera Prueba de API

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
1. Agregar pruebas consumiendo servicios **HEAD**, **PATCH**, **PUT**, **DELETE** (Utilice https://httpbin.org/ para encontrar los servicios) y (la documentación de [superagent](http://visionmedia.github.io/superagent/))
1. Elimine el archivo `test/HelloWord.test.js`
1. Haga commit y push de los cambios, creen un PR y solicite la revisión. Una vez aprobado haga merge con master

### Integración Continua

En esta sesión se configurará la integración continua con travis, adicionalmente se activará dentro de github una validación que sólo permita realizar merge si la integración continua ha pasado. Y por último se configurará mocha para que haga una espera mucho más grande por la ejecución de las pruebas ya que algunos request pueden tomar más de 2 segundos.

1. Crear el archivo `.travis.yml` en la raíz del proyecto
1. Agregar el siguiente contenido
    ```yaml
    language: node_js
    cache:
    directories:
    - node_modules
    notifications:
    email: false
    node_js:
    - '7'
    - '6'
    branches:
    except:
    - /^v\d+\.\d+\.\d+$/
    ```
1. Habilitar en Travis en el repositorio https://docs.travis-ci.com/user/getting-started/
1. Modifique el script de **test** del package.json agregando al final `-t 5000`
1. Cree un PR
1. Verificar que la ejecución en Travis termine correctamente
1. Ir a la configuración del repositorio y modifique el branch protegido master activando travis como requerido
1. Solicite revisión del PR

### Reporte de Pruebas

A pesar que mocha nos muestra un reporte por consola, en muchas ocasiones es bueno mostrar un reporte con interfaz gráfica para que los managers o clientes puedan ver los resultados de las pruebas. En esta sesión se configurará un reporte HTML que permite ver los resultados de las pruebas cuando lo ejecutemos localmente

1. Instale la dependencia de desarrollo **mochawesome**
1. Modificar el script test en el `package.json` de la siguiente forma
    ```json
    "test": "mocha -t 5000 --reporter mochawesome --reporter-options reportDir=report,reportFilename=ApiTesting"
    ```
1. Agregar las siguientes líneas dentro del .gitignore
    ```bash
    ## Reports ##
    report
    ```
1. Cree un PR y solicite revisión (**Dentro de la descripción del PR debe contener una imagen mostrando el reporte HTML que genero mochawesome**), como se muestra en la siguiente imagen
    ![Mocha awesome](https://raw.githubusercontent.com/wiki/AgileTestingColombia/workshop-api-testing-js/images/mochawesome-repor.png)

### Verificación de Código Estático

Los analizadores de código estático nos permiten estandarizar como los desarrolladores escriben código. En esta sesión se configurará eslint con las reglas de estilo de código propuesto por AirBnb, cómo podemos ejecutar la validación de código y cómo automáticamente se pueden corregir algunas reglas, adicionalmente si no es posible corregirlo de forma automática como poder corregirla.

1. Instalar las dependencias de desarrollo **eslint** **eslint-config-airbnb-base** **eslint-plugin-import**
1. Crear el archivo **.eslintrc.yml** en la raíz del proyecto, con el siguiente contenido
    ```yml
    env:
      es6: true
      node: true
      mocha: true
    extends:
      - eslint:recommended
      - airbnb-base
      - plugin:import/errors
      - plugin:import/warnings
    rules:
      "comma-dangle": ["error", "never"]
    ```
1. Agregar dentro de scripts del **package.json** `"lint": "eslint ./test/**/*.js"`
1. Modificar el script de test agregandole al inicio `npm run lint &&`
1. Ejecute el comando `npm run lint -- --fix` (Esto debe resolverle algunos errores de código estático de forma automática) en caso que todos los errores no se resuelvan investigue en qué consiste el error y resuélvalo
1. Envíe un PR con los cambios

### Autenticación en GitHub

En ésta sección se realizarán pruebas al API de Github, en donde se consultarán datos del repositorio que hemos creado y se implementarán mecanismos para trabajar con la autenticación de ésta API.

1. Crear un token de acceso en nuestra cuenta de Github seleccionando (repo, gist, notification, users) y darle acceso público a nuestro repositorios. Recuerde que debe copiar el token ya que no volverá a tener acceso a él. [Documentación](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

1. Dentro de la carpeta test crear el archivo `GithubApi.Authentication.test.js`

    ```js
    const agent = require('superagent-promise')(require('superagent'), Promise);
    const statusCode = require('http-status-codes');
    const { expect } = require('chai');

    const urlBase = 'https://api.github.com';
    const githubUserName = 'AgileTestingColombia';
    const repository = 'workshop-api-testing-js';

    describe('Github Api Test', () => {
    describe('Authentication', () => {
      it('Via OAuth2 Tokens by Header', () =>
        agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.status).to.equal(statusCode.OK);
            expect(response.body.description).equal('This is a Workshop about Api Testing in JavaScript');
          }));
    });
    });
    ```