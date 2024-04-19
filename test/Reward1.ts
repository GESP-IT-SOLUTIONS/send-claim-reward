import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import hre from "hardhat"

describe("TEST", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners()

    const Token = await hre.ethers.getContractFactory("MockToken")
    const token = await Token.deploy()

    const Reward = await hre.ethers.getContractFactory("Reward1")
    const reward = await Reward.deploy(token.target)

    return { token, reward, owner, otherAccount }
  }

  describe("Reward1", function () {
    it("Claim reward", async function () {
      const { token, reward, otherAccount } = await loadFixture(deploy)

      await (await token.transfer(reward.target, 10000n)).wait()

      const beforeBalance = await token.balanceOf(otherAccount)
      await (await reward.claimReward(10000n, otherAccount.address)).wait()
      const afterBalance = await token.balanceOf(otherAccount)

      expect(afterBalance - beforeBalance).eq(10000n)
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
