# erc-20-token-list

Simple utility package to search for [ERC-20](https://eips.ethereum.org/EIPS/eip-20) token data.

The main goal to make it easy to, i.e. get a token's address given its symbol.
To do so, it is based on the [Uniswap's default token list](https://github.com/Uniswap/default-token-list) and allows to extend the list of known tokens to improve the search results.

## Install

```sh
npm install erc-20-token-list
```

## Usage

```js
const tokenList = require('erc-20-token-list')

console.log(tokenList.addressOf('WETH'))
// prints `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`

const vspToken = {
  address: '0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421',
  symbol: 'VSP',
  decimals: 18,
  chainId: 1
}
tokenList.registerTokens([vspToken])
console.log(tokenList.addressOf('VSP'))
// prints the VSP token address
```

## API

### registerTokens(tokens)

The module by default loads the Uniswap's token list but more tokens can be added.
This function registers more tokens to the list of known tokens.

#### Arguments

- `tokens` (`Array`): Is a list of new tokens to register.

The tokens are `object`s that contain at least the following properties:

- `name` (`string`): The display name of the token.
- `address` (`string`): The address of the contract in the specified chain.
- `symbol` (`string`): The symbol of the token.
- `decimals` (`number`): The number of decimal the token uses.
- `chainId` (`number`): The ID of the chain where the contract exists.

### addressOf(symbol, chainId?)

Returns the address of a token given its symbol.

The token will be searched in the list of known tokens.
If no exact match is found, a case-insensitive lookup is executed.

#### Arguments

- `symbol` (`string`): The symbol of the token.
- `chainId` (`numnber`): The chain to lookup. Defaults to `1`.

#### Returns

A `string` containing the address of the token contract.

### get(address, chainId?)

Returns the information about the token given its address.

#### Arguments

- `address` (`string`): The address of the token contract.
- `chainId` (`numnber`): The chain to lookup. Defaults to `1`.

#### Returns

An `object` containing the information of the token contract or `undefined` if no token definition is found.
The format is a token item from [Uniswap's default token list](https://github.com/Uniswap/default-token-list).

## License

MIT
