import { ethers } from "hardhat"

async function main() {
  const reward = await ethers.deployContract("Reward2", [
    "0xFE249A55B6f1FFa71592DA84d50DAF87e8E01385",
  ])

  await reward.waitForDeployment()

  console.log("Reward1:", reward.target)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
