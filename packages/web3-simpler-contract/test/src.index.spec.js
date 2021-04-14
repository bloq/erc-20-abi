'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')
const EventEmitter = require('events')

const createWeb3SimplerContract = require('..')

chai.use(chaiAsPromised).use(chaiSubset).should()

describe('Simpler Contract', function () {
  it('should create a simpler contract', function () {
    const chainId = 0
    const address = '0x00'
    const abi = [
      {
        name: 'aCallMethod',
        stateMutability: 'view',
        type: 'function'
      }
    ]
    const web3 = {
      eth: {
        Contract: function Contract(_abi, _address) {
          _abi.should.equals(abi)
          _address.should.equals(address)
        },
        getChainId: () => Promise.resolve(chainId)
      }
    }

    const addresses = { [chainId]: address }
    const simplerContract = createWeb3SimplerContract(web3, abi, addresses)
    simplerContract.should.be.an('object').that.has.keys(['aCallMethod'])
    simplerContract.should.have.property('aCallMethod').that.is.a('function')
  })

  it('should call a method', function () {
    const chainId = 0
    const address = '0x00'
    const abi = [
      {
        inputs: [{ type: 'uint256' }],
        name: 'nextOf',
        stateMutability: 'view',
        type: 'function'
      }
    ]
    const from = '0x10'
    const block = 'latest'
    const web3 = {
      eth: {
        Contract: function Contract() {
          this.methods = {
            nextOf: (number) => ({
              call: function (options, defaultBlock) {
                options.should.be.an('object').that.deep.equals({})
                defaultBlock.should.be.equal(block)
                return Promise.resolve((Number.parseInt(number) + 1).toString())
              }
            })
          }
        },
        getChainId: () => Promise.resolve(chainId)
      }
    }

    const addresses = { [chainId]: address }
    const simplerContract = createWeb3SimplerContract(web3, abi, addresses, {
      from
    })
    return simplerContract.nextOf('1', {}, block).then(function (next) {
      next.should.equals('2')
    })
  })

  it('should reject a failed call', function () {
    const chainId = 0
    const address = '0x00'
    const abi = [
      {
        inputs: [],
        name: 'throwError',
        stateMutability: 'view',
        type: 'function'
      }
    ]
    const web3 = {
      eth: {
        Contract: function Contract() {
          this.methods = {
            throwError: () => ({
              call: () => Promise.reject(new Error('Fake error'))
            })
          }
        },
        getChainId: () => Promise.resolve(chainId)
      }
    }

    const addresses = { [chainId]: address }
    const simplerContract = createWeb3SimplerContract(web3, abi, addresses)
    return simplerContract.throwError().should.be.rejectedWith('Fake error')
  })

  it('should send a transaction', function () {
    const chainId = 0
    const address = '0x00'
    const abi = [
      {
        inputs: [{ type: 'uint256' }],
        name: 'inc',
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]
    const from = '0x10'
    const index = '1'
    const gas = 10
    const hash = '0xa0'
    const receipt = { status: true }
    const web3 = {
      eth: {
        Contract: function Contract() {
          this.methods = {
            inc: function (_index) {
              _index.should.be.a('string').that.equals(index)
              return {
                send: function (options) {
                  options.should.be.an('object').that.containSubset({ gas })
                  const fakePromiEvent = Promise.resolve(receipt)
                  const emitter = new EventEmitter()
                  // @ts-ignore 2339
                  fakePromiEvent.on = emitter.on.bind(emitter)
                  fakePromiEvent.then(function (_receipt) {
                    emitter.emit('transactionHash', hash)
                    emitter.emit('receipt', _receipt)
                  })
                  return fakePromiEvent
                }
              }
            }
          }
        },
        getChainId: () => Promise.resolve(chainId)
      }
    }

    const addresses = { [chainId]: address }
    const simplerContract = createWeb3SimplerContract(web3, abi, addresses, {
      from
    })
    return simplerContract.inc(index, { gas }).then(function (_receipt) {
      _receipt.should.equals(receipt)
    })
  })

  it('should estimate the gas and send a transaction', function () {
    const chainId = 0
    const address = '0x00'
    const abi = [
      {
        inputs: [{ type: 'uint256' }],
        name: 'inc',
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]
    const from = '0x10'
    const index = '1'
    const gas = 10
    const gasFactor = 2
    const hash = '0xa0'
    const receipt = { status: true }
    const web3 = {
      eth: {
        Contract: function Contract() {
          this.methods = {
            inc: function (_index) {
              _index.should.be.a('string').that.equals(index)
              return {
                estimateGas: function (options) {
                  options.should.be.an('object').that.containSubset({})
                  return Promise.resolve(gas)
                },
                send: function (options) {
                  options.should.be
                    .an('object')
                    .that.containSubset({ gas: gas * gasFactor })
                  const fakePromiEvent = Promise.resolve(receipt)
                  const emitter = new EventEmitter()
                  // @ts-ignore 2339
                  fakePromiEvent.on = emitter.on.bind(emitter)
                  fakePromiEvent.then(function (_receipt) {
                    emitter.emit('transactionHash', hash)
                    emitter.emit('receipt', _receipt)
                  })
                  return fakePromiEvent
                }
              }
            }
          }
        },
        getChainId: () => Promise.resolve(chainId)
      }
    }

    const addresses = { [chainId]: address }
    const simplerContract = createWeb3SimplerContract(web3, abi, addresses, {
      from,
      gasFactor
    })
    return simplerContract.inc(index).then(function (_receipt) {
      _receipt.should.equals(receipt)
    })
  })

  it('should reject a failed sent', function () {
    const chainId = 0
    const address = '0x00'
    const abi = [
      {
        inputs: [],
        name: 'throwError',
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]
    const hash = '0xa0'
    const web3 = {
      eth: {
        Contract: function Contract() {
          this.methods = {
            throwError: () => ({
              estimateGas: () => Promise.resolve('0'),
              send: function () {
                const fakePromiEvent = Promise.reject(new Error('Fake revert'))
                const emitter = new EventEmitter()
                // @ts-ignore 2339
                fakePromiEvent.on = emitter.on.bind(emitter)
                fakePromiEvent.catch(function (err) {
                  emitter.emit('transactionHash', hash)
                  emitter.emit('error', err)
                })
                return fakePromiEvent
              }
            })
          }
        },
        getChainId: () => Promise.resolve(chainId)
      }
    }

    const addresses = { [chainId]: address }
    const simplerContract = createWeb3SimplerContract(web3, abi, addresses)
    return simplerContract.throwError().should.be.rejectedWith('Fake revert')
  })

  it('should send a transaction with ether')
})
