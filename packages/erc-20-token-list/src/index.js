'use strict'

const { tokens } = require('@uniswap/default-token-list')
const debug = require('debug')('erc-20-token-list')

/**
 * A token definition as specified by the Uniswap's default token.
 *
 * @see https://tokenlists.org/
 *
 * @typedef {object} TokenInfo
 * @property {string} name
 * @property {string} address
 * @property {string} symbol
 * @property {number} decimals
 * @property {number} chainId
 * @property {string} [logoURI]
 */

/**
 * List of all tokens known by this module.
 *
 * @type {TokenInfo[]}
 */
let allTokens = tokens

/**
 * Registers more tokens to the list of known ones.
 *
 * @param {TokenInfo[]} extraTokens Tokens to register.
 */
function registerTokens(extraTokens) {
  debug('Registering %s tokens', extraTokens.length)

  allTokens = allTokens.concat(extraTokens)
}

/**
 * Returns the information about the token given its address.
 *
 * @param {string} address The address of the token contract.
 * @param {number} [chainId] The chain where the token exists.
 * @returns {object | undefined} The information about the token.
 */
function get(address, chainId = 1) {
  debug('Getting %s:%s token info', address, chainId)

  const chainTokens = allTokens.filter((t) => t.chainId === chainId)
  const token = chainTokens.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  )

  debug('Token at %s:%s %s', token ? `is ${token.symbol}` : 'not found')

  return token
}

/**
 * Returns the address of a token given its symbol.
 *
 * The token will be searched in the list of known tokens. If no exact match is
 * found, a case-insensitive lookup is executed. If no match is found, the
 * function returns `undefined`.
 *
 * @param {string} symbol The symbol of the token.
 * @param {number} [chainId] The chain where the token exists.
 * @returns {string | undefined} The address of the token.
 */
function addressOf(symbol, chainId = 1) {
  debug('Getting address of %s:%d', symbol, chainId)

  const chainTokens = allTokens.filter((t) => t.chainId === chainId)
  const token =
    chainTokens.find((t) => t.symbol === symbol) ||
    chainTokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase())
  const address = token && token.address

  debug(
    address ? '%s:%d address is %s' : '%s:%d address not found',
    symbol,
    chainId,
    address || ''
  )

  return address
}

module.exports = {
  registerTokens,
  addressOf,
  get
}
