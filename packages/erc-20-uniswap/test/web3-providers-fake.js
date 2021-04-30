'use strict'

const Web3 = require('web3')
const util = require('util')

const fakeWeb3Provider = function (calls, recordCalls, nodeUrl) {
  let index = 0

  const recordedCalls = []

  // @ts-ignore ts(2339)
  const httpProvider = new Web3.providers.HttpProvider(nodeUrl)
  const send = util.promisify(httpProvider.send.bind(httpProvider))

  const request = function ({ method, params }) {
    const call = calls[index++]

    if (!call || method !== call.method) {
      if (!recordCalls) {
        throw new Error(`Unexpected call to ${method}`)
      }

      return send({ id: index, method, params, jsonrpc: '2.0' })
        .then((response) => response.result)
        .then(function (result) {
          recordedCalls.push({ method, params, result })
          return result
        })
    }

    params.forEach(function (param, i) {
      try {
        param.should.containSubset(call.params[i])
      } catch (err) {
        throw new Error(`Call ${method} params mismatch: ${err.message}`)
      }
    })

    return Promise.resolve(call.result)
  }

  return {
    request,
    getCalls: () => recordedCalls
  }
}

module.exports = fakeWeb3Provider
