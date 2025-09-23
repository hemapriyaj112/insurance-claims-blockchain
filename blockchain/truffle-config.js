module.exports = {
  // Network configuration
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "1337",
      // Set the gas limit slightly higher for more complex contracts
      gas: 6721975,
      gasPrice: 20000000000,
    }
  },

  // Solidity compiler configuration
  compilers: {
    solc: {
      // Use the exact same version as your contract
      version: "0.8.21",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        // The EVM version must be compatible with your Solidity version
        // "london" is a safe and modern choice
        evmVersion: "london" 
      }
    }
  },

  // Truffle DB is disabled by default
  db: {
    enabled: false
  }
};