'use strict'

const Big = require('big.js').default
const createContract = require('web3-simpler-contract')
const tokenList = require('erc-20-token-list')

const uniswapV2Router02Abi = require('./uniswap-v2-router-02.json')

const uniswapV2Router02Addresses = {
  1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  3: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  4: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  5: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  69: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
}

const createRouter = (web3, options) =>
  createContract(
    web3,
    uniswapV2Router02Abi,
    uniswapV2Router02Addresses,
    options
  )

const extend = function (contract, web3, options = {}) {
  const { from } = options

  const chainIdAndAddressPromise = Promise.all([
    contract.getChainId(),
    contract.getAddress()
  ])

  const router = createRouter(web3, options)

  const swapFromEth = function (value) {
    return chainIdAndAddressPromise.then(([chainId, address]) =>
      router.swapExactETHForTokens(
        // Require this minimum amount out.
        1,
        [tokenList.addressOf('WETH', chainId), address],
        // Set the recipient of the tokens to the caller.
        from,
        // Set deadline in 60 sec or 4 blocks.
        Math.round(Date.now() / 1000) + 60,
        {
          // Fix the gas limit as the estimation usually fails.
          gas: 150000,
          // And set the amount of ETH to swap for tokens.
          value
        }
      )
    )
  }

  const getRateToUsdc = function () {
    return chainIdAndAddressPromise.then(function ([chainId, address]) {
      const usdcAddress = tokenList.addressOf('USDC', chainId)

      // If the current token is USDC, just return 1 as the rate.
      if (address === usdcAddress) {
        return 1
      }

      // Otherwise, get the decimals from the list to avoid a contract call.
      const { decimals } = tokenList.get(address, chainId)

      // Generate the string representing 1/100 of the token.
      const oneCent = `1${'0'.repeat(decimals - 2)}`

      // Ask the router about the amount of USDC it will return when sending one
      // cent of token to reduce the slippage that occurs when sending a big
      // amount and the liquidity/swap pools do not have enough liquidity.
      return (
        router
          .getAmountsOut(oneCent, [address, usdcAddress])
          // Get the last item in the array of amounts out.
          .then((amounts) => amounts[amounts.length - 1])
          // Finally divide by 1/100 USDC to compensate and get the actual rate.
          .then((amount) => new Big(amount).div(1e4).toNumber())
      )
    })
  }

  return {
    swapFromEth,
    getRateToUsdc
  }
}

module.exports = extend
