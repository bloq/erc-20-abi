<a name="module_web3-simpler-contract"></a>

## web3-simpler-contract

- [web3-simpler-contract](#module_web3-simpler-contract)
  - [createWeb3SimplerContract(web3, abi, addresses, [options])](#exp_module_web3-simpler-contract--createWeb3SimplerContract) ⇒ <code>module:web3~SimplerContract</code> ⏏
    - [~ContractAddresses](#module_web3-simpler-contract--createWeb3SimplerContract..ContractAddresses) : <code>Object.&lt;number, string&gt;</code>
    - [~ContractOptions](#module_web3-simpler-contract--createWeb3SimplerContract..ContractOptions) : <code>object</code>
    - [~CallMethod](#module_web3-simpler-contract--createWeb3SimplerContract..CallMethod) ⇒ <code>Promise</code>
    - [~SendMethod](#module_web3-simpler-contract--createWeb3SimplerContract..SendMethod) ⇒ <code>Promise.&lt;Web3.Eth.TransactionReceipt&gt;</code>
    - [~SimplerContract](#module_web3-simpler-contract--createWeb3SimplerContract..SimplerContract) : <code>Object.&lt;string, (module:web3~CallMethod\|module:web3~SendMethod)&gt;</code>

<a name="exp_module_web3-simpler-contract--createWeb3SimplerContract"></a>

### createWeb3SimplerContract(web3, abi, addresses, [options]) ⇒ <code>module:web3~SimplerContract</code> ⏏

Creates an object with a simplified interface to interact with Web3.js
contracts.

**Kind**: Exported function  
**Returns**: <code>module:web3~SimplerContract</code> - The simpler contract object.

| Param     | Type                                           | Description                                |
| --------- | ---------------------------------------------- | ------------------------------------------ |
| web3      | <code>module:web3~Web3</code>                  | A Web3 instance.                           |
| abi       | <code>Array.&lt;module:web3~AbiItem&gt;</code> | The ABI of the contract.                   |
| addresses | <code>module:web3~ContractAddresses</code>     | The address of the contract on each chain. |
| [options] | <code>module:web3~ContractOptions</code>       | More options for the Web3.js contract.     |

<a name="module_web3-simpler-contract--createWeb3SimplerContract..ContractAddresses"></a>

#### createWeb3SimplerContract~ContractAddresses : <code>Object.&lt;number, string&gt;</code>

The contract address for each chain. It is an object that maps a chain ID to
the address of the contract in that chain.

**Kind**: inner typedef of [<code>createWeb3SimplerContract</code>](#exp_module_web3-simpler-contract--createWeb3SimplerContract)  
<a name="module_web3-simpler-contract--createWeb3SimplerContract..ContractOptions"></a>

#### createWeb3SimplerContract~ContractOptions : <code>object</code>

The options for the simpler contract. These are the Web3 contract options
with the addition of `gasFactor`.

**Kind**: inner typedef of [<code>createWeb3SimplerContract</code>](#exp_module_web3-simpler-contract--createWeb3SimplerContract)  
**Properties**

| Name        | Type                | Description                     |
| ----------- | ------------------- | ------------------------------- |
| [data]      | <code>string</code> | See Web3 contract options.      |
| [from]      | <code>string</code> | See Web3 contract options.      |
| [gas]       | <code>number</code> | See Web3 contract options.      |
| [gasFactor] | <code>number</code> | The gas over-estimation factor. |
| [gasPrice]  | <code>string</code> | See Web3 contract options.      |

<a name="module_web3-simpler-contract--createWeb3SimplerContract..CallMethod"></a>

#### createWeb3SimplerContract~CallMethod ⇒ <code>Promise</code>

Calls a contract method. It receives a variable number of parameters where
the first N are the actual parameters of the contract method. The last 2 are
optional: the call options and the default block.

**Kind**: inner typedef of [<code>createWeb3SimplerContract</code>](#exp_module_web3-simpler-contract--createWeb3SimplerContract)  
**Returns**: <code>Promise</code> - The return value of the call.

| Param   | Type            | Description                                        |
| ------- | --------------- | -------------------------------------------------- |
| ...args | <code>\*</code> | The method params, call options and default block. |

<a name="module_web3-simpler-contract--createWeb3SimplerContract..SendMethod"></a>

#### createWeb3SimplerContract~SendMethod ⇒ <code>Promise.&lt;Web3.Eth.TransactionReceipt&gt;</code>

Sends a transaction by executing a contract method. It receives a variable
number of parameters where the first N are the actual parameters of the
contract method. The last is optional: the send options.

**Kind**: inner typedef of [<code>createWeb3SimplerContract</code>](#exp_module_web3-simpler-contract--createWeb3SimplerContract)  
**Returns**: <code>Promise.&lt;Web3.Eth.TransactionReceipt&gt;</code> - The transaction receipt.

| Param   | Type            | Description                         |
| ------- | --------------- | ----------------------------------- |
| ...args | <code>\*</code> | The method params and send options. |

<a name="module_web3-simpler-contract--createWeb3SimplerContract..SimplerContract"></a>

#### createWeb3SimplerContract~SimplerContract : <code>Object.&lt;string, (module:web3~CallMethod\|module:web3~SendMethod)&gt;</code>

The simpler contract object. It has properties for each contract method that
can be "called" or "sent".

**Kind**: inner typedef of [<code>createWeb3SimplerContract</code>](#exp_module_web3-simpler-contract--createWeb3SimplerContract)
