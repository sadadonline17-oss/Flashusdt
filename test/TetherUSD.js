const { expect } = require("chai");
const hre = require("hardhat");

describe("TetherUSD", function () {
  let tether;
  let owner;
  let otherAccount;

  beforeEach(async function () {
    [owner, otherAccount] = await hre.ethers.getSigners();
    const TetherUSD = await hre.ethers.getContractFactory("TetherUSD");
    tether = await TetherUSD.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await tether.name()).to.equal("Tether USD");
      expect(await tether.symbol()).to.equal("USDT");
    });

    it("Should set the right decimals", async function () {
      expect(await tether.decimals()).to.equal(6);
    });

    it("Should set the right owner", async function () {
      expect(await tether.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const amount = hre.ethers.parseUnits("100", 6);
      await tether.mint(otherAccount.address, amount);
      expect(await tether.balanceOf(otherAccount.address)).to.equal(amount);
    });

    it("Should fail if non-owner tries to mint tokens", async function () {
      const amount = hre.ethers.parseUnits("100", 6);
      await expect(
        tether.connect(otherAccount).mint(otherAccount.address, amount)
      ).to.be.revertedWithCustomError(tether, "OwnableUnauthorizedAccount");
    });
  });
});
