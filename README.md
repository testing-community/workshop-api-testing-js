# Workshop Api Testing in Javascript

This is a Workshop about Api Testing in JavaScript

## Stages

### Configuración inicial del proyecto

En esta primera parte se creará un proyecto node desde 0 y se configurará la primera prueba utilizando mocha. Adicionalmente este proyecto se montará en Github

1. Crear un repositorio en GitHub con el nombre de `workshop-api-testing-js`
1. Seguir las instrucciones para realizar el primer commit
1. En la configuración del repositorio de GitHub en la opción Branches proteja la rama `Master` indicando que los PR requieran revisión antes de mergear y que requiera la comprobación del estado antes de hacer merge
1. Dentro del menu colaboradores agregar a:
   * [germandavid85](https://github.com/germandavid85)
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
    const agent = require('superagent');
    const statusCode = require('http-status-codes');
    const chai = require('chai');

    const expect = chai.expect;

    describe('First Api Tests', () => {
    });
    ```

1. Agregar una prueba consumiendo un servicio GET

    ```js
    it('Consume GET Service', async () => {
      const response = await agent.get('https://httpbin.org/ip');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.have.property('origin');
    });
    ```

1. Agregar una prueba consumiendo un servicio GET con Query Parameters

    ```js
    it('Consume GET Service with query parameters', async () => {
      const query = {
        name: 'John',
        age: '31',
        city: 'New York'
      };

      const response = await agent.get('https://httpbin.org/get').query(query);

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.args).to.eql(query);
    });
    ```

1. Ejecutar las pruebas.
1. Agregar pruebas consumiendo servicios **HEAD**, **PATCH**, **PUT**, **DELETE** (Utilice <https://httpbin.org/> para encontrar los servicios) y (la documentación de [superagent](http://visionmedia.github.io/superagent/))
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
    branches:
    except:
    - "/^v\\d+\\.\\d+\\.\\d+$/"
    ```

1. Habilitar en Travis en el repositorio <https://docs.travis-ci.com/user/getting-started/>
1. Crear el archivo `.nvmrc` con el siguiente contenido

    ``` shell
    v10.16.0
    ```

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

### Autenticación en GitHub

En ésta sección se realizarán pruebas al API de Github, en donde se consultarán datos del repositorio que hemos creado y se implementarán mecanismos para trabajar con la autenticación de ésta API.

