const express = require('express');
const logger = require('morgan');
const http = require('http');
const PinsRouter = require('./routes/pins');
const Pins = require('./models/Pins');
const request = require('request');
const requestPromise = require('request-promise-native');
const axios = require('axios');
const { reject } = require('core-js/fn/promise');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use('/api', PinsRouter.router);
app.set('port', 3000);

describe('Testing Router', () => {
  let server;

  beforeAll(() => {
    server = http.createServer(app);
    server.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  describe('General GET', () => {
    // GET 200
    it('200 and find pin', doneFn => {
      const data = [{id: 1}];
      spyOn(Pins, 'find').and.callFake(callBack => {
        callBack(false, data);
      });
      request.get('http://localhost:3000/api', (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([{id: 1}]);
        doneFn();
      });
    });
    // GET 500
    it('should return 500', doneFn => {
      const data = [{id: 1}];
      spyOn(Pins, 'find').and.callFake(callBack => {
        callBack(true, data);
      });
      request.get('http://localhost:3000/api', (error, response, body) => {
        expect(response.statusCode).toBe(500);
        doneFn();
      });
    });
  });
  describe('Specific GET', () => {
    it('should return a 200', doneFn => {
      const data = [{id: 1, name: 'juan'}];
      spyOn(Pins, 'findById').and.callFake((id, callBack) => {
        expect(id).toBe('32');
        callBack(false, data);
      });
      request.get('http://localhost:3000/api/32', (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([{id: 1, name: 'juan'}]);
        doneFn();
      });
    });
    it('should return a 500', doneFn => {
      spyOn(Pins, 'findById').and.callFake((id, callBack) => {
        expect(id).toBe('null');
        callBack(true, {});
      });
      request.get('http://localhost:3000/api/null', (error, response, body) => {
        expect(response.statusCode).toBe(500);
        doneFn();
      });
    })
  });
  describe('POST', () => {
    it('should be 200', doneFn => {
      const data = {
        title: 'Platzi',
        author: 'Platzi',
        description: 'Platzi rules',
        percentage: 0,
        tags: [],
        assets: [
          {
            title: 'Platzi',
            description: 'description',
            readed: false,
            url: 'http://platzi.com'
          }
        ]
      }
      spyOn(Pins, 'create').and.callFake((data, callBack) => {
        callBack(false, {});
      });
      spyOn(requestPromise, 'get').and.returnValue(Promise.resolve('<title>Platzi</title><meta name="description" content="Platzi rules">'));

      const assets = [{url: 'http: //platzi.com'}];

      axios.post(
        'http://localhost:3000/api', 
        {title:'title', author:'author', description:'description', assets})
        .then(
          res => {
            expect(res.status).toBe(200);
            doneFn()
          }
        );
    });
    it('200 PDF', doneFn => {
      spyOn(Pins, 'create').and.callFake((pins, callBack) => {
        callBack('false', {})
      });
      const assets = [{url: 'http: //platzi.pdf'}];

      axios.post('http://localhost:3000/api', {title:'title', author:'author', description:'description', assets}).then(res => {
        expect(res.status).toBe(200);
        doneFn()
      })
    });
    it('500 pdf', doneFn => {
      const pins = { title: "Platzi", author: "Platzi", description: "Platzi rules", percentage: 0, tags: [],assets: []};

      spyOn(requestPromise, "get").and.returnValue(        
        Promise.reject(new Error("Ocurrio un error"))
      );
       const assets = [{ url: "http://platzi.com" }];

      axios.post('http://localhost:3000/api', {title:'title', author:'author', description:'description'}).catch(err => {
        console.log(err);
        expect(err.response.status).toBe(500);
        doneFn();
      });
    })
  });
  describe('PUT', () => {
    it('should be 200', doneFn => {
      const data = {
        title: 'Platzi',
        author: 'Platzi',
        description: 'Platzi rules',
        percentage: 0,
        tags: [],
        assets: [
          {
            title: 'Platzi',
            description: 'description',
            readed: false,
            url: 'http://platzi.com'
          }
        ]
      }
      spyOn(Pins, 'findByIdAndUpdate').and.callFake((id, data, callBack) => {
        expect(id).toBe('32');
        callBack(false, {});
      });
      const assets = [{url: 'http: //platzi.com'}];
      axios.put(
        'http://localhost:3000/api/32', 
        {title:'title', author:'author', description:'description', assets})
        .then(
          res => {
            expect(res.status).toBe(200);
            doneFn()
          }
        );
    });
    it('should be 500', doneFn => {
      const data = {
        title: 'Platzi',
        author: 'Platzi',
        description: 'Platzi rules',
        percentage: 0,
        tags: [],
        assets: [
          {
            title: 'Platzi',
            description: 'description',
            readed: false,
            url: 'http://platzi.com'
          }
        ]
      }
      spyOn(Pins, 'findByIdAndUpdate').and.callFake((id, data, callBack) => {
        expect(id).toBe('32');
        callBack(true, {});
      });
      const assets = [{url: 'http: //platzi.com'}];
      axios.put(
        'http://localhost:3000/api/32', 
        {title:'title', author:'author', description:'description', assets})
        .catch(err => {
          console.log(err);
          expect(err.response.status).toBe(500);
          doneFn();
        });
    });
  })
  describe('DELETE', () => {
    it('should be 200', doneFn => {
      const data = {
        title: 'Platzi',
        author: 'Platzi',
        description: 'Platzi rules',
        percentage: 0,
        tags: [],
        assets: [
          {
            title: 'Platzi',
            description: 'description',
            readed: false,
            url: 'http://platzi.com'
          }
        ]
      }
      spyOn(Pins, 'findByIdAndRemove').and.callFake((id, data, callBack) => {
        expect(id).toBe('32');
        callBack(false, {});
      });
      const assets = [{url: 'http: //platzi.com'}];
      axios.delete(
        'http://localhost:3000/api/32', 
        {title:'title', author:'author', description:'description', assets})
        .then(
          res => {
            expect(res.status).toBe(200);
            doneFn()
          }
        );
    });
    it('should be 500', doneFn => {
      const data = {
        title: 'Platzi',
        author: 'Platzi',
        description: 'Platzi rules',
        percentage: 0,
        tags: [],
        assets: [
          {
            title: 'Platzi',
            description: 'description',
            readed: false,
            url: 'http://platzi.com'
          }
        ]
      }
      spyOn(Pins, 'findByIdAndRemove').and.callFake((id, data, callBack) => {
        expect(id).toBe('32');
        callBack(true, {});
      });
      const assets = [{url: 'http: //platzi.com'}];
      axios.delete(
        'http://localhost:3000/api/32', 
        {title:'title', author:'author', description:'description', assets})
        .catch(err => {
          console.log(err);
          expect(err.response.status).toBe(500);
          doneFn();
        });
    });
  })
})