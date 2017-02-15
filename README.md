# briq-api-node
Node client for the Briq API

## Install

In your terminal, type:

```Bash
$ npm install briq-api --save
```

Then, in your node application, you can require the module and create a new client instance.

```Javascript
const Briq = require('briq-api').Client;
const briq = new Briq(process.env.BRIQ_ACCESS_TOKEN);
```

## Configuration

The Briq client requires an access token, used to validate and restrict resource access. 
A token is uniquely bound to a Briq team.
If you're building a custom Briq application, you'll find your access token in the application 
config screen. It is recommended that your token is stored in a safe place and not committed
with your source code.
If (when?) your application becomes public and is offered on the Marqet (got it?), you will receive
an access token for each new install of your app.

```Javascript
const briq = new Briq(process.env.BRIQ_ACCESS_TOKEN);
```

## Usage

The Briq API client is Promise-based. The API surface is pretty narrow. 
You can do much of the work with only a few methods.

```
const briq = new Briq(process.env.BRIQ_ACCESS_TOKEN);

return briq.organization('YOUR_ORGANIZATION_NAME').users()
  .then(users => {
    console.log(users);
    return users;
  });
```
