<!-- README for NPM -->

## ONDC /vlookup UTILITY

1. Install the package.

```sh
npm i vlookup-ondc

```

2. Import the vLookUp method in your project.

```js
const vLookUp = require("vlookup-ondc");

vLookUp({
  senderSubscriberId: "", //subscriber_id of sender
  privateKey: "", //private key of sender in base64 encoding

  //search parameters of the NP whose details need to be fetched from registry
  domain: "nic2004:52110",
  subscriberId: "buyerApp.com",
  country: "IND",
  type: "buyerApp", //buyerApp, sellerApp, gateway
  city: "std:080",
  env: "preprod", //staging,preprod,prod
}).then((res) => console.log(res));
```

3. The output will include the registry details of the NP.

Please refer to the [GitHub README](https://github.com/bluecypher/vlookup-ondc-nodejs#readme) for the documentation.
