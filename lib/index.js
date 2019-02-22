const qs = require('querystring');
const fetch = require('node-fetch');
const merge = require('lodash/merge');
const debug = require('debug')('briq-api');

class Organization {
  constructor({ client, key }) {
    this.client = client;
    this.key = key;
  }

  info() {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}`;
    return this.client.get({ endpoint });
  }

  user(username) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/users/${encodeURIComponent(username)}`;
    return this.client.get({ endpoint });
  }

  users({ query } = {}) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/users`;
    return this.client.get({ endpoint, query });
  }

  groups({ query } = {}) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/groups`;
    return this.client.get({ endpoint, query });
  }

  group(groupId) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/groups/${encodeURIComponent(groupId)}`;
    return this.client.get({ endpoint });
  }

  createTransaction(transaction) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/transactions`;
    return this.client.post({ endpoint, body: transaction });
  }

  transactions({ query } = {}) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/transactions`;
    return this.client.get({ endpoint, query });
  }

  transaction(id) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/transactions/${encodeURIComponent(id)}`;
    return this.client.get({ endpoint });
  }

  refundTransaction(id) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/transactions/${encodeURIComponent(id)}`;
    return this.client.delete({ endpoint });
  }

  createMessage(message) {
    const endpoint = `/organizations/${encodeURIComponent(this.key)}/messages`;
    return this.client.post({ endpoint, body: message });
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
    this.authorization = Buffer.from(`${this.accessToken}:`).toString('base64');
  }

  _fetch({ method, endpoint, body }) {
    const url = `${this.baseURL}${endpoint}`;
    return fetch(url, {
      method,
      headers: { Authorization: `Basic ${this.authorization}`, 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body)
    })
      .then((res) => {
        if (res.ok) {
          if (res.status === 204) {
            // no content, do not parse body
            return Promise.resolve();
          }
          return res.json();
        }

        const err = new Error(`An error occured when calling the Briq API: ${res.status} ${res.statusText}`);
        err.status = res.status;

        // status 4XX includes more details in the response body
        if (res.status >= 400 && res.status <= 499) {
          return res.text()
            .then((text) => {
              try {
                return JSON.parse(text);
              } catch (e) {
                // this should not happen if api server is running properly
                debug('Impossible to parse response body as JSON:');
                debug(text);
                return { status: 500, message: 'Impossible to parse response body as JSON' };
              }
            })
            .then((e) => {
              merge(err, e);
              throw err;
            });
        }

        throw err;
      });
  }

  get({ endpoint, query }) {
    if (typeof query === 'object') {
      endpoint = `${endpoint}?${qs.stringify(query)}`;
    }

    return this._fetch({ method: 'GET', endpoint });
  }

  post({ endpoint, body }) {
    return this._fetch({ method: 'POST', endpoint, body });
  }

  delete({ endpoint }) {
    return this._fetch({ method: 'DELETE', endpoint });
  }

  getInstall(key) {
    return this.get({ endpoint: `/installs/${encodeURIComponent(key)}` });
  }

  organization(key) {
    return new Organization({ client: this, key });
  }
}

Client.BASE_URL = 'https://www.givebriq.com/v0';

exports.Client = Client;
