# erc-20-lib

A library to simplify using [ERC-20](https://eips.ethereum.org/EIPS/eip-20) token contracts.

It uses [`web3-simpler-contract`](https://github.com/bloq/erc-20-abi/tree/master/packages/web3-simpler-contract) to create the token contracts and also allows to easily extend those contracts with additional methods that can be used to create workflows in a single call.

The module exposes a factory method that will create the contracts.
This factory has a `with` method that receives an extension function creating a new factory.
The new factory will then be used to create new contracts with the applied "extensions".
See the examples below for use cases.

## Install

```sh
npm install erc-20-lib
```

## Usage

```js
const erc20Lib = require('erc-20-lib')

const vspToken = createErc20(web3, { 1: vspAddress })
contract.balanceOf(myAddress).then(console.log)
// prints my VSP balance

const getMetadata = (contract) => ({
  getMetadata: () =>
    Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ]).then(([name, symbol, decimals]) => ({ name, symbol, decimals }))
})

const createErc20WithMeta = createErc20.with(getMetadata)
contract.getMetadata().then(console.log)
// prints the token name, symbol and decimals
```

## API

### createErc20(web3, addresses, options?)

See the `web3-simpler-contract` factory.

### createErc20.with(extension)

A `function` that will create a new factory with the given extension.
This method is chainable to allow adding more extensions as needed.

#### Arguments

- `extension` (`function`): An `extensionFunction` function. See below.

#### Returns

A new factory `function` that will apply to the ERC-20 contract all the extensions in sequence.

### extensionFunction(contract)

A `function` that receives a contract created by the factory and return an object with methods.
Those methods will be added to the newly created contracts by factories that where extended with this extension function.

## License

MIT
