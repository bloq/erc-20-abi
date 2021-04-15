'use strict'

const chai = require('chai')

const createErc20 = require('..')

chai.should()

const mockMethod = (result) => () => ({
  call: () => Promise.resolve(result)
})

const chainId = 7327 // test
const mockWeb3 = {
  eth: {
    Contract: function () {
      return {
        methods: {
          balanceOf: mockMethod('1'),
          decimals: mockMethod('18'),
          symbol: mockMethod('VSP')
        }
      }
    },
    getChainId: () => Promise.resolve(chainId)
  }
}
const addresses = { [chainId]: '0x01' }

describe('ERC-20 library', function () {
  it('should create a contract', function () {
    const contract = createErc20(mockWeb3, addresses)
    contract.should.have.property('balanceOf').that.is.a('function')
    return contract.balanceOf('0x02').then(function (balance) {
      balance.should.equal('1')
    })
  })

  it('should extend a contract', function () {
    const getDetails = (contract) => ({
      getDetails: () =>
        Promise.all([
          contract.decimals(),
          contract.symbol()
        ]).then(([decimals, symbol]) => ({ decimals, symbol }))
    })
    // @ts-ignore TS2339
    const extendedCreate = createErc20.with(getDetails)
    const contract = extendedCreate(mockWeb3, addresses)
    contract.should.have.property('getDetails').that.is.a('function')
    return contract.getDetails().then(function (info) {
      info.should.deep.equal({ decimals: '18', symbol: 'VSP' })
    })
  })
})
