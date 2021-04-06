# web3-simpler-contract

For scenarios like simple dApps or CLI tools, it is sometimes easier to interact with a subset or a simplified version of the [Web3.js](https://github.com/ChainSafe/web3.js) contract interface. This package creates such a simpler version of a contract object with a property for each contract method that returns a `Promise`.

So calls to view methods just follow the pattern `contract.method(...args)` as well as calls to methods that will end up signing and sending a transaction.

As an advantage over the Web3.js contract interface, and to simplify the user code, when sending a transaction and the gas is not specified, the simpler contract will do the gas estimation automatically.

Note that given this creates a simplified contract, many Web3.js contract features are not supported and this is intentional.

## Install

```sh
npm install web3-simpler-contract
```

## Usage

```js
const createContract = require('web3-simpler-contract')

const simplerToken = createContract(
  web3,
  abi,
  { 1: tokenMainnetAddress },
  { from }
)

simplerToken.balanceOf(myAddress).then(console.log) // prints my balance

simplerToken.approve(spenderAddress, amount).then(console.log) // prints the transaction receipt
```

## API

See the [API documentation](API.md).

## License

MIT
