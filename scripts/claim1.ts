import { ethers } from "hardhat"

async function main() {
  const to = ""
  const rewardContract = ""
  const amount = 10000n

  const reward = await ethers.getContractAt("Reward1", rewardContract)

  const tx = await (await reward.claimReward(amount, to)).wait()

  console.log("Reward1 claim reward:", tx?.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
