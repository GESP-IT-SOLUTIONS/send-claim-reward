import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import dotenv from "dotenv"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  networks: {
    bscTestnet: {
      url: "https://bsc-testnet.publicnode.com",
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 97,
    },
    bsc: {
      url: "https://bsc-dataseed1.binance.org",
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 56,
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSC_API_KEY ?? "",
      bscTestnet: process.env.BSC_API_KEY ?? "",
    },
  },
}

export default config
