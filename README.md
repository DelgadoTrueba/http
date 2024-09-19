# @delgadotrueba/http

> A personal HTTP service library featuring both httpService for real-world API interactions and httpMockService for testing and mock API simulations.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![License][license-image]][license-url]

## Build

Guide to Developing the Library

```
nvm use v21.7.3
npm i

# Available Scripts
npm run build
npm run lint
npm run test
```

How to Manually Publish the Libray

```
nvm use v21.7.3
npm i

npm publish
```

## Installation

Guide to use the Library

```
npm install @delgadotrueba/http --save
```

## Import

### Commonjs

```js
const {
  HttpInterfaceService,
  HttpService,
  HttpMockService,
} = require('@delgadotrueba/http');

const http: HttpInterfaceService = env.production ? new HttpService() : new HttpMockService();
```

### ESM

```js
import { HttpInterfaceService, HttpService, HttpMockService } from '@delgadotrueba/http';

const http: HttpInterfaceService = env.production ? new HttpService() : new HttpMockService();
```

## Usage

### HttpService API

```js
// env.production = true

const http: HttpInterfaceService = env.production ? new HttpService() : new HttpMockService();

http.get<any>({ endpoint: url }).then(async (response: any) => {
      switch (response.status) {
        case 200:
          console.log(await response.json());
          break;

        default:
          break;
      }
}).catch((error) => {
    switch (error.response.status) {
        case 400:
          console.log(await response.json());
          break;

        case 500:
          console.log(await response.json());
          break;

        default:
          break;
      }
});
```

### HttpMockService API

### Success Response

```js
// env.production = false

const httpMock = new HttpMockService();
const http: HttpInterfaceService = env.production ? new HttpService() : httpMock;


httpMock.onGet(url, () => {
  return Promise.resolve({
    status: 200,
    response: {
      id: 1,
      name: 'Shena',
      type: 'Dog',
    },
  });
});


http.get<any>({ endpoint: url }).then(async (response: any) => {
      switch (response.status) {
        case 200:
          console.log(await response.json());
          break;

        default:
          break;
      }
});
```

### Error Response

```js
// env.production = false

const httpMock = new HttpMockService();
const http: HttpInterfaceService = env.production ? new HttpService() : httpMock;


httpMock.onGet(url, () => {
  return Promise.reject({
    status: 500,
    response: {
      description: "Internal Server Error"
    },
  });
});


http.get<any>({ endpoint: url }).then(async (response: any) => {
      switch (response.status) {
        case 200:
          console.log(await response.json());
          break;

        default:
          break;
      }
}).catch((error: unknown) => {
    if (error instanceof HttpResponseError) {
       switch (error.response.status) {
        case 400:
          console.log(await response.json());
          break;

        case 500:
          console.log(await response.json());
          break;

        default:
          break;
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
});
```

### Mock Response With Body Response

```js
// env.production = false

const httpMock = new HttpMockService();
const http: HttpInterfaceService = env.production ? new HttpService() : httpMock;

httpMock.onPost(url, ({body}) => {
  return Promise.resolve({
    status: 200,
    response: {
      id: body.id, // <-----
      name: body.name, // <-----
      type: body.type, // <-----
    },
  });
});


http.post<any>({
    endpoint: url,
    body: { // <-----
      id: 1,
      name: 'Shena',
      type: 'Dog',
    }
})
.then(async (response: any) => {
    switch (response.status) {
        case 200:
        console.log(await response.json());
        break;

        default:
        break;
    }
});
```

### Mock Response With Headers Response

```js
// env.production = false

const httpMock = new HttpMockService();
const http: HttpInterfaceService = env.production ? new HttpService() : httpMock;

httpMock.onGet(url, ({headers}) => {
  return Promise.resolve({
    status: 200,
    response: {
        filters: {
            sort: headers['X-APP-SORT'] // <-----
        },
        data: [
            id: 1,
            name: 'Shena',
            type: 'Dog',
        ]
    },
  });
});


http.get<any>({
    endpoint: url,
    headers: {
        'X-APP-SORT': "ASC" // <-----
    }
})
.then(async (response: any) => {
    switch (response.status) {
        case 200:
        console.log(await response.json());
        break;

        default:
        break;
    }
});
```

```js
// env.production = false

const httpMock = new HttpMockService();
const http: HttpInterfaceService = env.production ? new HttpService() : httpMock;

httpMock.onGet(url, ({headers}) => {
  return Promise.resolve({
    status: 200,
    response: {
      id: params.id, // <-----
      name: 'Shena',
      type: 'Dog',
    },
  });
});


http.get<any>({ endpoint: url.replace(':id', '1') }) // <-----
    .then(async (response: any) => {
        switch (response.status) {
            case 200:
            console.log(await response.json());
            break;

            default:
            break;
        }
    });
```

### Mock Response With Path Params Response

```js
// env.production = false

const httpMock = new HttpMockService();
const http: HttpInterfaceService = env.production ? new HttpService() : httpMock;

const url = 'http://localhost:3001/test/:id', // <-----

httpMock.onGet(url, ({params}) => {
  return Promise.resolve({
    status: 200,
    response: {
      id: params.id, // <-----
      name: 'Shena',
      type: 'Dog',
    },
  });
});


http.get<any>({ endpoint: url.replace(':id', '1') }) // <-----
    .then(async (response: any) => {
        switch (response.status) {
            case 200:
            console.log(await response.json());
            break;

            default:
            break;
        }
    });
```

### Mock Response With Query Params Response

```js
// env.production = false

const httpMock = new HttpMockService();
const http: HttpInterfaceService = env.production ? new HttpService() : httpMock;

const url = 'http://localhost:3001/test?sort=:sort', // <-----

httpMock.onGet(url, ({params}) => {
  return Promise.resolve({
    status: 200,
    response: {
        filters: {
            sort: params.sort // <-----
        },
        data: [
            id: 1,
            name: 'Shena',
            type: 'Dog',
        ]
    },
  });
});


http.get<any>({ endpoint: url.replace(':sort', 'ASC') }) // <-----
    .then(async (response: any) => {
        switch (response.status) {
            case 200:
            console.log(await response.json());
            break;

            default:
            break;
        }
    });
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/%40delgadotrueba%2Fhttp
[npm-url]: https://www.npmjs.com/package/@delgadotrueba/http
[downloads-image]: https://img.shields.io/npm/dy/%40delgadotrueba%2Fhttp
[downloads-url]: https://www.npmjs.com/package/@delgadotrueba/http
[license-image]: http://img.shields.io/npm/l/%40delgadotrueba%2Fhttp.svg?style=flat
[license-url]: LICENSE.md
