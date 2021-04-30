'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')
const createErc20 = require('erc-20-lib')
const Web3 = require('web3')

const uniswap = require('..')

const fixture = require('./fixture.json')
const fakeProvider = require('./web3-providers-fake')

chai.use(chaiAsPromised).use(chaiSubset).should()

describe('Uniswap extension', function () {
  it('should swap ETH for token', function () {
    // @ts-ignore ts(2339)
    const createErc20WithUniswap = createErc20.with(uniswap)

    const {
      blockHash,
      chainId,
      chainIdHex,
      dataRegExp,
      from,
      gasPrice,
      status,
      to,
      tokenAddress,
      transactionHash,
      value,
      valueHex
    } = fixture.swapEth

    const calls = [
      { method: 'eth_chainId', params: [], result: chainIdHex },
      { method: 'eth_chainId', params: [], result: chainIdHex },
      { method: 'eth_gasPrice', params: [], result: gasPrice },
      {
        method: 'eth_sendTransaction',
        params: [
          {
            value: valueHex,
            data: (d) => new RegExp(dataRegExp).test(d),
            from,
            to
          }
        ],
        result: transactionHash
      },
      {
        method: 'eth_getTransactionReceipt',
        params: [transactionHash],
        result: { status, blockHash, transactionHash }
      }
    ]
    const provider = fakeProvider(calls)
    // @ts-ignore ts(2351)
    const web3 = new Web3(provider)

    const token = createErc20WithUniswap(
      web3,
      { [chainId]: tokenAddress },
      { from }
    )

    return token.swapFromEth(value)
  })

  it('should return the token-to-USDC rate', function () {
    // @ts-ignore ts(2339)
    const createErc20WithUniswap = createErc20.with(uniswap)

    const {
      chainId,
      chainIdHex,
      data,
      rate,
      result,
      to,
      tokenAddress
    } = fixture.uniToUsdcRate

    const calls = [
      { method: 'eth_chainId', params: [], result: chainIdHex },
      { method: 'eth_chainId', params: [], result: chainIdHex },
      { method: 'eth_call', params: [{ data, to }, 'latest'], result }
    ]
    const provider = fakeProvider(calls)
    // @ts-ignore ts(2351)
    const web3 = new Web3(provider)

    const token = createErc20WithUniswap(web3, { [chainId]: tokenAddress })

    return token.getRateToUsdc().should.eventually.equal(rate)
  })

  it('should return 1 when calling token-to-USDC at USDC', function () {
    // @ts-ignore ts(2339)
    const createErc20WithUniswap = createErc20.with(uniswap)

    const { chainId, chainIdHex, tokenAddress } = fixture.usdcToUsdcRate

    const calls = [
      { method: 'eth_chainId', params: [], result: chainIdHex },
      { method: 'eth_chainId', params: [], result: chainIdHex }
    ]
    const provider = fakeProvider(calls)
    // @ts-ignore ts(2351)
    const web3 = new Web3(provider)

    const token = createErc20WithUniswap(web3, { [chainId]: tokenAddress })

    return token.getRateToUsdc().should.eventually.equal(1)
  })
})
