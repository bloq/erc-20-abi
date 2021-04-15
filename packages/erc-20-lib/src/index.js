'use strict'

const abi = require('erc-20-abi')
const createWeb3SimplerContract = require('web3-simpler-contract')
const debug = require('debug')('erc-20-lib')

// Creates a factory to create contracts with the supplied extensions.
const createWithExtensions = function (extensions) {
  // Creates simple ERC-20 contracts with the supplied extensions.
  const createExtendedContract = function (web3, addresses, options) {
    debug('Creating an ERC-20 contract (%s extensions)', extensions.length)

    // @ts-ignore TS2345
    const contract = createWeb3SimplerContract(web3, abi, addresses, options)
    const extendedMethods = extensions.map((extension) => extension(contract))

    // Mix in all the extenstions into the contract.
    return Object.assign(contract, ...extendedMethods)
  }

  // Add the `with` method to create new factories with more extensions.
  createExtendedContract.with = function (extension) {
    debug('Extending the ERC-20 factory: %s', extension.name)

    return createWithExtensions(extensions.concat(extension))
  }

  return createExtendedContract
}

/**
 * An extensible simpler ERC-20 contract factory.
 *
 * @type {Function}
 * @mixes object
 */
const createErc20 = createWithExtensions([])

module.exports = createErc20
