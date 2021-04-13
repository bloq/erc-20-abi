<a name="module_erc-20-token-list"></a>

## erc-20-token-list

- [erc-20-token-list](#module_erc-20-token-list)
  - [~allTokens](#module_erc-20-token-list..allTokens) : <code>Array.&lt;TokenListItem&gt;</code>
  - [~registerTokens(extraTokens)](#module_erc-20-token-list..registerTokens)
  - [~addressOf(symbol, [chainId])](#module_erc-20-token-list..addressOf) ⇒ <code>string</code> \| <code>undefined</code>
  - [~TokenListItem](#module_erc-20-token-list..TokenListItem) : <code>object</code>

<a name="module_erc-20-token-list..allTokens"></a>

### erc-20-token-list~allTokens : <code>Array.&lt;TokenListItem&gt;</code>

List of all tokens known by this module.

**Kind**: inner property of [<code>erc-20-token-list</code>](#module_erc-20-token-list)  
<a name="module_erc-20-token-list..registerTokens"></a>

### erc-20-token-list~registerTokens(extraTokens)

Register more tokens to the list of known ones.

**Kind**: inner method of [<code>erc-20-token-list</code>](#module_erc-20-token-list)

| Param       | Type                                     | Description         |
| ----------- | ---------------------------------------- | ------------------- |
| extraTokens | <code>Array.&lt;TokenListItem&gt;</code> | Tokens to register. |

<a name="module_erc-20-token-list..addressOf"></a>

### erc-20-token-list~addressOf(symbol, [chainId]) ⇒ <code>string</code> \| <code>undefined</code>

Obtain the address of a token given its symbol.

The token will be searched in the list of known tokens. If no exact match is
found, a case-insensitive lookup is executed. If no match is found, the
function returns `undefined`.

**Kind**: inner method of [<code>erc-20-token-list</code>](#module_erc-20-token-list)  
**Returns**: <code>string</code> \| <code>undefined</code> - The address of the token.

| Param     | Type                | Default        | Description                       |
| --------- | ------------------- | -------------- | --------------------------------- |
| symbol    | <code>string</code> |                | The symbol of the token.          |
| [chainId] | <code>number</code> | <code>1</code> | The chain where the token exists. |

<a name="module_erc-20-token-list..TokenListItem"></a>

### erc-20-token-list~TokenListItem : <code>object</code>

**Kind**: inner typedef of [<code>erc-20-token-list</code>](#module_erc-20-token-list)  
**Properties**

| Name      | Type                |
| --------- | ------------------- |
| [name]    | <code>string</code> |
| address   | <code>string</code> |
| symbol    | <code>string</code> |
| decimals  | <code>number</code> |
| chainId   | <code>number</code> |
| [logoURI] | <code>string</code> |
