#!/usr/bin/env node

import { execSync } from "child_process";
import minimist from "minimist";

// usage example: node storeWasm.js ./build/xion_wasm.wasm xion1234567890
const args = minimist(process.argv.slice(2), {
  boolean: ["query-only"],
  string: ["chain-id", "rpc", "gas-price"],
  default: {
    "chain-id": "xion-testnet-2",
    rpc: "https://rpc.xion-testnet-2.burnt.com:443",
    "gas-price": "0.001uxion",
  },
});

// query only mode: node storeWasm.js --query-only <tx-hash>
const queryOnly = args["query-only"];
const [firstArg, secondArg] = args._;

const chainId = args["chain-id"];
const rpc = args["rpc"];
const gasPrice = args["gas-price"];

async function main() {
  let txHash;

  try {
    if (queryOnly) {
      txHash = firstArg;
      if (!txHash) {
        console.error("Usage: xion-store-wasm --query-only <tx-hash>");
        process.exit(1);
      }
      console.log(`🔍 Querying existing tx: ${txHash}`);
    } else {
      const wasmFile = firstArg;
      const wallet = secondArg;

      if (!wasmFile || !wallet) {
        console.error(
          "Usage: xion-store-wasm <wasm_file> <wallet_name> [--chain-id id] [--rpc url] [--gas-price price] \n or \n Usage: xion-store-wasm --query-only <tx-hash>"
        );
        process.exit(1);
      }

      console.log("📦 Storing WASM contract on-chain...");

      const txOutput = execSync(
        `xiond tx wasm store "${wasmFile}" \
          --chain-id "${chainId}" \
          --gas-adjustment 1.3 \
          --gas-prices "${gasPrice}" \
          --gas auto \
          -y --output json \
          --node "${rpc}" \
          --from "${wallet}"`,
        { encoding: "utf-8" }
      );

      const txResult = JSON.parse(txOutput);
      txHash = txResult.txhash;

      console.log(`✅ Tx submitted. Hash: ${txHash}`);
      console.log("⏳ Waiting before query...");

      // wait for block to be indexed
      await new Promise((r) => setTimeout(r, 7000));
    }

    // Now do the query
    const queryOutput = execSync(
      `xiond query tx "${txHash}" --node "${rpc}" --output json`,
      { encoding: "utf-8" }
    );

    const queryResult = JSON.parse(queryOutput);
    const allEvents = queryResult.events ?? queryResult.logs?.[0]?.events;

    if (!allEvents || allEvents.length === 0) {
      throw new Error("No events found in transaction.");
    }

    const lastEvent = allEvents[allEvents.length - 1];
    const codeId = lastEvent?.attributes?.[1]?.value;

    if (!codeId) {
      throw new Error("Code ID not found in final event.");
    }

    console.log(`🎉 Success!`);
    console.log(`🧾 Tx Hash: ${txHash}`);
    console.log(`📘 Code ID: ${codeId}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
