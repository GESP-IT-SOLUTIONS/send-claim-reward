import { ethers } from "hardhat"

async function main() {
  const to = ""
  const rewardContract = ""
  const token = ""
  const amount = 10000n

  const reward = await ethers.getContractAt("Reward2", rewardContract)

  const [owner] = await ethers.getSigners()

  const chainId = (await ethers.provider.getNetwork()).chainId

  const signuare = await owner.signTypedData(
    {
      name: "ILMT",
      chainId,
      version: "1",
      verifyingContract: rewardContract,
    },
    {
      Claim: [
        {
          name: "token",
          type: "address",
        },
        {
          name: "to",
          type: "address",
        },
        {
          name: "amount",
          type: "uint256",
        },
        {
          name: "nonce",
          type: "uint256",
        },
      ],
    },
    {
      token,
      to,
      amount,
      nonce: 0n,
    }
  )

  const tx = await (
    await reward.claimReward(
      to,
      amount,
      parseInt(signuare.slice(-2), 16),
      signuare.slice(0, 66),
      `0x${signuare.slice(66, 130)}`
    )
  ).wait()

  console.log("Reward2 claim reward:", tx?.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
