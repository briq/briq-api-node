const Client = require('./client');

class Briq {
  constructor(options) {
    options.baseURL = options.baseURL || Briq.BASE_URL;
    this.client = new Client(options);
  }

  organization() {
    return this.client.get({ endpoint: '' });
  }

  users() {
    const endpoint = `/users`;
    return this.client.get({ endpoint });
  }

  user(username) {
    const endpoint = `/users/${username}`;
    return this.client.get({ endpoint });
  }

  transactions() {
    const endpoint = `/transactions`;
    return this.client.get({ endpoint });
  }

  transaction(id) {
    const endpoint = `/transactions/${id}`;
    return this.client.get({ endpoint });
  }

  createTransaction(transaction) {
    const endpoint = `/transactions`;
    return this.client.post({ endpoint, body: transaction });
  }

  refundTransaction(id) {
    const endpoint = `/transactions/${id}`;
    return this.client.delete({ endpoint });
  }
}

Briq.BASE_URL = 'https://www.givebriq.com/v0';
Briq.Client = Client;

exports.Client = Briq;
