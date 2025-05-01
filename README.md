# XION Store WASM CLI

A command-line tool for storing WASM contracts on the XION blockchain network.

## Description

This CLI tool provides a simple way to store WASM contracts on the XION blockchain network. It handles the transaction submission and provides a convenient way to query the transaction status and retrieve the resulting code ID.

## Installation

```bash
# Install globally
npm install -g xion-store-wasm

# Or install locally
npm install xion-store-wasm
```

## Prerequisites

- Node.js (v14 or higher)
- XION CLI (`xiond`) installed and configured
- A wallet with sufficient funds for the transaction

## Usage

### Store a WASM Contract

```bash
xion-store-wasm <wasm_file> <wallet_name> [options]
```

#### Options

- `--chain-id`: Specify the chain ID (default: "xion-testnet-2")
- `--rpc`: Specify the RPC endpoint (default: "https://rpc.xion-testnet-2.burnt.com:443")
- `--gas-price`: Specify the gas price (default: "0.001uxion")

### Query Transaction Status

```bash
xion-store-wasm --query-only <tx-hash>
```

## Examples

1. Store a WASM contract:
```bash
xion-store-wasm ./build/xion_wasm.wasm mywallet
```

2. Store with custom options:
```bash
xion-store-wasm ./build/xion_wasm.wasm mywallet --chain-id custom-chain --rpc https://custom-rpc.com
```

3. Query transaction status:
```bash
xion-store-wasm --query-only ABC123DEF456...
```

## Output

The tool will display:
- Transaction hash
- Code ID (after successful storage)
- Any errors that occur during the process

## License

MIT

## Author

Sun Burnt 