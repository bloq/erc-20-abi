'use strict'

const { tokens } = require('@uniswap/default-token-list')

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
  allTokens = allTokens.concat(extraTokens)
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
  const chainTokens = allTokens.filter((t) => t.chainId === chainId)
  const token =
    chainTokens.find((t) => t.symbol === symbol) ||
    chainTokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase())
  return token && token.address
}

module.exports = {
  registerTokens,
  addressOf
}
