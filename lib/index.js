const qs = require('querystring');
const fetch = require('node-fetch');
const merge = require('lodash/merge');

class Organization {
  constructor({ client, key }) {
    this.client = client;
    this.key = key;
  }

  info({ query }) {
    const endpoint = `/organizations/${this.key}`;
    return this.client.get({ endpoint, query });
  }

  user(username, { query }) {
    const endpoint = `/organizations/${this.key}/users/${username}`;
    return this.client.get({ endpoint, query });
  }

  users({ query }) {
    const endpoint = `/organizations/${this.key}/users`;
    return this.client.get({ endpoint, query });
  }

  createTransaction(transaction, { query }) {
    const endpoint = `/organizations/${this.key}/transactions`;
    return this.client.post({ endpoint, body: transaction, query });
  }

  transactions({ query }) {
    const endpoint = `/organizations/${this.key}/transactions`;
    return this.client.get({ endpoint, query });
  }

  transaction(id, { query }) {
    const endpoint = `/organizations/${this.key}/transactions/${id}`;
    return this.client.get({ endpoint, query });
  }

  refundTransaction(id, { query }) {
    const endpoint = `/organizations/${this.key}/transactions/${id}`;
    return this.client.delete({ endpoint, query });
  }
}

class Client {
  constructor(options) {
    // support passing only the accessToken
    if (typeof options === 'string') {
      options = {
        accessToken: options
      };
    }

    this.accessToken = options.accessToken;
    this.baseURL = options.baseURL || Client.BASE_URL;
    this.authorization = new Buffer(`${this.accessToken}:`).toString('base64');
  }

  _fetch({ method, endpoint, body, query = {} }) {
    const url = `${this.baseURL}${endpoint}?${qs.stringify(query)}`;
    return fetch(url, {
      method,
      headers: { Authorization: `Basic ${this.authorization}`, 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body)
    }).then((response) => {
      if (response.status >= 200 && response.status <= 399) {
        // success
        if (response.status === 204) {
          return Promise.resolve();
        }
        return response.json();
      }
      const err = new Error();
      merge(err, response.json());
      err.status = response.status;
      throw err;
    });
  }

  get({ endpoint, query }) {
    return this._fetch({ method: 'GET', endpoint, query });
  }

  post({ endpoint, body, query }) {
    return this._fetch({ method: 'POST', endpoint, body, query });
  }

  delete({ endpoint, query }) {
    return this._fetch({ method: 'DELETE', endpoint, query });
  }

  getInstall(key, { query }) {
    return this.get({ endpoint: `/installs/${key}`, query });
  }

  organization(key) {
    return new Organization({ client: this, key });
  }
}

Client.BASE_URL = 'https://www.givebriq.com/v0';

exports.Client = Client;
