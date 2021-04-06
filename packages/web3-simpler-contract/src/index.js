'use strict'

const debug = require('debug')('web3-simpler-contract')

/**
 * @module web3-simpler-contract
 */

/**
 * @ignore
 * @typedef {import('web3').default} Web3
 * @see https://github.com/ChainSafe/web3.js/tree/1.x/packages/web3
 */

/**
 * @ignore
 * @typedef {import('web3-utils').AbiItem} AbiItem
 * @see https://github.com/ChainSafe/web3.js/tree/1.x/packages/web3-utils
 */

/* eslint-disable jsdoc/check-types */
/**
 * The contract address for each chain. It is an object that maps a chain ID to
 * the address of the contract in that chain.
 *
 * @typedef {Object.<number,string>} ContractAddresses
 */
/* eslint-enable jsdoc/check-types */

/**
 * The options for the simpler contract. These are the Web3 contract options
 * with the addition of `gasFactor`.
 *
 * @typedef {object} ContractOptions
 * @property {string} [data] See Web3 contract options.
 * @property {string} [from] See Web3 contract options.
 * @property {number} [gas] See Web3 contract options.
 * @property {number} [gasFactor] The gas over-estimation factor.
 * @property {string} [gasPrice] See Web3 contract options.
 */

/**
 * Calls a contract method. It receives a variable number of parameters where
 * the first N are the actual parameters of the contract method. The last 2 are
 * optional: the call options and the default block.
 *
 * @typedef {Function} CallMethod
 * @param {...*} args The method params, call options and default block.
 * @returns {Promise} The return value of the call.
 */

/**
 * Sends a transaction by executing a contract method. It receives a variable
 * number of parameters where the first N are the actual parameters of the
 * contract method. The last is optional: the send options.
 *
 * @typedef {Function} SendMethod
 * @param {...*} args The method params and send options.
 * @returns {Promise<Web3.Eth.TransactionReceipt>} The transaction receipt.
 */

/* eslint-disable jsdoc/check-types */
/**
 * The simpler contract object. It has properties for each contract method that
 * can be "called" or "sent".
 *
 * @typedef {Object.<string,CallMethod|SendMethod>} SimplerContract
 */
/* eslint-enable jsdoc/check-types */

/**
 * Creates an object with a simplified interface to interact with Web3.js
 * contracts.
 *
 * @param {Web3} web3 A Web3 instance.
 * @param {AbiItem[]} abi The ABI of the contract.
 * @param {ContractAddresses} addresses The address of the contract on each chain.
 * @param {ContractOptions} [options] More options for the Web3.js contract.
 * @returns {SimplerContract} The simpler contract object.
 * @alias module:web3-simpler-contract
 */
function createWeb3SimplerContract(web3, abi, addresses, options = {}) {
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
  const createCall = ({ inputs = [], name = 'fallback' }) =>
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
  const createSend = ({ inputs = [], name = 'fallback' }) =>
    function (...args) {
      debug('calling %s', name)

      const count = inputs.length
      const params = args.slice(0, count)
      const sendOptions = args.slice(count)[0] || {}

      return contractPromise.then(function (contract) {
        const method = contract.methods[name](...params)

        return Promise.resolve(
          sendOptions.gas ||
            method.estimateGas({ ...sendOptions }).then(safeGas(options))
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
    .filter((desc) => desc.type === 'function' && desc.name)
    .map(function (desc) {
      const { name, stateMutability } = desc
      switch (stateMutability) {
        case 'view':
          return { name, fn: createCall(desc) }
        case 'nonpayable':
          return { name, fn: createSend(desc) }
        default:
          throw new Error(`Unsupported mutability type: ${stateMutability}`)
      }
    })
    .reduce((all, { name, fn }) => Object.assign(all, { [name]: fn }), {})

  return methods
}

module.exports = createWeb3SimplerContract
