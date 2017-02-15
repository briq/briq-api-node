const fetch = require('node-fetch');
const merge = require('lodash/merge');

class Organization {
  constructor({client, key}) {
    this.client = client;
    this.key = key;
  }
  info() {
    const endpoint = `/organizations/${this.key}`;
    return this.client.get({ endpoint });
  }
  user(username) {
    const endpoint = `/organizations/${this.key}/users/${username}`;
    return this.client.get({ endpoint });
  }
  users() {
    const endpoint = `/organizations/${this.key}/users`;
    return this.client.get({ endpoint });
  }
  createTransaction(transaction) {
    const endpoint = `/organizations/${this.key}/transactions`;
    return this.client.post({ endpoint, body: transaction });
  }
  transactions() {
    const endpoint = `/organizations/${this.key}/transactions`;
    return this.client.get({ endpoint });
  }
  transaction(id) {
    const endpoint = `/organizations/${this.key}/transactions/${id}`;
    return this.client.get({ endpoint });
  }
  refundTransaction(id) {
    const endpoint = `/organizations/${this.key}/transactions/${id}`;
    return this.client.delete({ endpoint });
  }
}

class Client {

  constructor(options) {
    // support passing only the accessToken
    if (typeof options == 'string') {
      options = {
        accessToken: options
      };
    }

    this.accessToken = options.accessToken;
    this.baseURL = options.baseURL || 'https://www.givebriq.com/v0';
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

  delete({endpoint}) {
    return this._fetch({ method: 'DELETE', endpoint });
  }

  organization(key) {
    return new Organization({ client: this, key });
  }
}

exports.Client = Client;
