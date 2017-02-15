const fetch = require('node-fetch');
const merge = require('lodash/merge');

const required = (name, value) => {
  if (value === undefined || value === null) throw new Error(`${name} cannot be null or undefined`);
  return value;
}

class Client {

  constructor({accessToken, baseURL}) {
    this.accessToken = required('accessToken', accessToken);
    this.baseURL = required('baseURL', baseURL);
    this.authorization = new Buffer(`${this.accessToken}:`).toString('base64');
  }

  _fetch({method, endpoint, body}) {
    const url = `${this.baseURL}${endpoint}`;
    return fetch(url, {
      method: method,
      headers: { 'Authorization': `Basic ${this.authorization}`, 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body)
    }).then(response => {
      if (response.status >= 200 && response.status <= 399) {
        // success
        return response.json();
      } else {
        const err = new Error();
        merge(err, response.json());
        err.status = response.status;
        throw err;
      }
    });
  }

  get({endpoint}) {
    return this._fetch({ method: 'GET', endpoint });
  }

  post({endpoint, body}) {
    return this._fetch({ method: 'POST', endpoint, body });
  }

  put({endpoint, body}) {
    return this._fetch({ method: 'PUT', endpoint, body });
  }

  delete({endpoint}) {
    return this._fetch({ method: 'DELETE', endpoint });
  }
}
