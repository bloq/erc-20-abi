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

console.log(tokenList.addressOf('WETH')) // prints `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`

const vspToken = {
  address: '0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421',
  symbol: 'VSP',
  decimals: 18,
  chainId: 1
}
tokenList.registerTokens([vspToken])
console.log(tokenList.addressOf('VSP')) // prints the VSP token address
```

## API

See the [API documentation](API.md).

## License

MIT
