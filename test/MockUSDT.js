import { expect } from "chai";
import hre from "hardhat";

describe("MockUSDT", function () {
  it("Should have correct name and symbol", async function () {
    const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();

    expect(await usdt.name()).to.equal("Tether USD");
    expect(await usdt.symbol()).to.equal("USDT");
    expect(await usdt.decimals()).to.equal(6);
  });

  it("Should mint tokens correctly", async function () {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();

    const mintAmount = hre.ethers.parseUnits("1000", 6);
    await usdt.mint(otherAccount.address, mintAmount);

    expect(await usdt.balanceOf(otherAccount.address)).to.equal(mintAmount);
  });

  it("Should only allow owner to mint", async function () {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();

    const mintAmount = hre.ethers.parseUnits("1000", 6);
    await expect(
      usdt.connect(otherAccount).mint(otherAccount.address, mintAmount)
    ).to.be.revertedWithCustomError(usdt, "OwnableUnauthorizedAccount");
  });
});
