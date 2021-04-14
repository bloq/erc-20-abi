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

simplerToken.balanceOf(myAddress).then(console.log)
// prints the balance

simplerToken.approve(spenderAddress, amount).then(console.log)
// prints the transaction receipt
```

## API

### createContract(web3, abi, addresses, options?)

Creates an object with a simplified interface to interact with Web3.js contracts.

#### Arguments

- `web3`: A `Web3` instance.
- `abi`: The `Array` describing the contract's ABI.
- `addresses`: An `object` that maps a chain ID to the address of the contract in that chain.
- `options`: An `object` with options for the contract.

The `options` are the standard Web3 contract options with the addition of `gasFactor` (`number`).
When estimating the gas of a transaction, the estimation is multiplied by this factor as sending the transaction with the exact estimation as gas limit may result in a out-of-gas rejection.
Defaults to `2`.

See the [Web3 Contract documentation](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html#parameters) for more information.

#### Returns

A `simplerContract` instance.

### simplerContract

It is an `object` that has properties for each contract method that can be "called" or "sent".

### callMethod(...params, callOptions?, defaultBlock?)

These properties are `function`s that will execute a `method().call()` to the underlaying Web3 contract.

#### Arguments

- `params`: The actual parameters of the contract method.
- `callOptions` (`object`) The options used for calling the contract method.
- `defaultBlock` (`number|string`): The block at which the call will be made.

See the [Web3 Contract call method documentation](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html#methods-mymethod-call) for more information.

#### Returns

A `Promise` that will resolve to the result of the contract method execution.

### sendMethod(...params, sendOptions?)

These properties are `function`s that will execute a `method().send()` to the underlaying Web3 contract.

#### Arguments

- `params`: The actual parameters of the contract method.
- `sendOptions` (`object`) The options used for sending the transaction.

See the [Web3 Contract send method documentation](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html#methods-mymethod-send) for more information.

#### Returns

A `Promise` that will resolve to the receipt of the transaction sent.

## License

MIT
