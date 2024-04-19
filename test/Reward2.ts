import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import hre, { ethers } from "hardhat"

describe("TEST", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners()

    const Token = await hre.ethers.getContractFactory("MockToken")
    const token = await Token.deploy()

    const Reward = await hre.ethers.getContractFactory("Reward2")
    const reward = await Reward.deploy(token.target)

    return { token, reward, owner, otherAccount }
  }

  describe("Reward2", function () {
    it("Claim reward", async function () {
      const { token, reward, otherAccount, owner } = await loadFixture(deploy)

      await (await token.transfer(reward.target, 10000n)).wait()

      const chainId = (await ethers.provider.getNetwork()).chainId

      const beforeBalance = await token.balanceOf(otherAccount)
      const signuare = await owner.signTypedData(
        {
          name: "ILMT",
          chainId,
          version: "1",
          verifyingContract: reward.target.toString(),
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
          token: token.target,
          to: otherAccount.address,
          amount: 10000n,
          nonce: 0n,
        }
      )

      await reward.claimReward(
        otherAccount.address,
        10000n,
        parseInt(signuare.slice(-2), 16),
        signuare.slice(0, 66),
        `0x${signuare.slice(66, 130)}`
      )
      const afterBalance = await token.balanceOf(otherAccount)

      expect(afterBalance - beforeBalance).eq(10000n)
    })

    it("Claim reward with error", async function () {
      const { token, reward, otherAccount, owner } = await loadFixture(deploy)

      await (await token.transfer(reward.target, 10000n)).wait()

      const chainId = (await ethers.provider.getNetwork()).chainId

      const signuare = await otherAccount.signTypedData(
        {
          name: "ILMT",
          chainId,
          version: "1",
          verifyingContract: reward.target.toString(),
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
          token: token.target,
          to: otherAccount.address,
          amount: 10000n,
          nonce: 0n,
        }
      )

      await expect(
        reward.claimReward(
          otherAccount.address,
          10000n,
          parseInt(signuare.slice(-2), 16),
          signuare.slice(0, 66),
          `0x${signuare.slice(66, 130)}`
        )
      ).to.be.revertedWith("Reward:Invalid signatures")
    })

    it("Withdraw", async function () {
      const { token, reward, owner } = await loadFixture(deploy)

      await (await token.transfer(reward.target, 10000n)).wait()

      const beforeBalance = await token.balanceOf(owner)
      await (await reward.withdraw(10000n)).wait()
      const afterBalance = await token.balanceOf(owner)

      expect(afterBalance - beforeBalance).eq(10000n)
    })
  })
})
