'use strict'

const debug = require('debug')('web3-simpler-contract')

/**
 * Creates an object with a simplified interface to interact with Web3.js
 * contracts.
 *
 * @param {object} web3 A Web3.js instance.
 * @param {object[]} abi The JSON interface or ABI of the contract.
 * @param {object} addresses The addresses of the contract per chain.
 * @param {object} [options] Additional properties for the Web3.js contract.
 * @returns {object} The simpler contract object.
 */
const createWeb3SimplerContract = function (web3, abi, addresses, options) {
  debug('Creating simpler contract')

  // Get the contract address based on the chain ID and create the contract.
  const contractPromise = web3.eth.getChainId().then(function (id) {
    const address = addresses[id]

    debug('Contract address is %s', address)

    return new web3.eth.Contract(abi, address, options)
  })

  // Gas over-estiamtion helper.
  const safeGas = ({ gasFactor = 2 }) => (gas) => Math.ceil(gas * gasFactor)

  // Generic method.call() wrapper.
  const createCall = ({ inputs, name }) =>
    function (...args) {
      debug('Calling %s', name)

      const count = inputs.length
      const params = args.slice(0, count)
      const [callOptions, block] = args.slice(count)

      return contractPromise.then(function (contract) {
        const promise = contract.methods[name](...params).call(
          { ...callOptions },
          block
        )

        promise
          .then(function () {
            debug('Calling %s succedded', name)
          })
          .catch(function (err) {
            debug('Calling %s failed: %s', name, err.message)
          })

        return promise
      })
    }

  // Generic method.send() wrapper. It also estimates the gas if needed.
  const createSend = ({ inputs, name }) =>
    function (...args) {
      debug('calling %s', name)

      const count = inputs.length
      const params = args.slice(0, count)
      const sendOptions = args.slice(count)[0] || {}

      return contractPromise.then(function (contract) {
        const method = contract.methods[name](...params)

        return Promise.resolve(
          sendOptions.gas ||
            method.estimateGas({ ...sendOptions }).then(safeGas(sendOptions))
        ).then(function (gas) {
          const promiEvent = method.send({ ...sendOptions, gas })

          let hash
          promiEvent.on('transactionHash', function (_hash) {
            debug('Sending tx %s', _hash)
            hash = _hash
          })
          promiEvent.on('receipt', function ({ status }) {
            debug('Sending tx %s succeded with status %s', hash, status)
          })
          promiEvent.on('error', function (err) {
            debug('Sending tx %s failed: %s', hash, err.message)
          })

          return promiEvent
        })
      })
    }

  // Create all the contract simpler methods based on the ABI.
  const methods = abi
    .filter((desc) => desc.type === 'function')
    .map(function (desc) {
      const { name, stateMutability } = desc
      switch (stateMutability) {
        case 'view':
          return { name, fn: createCall(desc) }
        case 'nonpayable':
          return { name, fn: createSend(desc) }
      }
    })
    .reduce((all, { name, fn }) => Object.assign(all, { [name]: fn }), {})

  return methods
}

module.exports = createWeb3SimplerContract
