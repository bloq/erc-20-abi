'use strict'

const chai = require('chai')

const erc20TokenList = require('..')

const should = chai.should()

describe('Tokens List', function () {
  it('should get WETH address', function () {
    const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    erc20TokenList.addressOf('WETH').should.equal(wethAddress)
  })

  it('should return undefined for an unknown token', function () {
    should.not.exist(erc20TokenList.addressOf('UNKNOWN'))
  })

  it('should handle lowercase symbols', function () {
    const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    erc20TokenList.addressOf('weth').should.equal(wethAddress)
  })

  it('should get WETH address on ETC', function () {
    const wethAddress = '0xd0A1E359811322d97991E03f863a0C30C2cF029C'
    erc20TokenList.addressOf('WETH', 42).should.equal(wethAddress)
  })

  it('should handle new tokens', function () {
    const newTokens = [
      {
        address: '0xNewAddress',
        chainId: 3,
        decimals: 1,
        name: 'New token',
        symbol: 'NEW'
      }
    ]
    erc20TokenList.registerTokens(newTokens)
    erc20TokenList.addressOf('NEW', 3).should.equal(newTokens[0].address)
  })

  it('should get WETH information', function () {
    const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    erc20TokenList.get(wethAddress).should.have.property('symbol', 'WETH')
  })

  it('should return undefined for unknown addresses', function () {
    should.not.exist(erc20TokenList.get('0xUNKNOWN'))
  })
})
