import { ethers } from "hardhat"

async function main() {
  console.log(process.argv)
  const token = await ethers.deployContract("MockToken")

  await token.waitForDeployment()

  console.log("Token:", token.target)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