1. Crear un token de acceso en nuestra cuenta de Github seleccionando (repo, gist, users) y darle acceso público a nuestro repositorios. Recuerde que debe copiar el token ya que no volverá a tener acceso a él. [Documentación](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

1. Dentro de la carpeta test crear el archivo `GithubApi.Authentication.test.js`

    ```js
    const agent = require('superagent');
    const statusCode = require('http-status-codes');
    const { expect } = require('chai');

    const urlBase = 'https://api.github.com';
    const githubUserName = 'AgileTestingColombia';
    const repository = 'workshop-api-testing-js';

    describe('Github Api Test', () => {
      describe('Authentication', () => {
        it('Via OAuth2 Tokens by Header', async () => {
          const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');

          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.description).equal('This is a Workshop about Api Testing in JavaScript');
        });
      });
    });
    ```

1. Reemplazar el valor de githubUserName por su usuario de Github.
1. Reemplazar el valor de repository por el nombre del repositorio
1. Establecer la variable de entorno **ACCESS_TOKEN** con el valor del token de acceso.

    ```bash
    export ACCESS_TOKEN=token_de_acceso
    ```

1. Ejecutar las pruebas.
1. Adicionar la prueba para autenticación por parámetros.

    ```js
    it('Via OAuth2 Tokens by parameter', () =>
      agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .query(`access_token=${process.env.ACCESS_TOKEN}`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.description).equal('This is a Workshop about Api Testing in JavaScript');
        }));
    ```

1. Encriptar la variable **ACCESS_TOKEN** en travis. Debe instalar localmente travis-cli

    ```bash
    travis encrypt ACCESS_TOKEN="your-access-token" --add --org
    ```

1. Subir los cambios a GitHub, crear un PR y solicitar revisión

### Consumiendo Métodos GET

En esta sesión se automatizarán algunas pruebas utilizando métodos GET de la api de Github, se descargará un archivo de menor tamaño y otro de mayor tamaño y se comprobará con su **MD5**

1. Crear el archivo `GithubApi.Repositories.test.js` y dentro de él hacer el resto de pasos
1. Consumir el servicio `https://api.github.com/users/aperdomob` y comprobar el nombre, la compañía y la ubicación del usuario
1. Obtener la lista de los repositorios por medio de hypermedia, y busque un repositorio con el nombre **jasmine-awesome-report** sobre ese repositorio verifique el nombre completo del repositorio, si es privado, y la descripción del repositorio. Utilice el método `find` para encontrar el repositorio que busca <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find>
1. Descargue el repositorio en un zip y compruebe que descargó de forma adecuada. Aproveche la hypermedia de las anteriores respuesta para formar la url de descarga
1. Obtenga la lista de archivos del repositorio y encuentre el Archivo README.md compruebe su nombre, path y su sha. Use el método containtSubset de chai-subset
1. Por último, descargue el archivo README.md con ayuda del hypermedia y compruebe su md5

### Consumiendo Métodos PUT

En esta sesión seguiremos a un usuario de github, comprobaremos que efectivamente lo seguimos y posteriormente volveremos a seguirlo con el fin de comprobar la idempotencia del método **PUT**

1. Crear el archivo GithubApi.Put.test.js y dentro de él hacer el resto de pasos
1. Seguir al usuario aperdomob consumiendo con el método PUT la url <https://api.github.com/user/following/aperdomob.> Verificar que la consulta devuelve un 204 y que efectivamente el cuerpo venga vacío
1. Consulte la lista de usuario y verifique que efectivamente sigue a aperdomob, puede consumir <https://api.github.com/user/following>
1. Vuelva a llamar el endpoint para seguir al usuario aperdomob y verifique la idempotencia del método

### Consumiendo métodos POST y PATCH

En esta sesión crearemos un issue in github con un título, posteriormente modificaremos ese issue agregando un cuerpo

1. Crear el archivo GithubApi.Issue.test.js y dentro de este, codificar los cambios necesarios para los pasos siguientes
1. Obtendremos el usuario logueado mediante el consumo del del servicio `https://api.github.com/user` y verificaremos que tenga al menos un repositorio público
1. Obtendremos la lista de todos los repositorios como ya lo habíamos hecho anteriormente. De todos los repositorios seleccionaremos uno cualquiera y agregamos una verificación que el repositorio exista.
1. A partir del usuario y el nombre del repositorio construimos la url que nos permita crear un issue que contenga solamente un título mediante un método post la estructura de la url es `https://api.github.com/repos/${username}/${repositoryName}/issues`. Verificamos que el título corresponda y que el cuerpo no contenga contenido
1. Modifique el issue agregandole un cuerpo mediante un método PATCH la url usando la url `https://api.github.com/repos/${username}/${repositoryName}/issues/{issueNumber}` verifique que el título no haya cambiado y que contenga el nuevo cuerpo

### Consumiendo un DELETE y un recurso inexistente

Se creará un gist posteriormente se verificará que exista. Luego se eliminará ese gist y se comprobará que efectivamente ya no exista.

1. Crear el archivo `GithubApi.Gist.test.js` y dentro de dentro de este, codificar los cambios necesarios para los pasos siguientes
1. Cree un gist con un ejemplo de promesas mediante el método **POST** y la url `https://api.github.com/gists`. Verifique el código de respuesta, la descripción, si es público y el contenido del archivo. Use el método containtSubset de chai-subset
1. Consulte el gist creado mediante la url provisionada por hypermedia y compruebe que el recurso si exista
1. Elimine el gist mediante la misma url usando el método **DELETE**
1. Consulte nuevamente el gist mediante la url y compruebe que el recurso ya no exista

### Consumiendo HEAD y redireccionando peticiones

se consumirá por medio de un head un repositorio el cual fue cambiado de nombre para obtener el código de respuesta de redireccionamiento y adicionalmente ver la url a la que debería redireccionar. Posteriormente se consumirá con un **GET** el repositorio que se renombró con el fin de validar que redireccione de forma adecuada.

1. Crear el archivo `GithubApi.Redirect.js` y dentro de dentro de este, codificar los cambios necesarios para los pasos siguientes
1. Consultar con el método `HEAD` la url `https://github.com/aperdomob/redirect-test` y comprobar el código de estado 301 y que tenga la redirección a la url `https://github.com/aperdomob/new-redirect-test`
1. Consultar con el método GET la url <https://github.com/aperdomob/redirect-test> y verificar que redireccione de forma correcta

### Tiempos de Respuesta

En esta ocasión se hará una prueba en la cual se consultará todos los usuarios de github y se validará que no exceda un tiempo en obtener la respuesta

1. Instalar la dependencia de desarrollo `superagent-response-time`
1. Crear el archivo `GithubApi.Users.test.js` y dentro de él hacer el resto de pasos
1. Realizar una prueba que traiga todos los usuarios y compruebe que el tiempo de respuesta sea menor a 5 segundos (utilice la librería que instalo)

### Query parameters

En esta sesión se enviará query parameters para poder obtener más o menos cantidad de datos en una consulta **get**.

1. Modificar el archivo `GithubApi.Users.test.js` agregando una prueba de cuantos usuarios trae por defecto.
1. Agregar una prueba que obtenga 10 usuarios y verificar que efectivamente traiga 10 usuarios.
1. Agregar una prueba que obtenga 50 usuarios y verificar que efectivamente traiga 50 usuarios.

### Validación de Esquemas

En muchas ocasiones debemos verificar que la respuesta que entrega debe cumplir con un esquema generalmente ese tipo de pruebas llevan el nombre de “pruebas de contrato”, una forma sencilla de verificarlo es por medio de json schema validator. Lo que se realizará en este ejercicio es automatizar un solo caso de prueba verificando ese esquema

1. Cree el archivo GithubApi.Contract.test.js con el siguiente contenido

    ```js
    const agent = require('superagent');
    const chai = require('chai');
    const { listPublicEventsSchema } = require('./schema/ListPublicEvents.schema');

    const { expect } = chai;
    chai.use(require('chai-json-schema'));

    const urlBase = 'https://api.github.com';

    describe('Given event Github API resources', () => {
      describe('When wanna verify the List public events', () => {
        let response;

        before(async () => {
          response = await agent
            .get(`${urlBase}/events`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('then the body should have a schema', () => expect(response).to.be.jsonSchema(listPublicEventsSchema));
      });
    });
    ```

1. Cree el archivo `schema/ListPublicEvents.schema.js` (En este archivo se agregará el esquema que se validará). Con la siguiente información

    ```js
    const listPublicEventsSchema = {
    };

    exports.listPublicEventsSchema = listPublicEventsSchema;
    ````

1. Completar el archivo ListPublicEvents con el esquema que cubra cada una de los keys del json de respuesta, tenga en cuenta tipos de datos (numeros, booleanos, arrays, string, objects), enumeraciones

### Librería Alterna de Clientes

Existen otras librerías alternas para consumir url en javascript un de esas es isomophic-fetch, para esta sesión se automatizará nuevamente los casos de prueba de la sesión “Consumiendo un DELETE y un recurso inexistente” pero con otra librería.

1. Instalar la dependencia `isomorphic-fetch`
1. Crear el archivo GithubApi.Gist.Fetch.test.js
1. Implementar los mismos test cases de la sesión “Consumiendo un DELETE y un recurso inexistente” usando isomorphic-fetch

### Futuros Temas

* Subir archivos
