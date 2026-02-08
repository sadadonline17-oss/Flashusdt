const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GlobalAssetUSDT (USDT Simulator)", function () {
  let token, forwarder, owner, user, recipient;

  beforeEach(async function () {
    [owner, user, recipient] = await ethers.getSigners();

    const GlobalAssetForwarder = await ethers.getContractFactory("GlobalAssetForwarder");
    forwarder = await GlobalAssetForwarder.deploy();
    await forwarder.waitForDeployment();

    const GlobalAssetUSDT = await ethers.getContractFactory("GlobalAssetUSDT");
    token = await GlobalAssetUSDT.deploy(await forwarder.getAddress());
    await token.waitForDeployment();

    // Give some tokens to user
    await token.mint(user.address, ethers.parseUnits("1000", 6));
  });

  it("should have correct name, symbol and decimals", async function () {
    expect(await token.name()).to.equal("Tether USD");
    expect(await token.symbol()).to.equal("USDT");
    expect(await token.decimals()).to.equal(6);
  });

  it("should allow a gasless transfer via the Forwarder", async function () {
    const initialBalance = await token.balanceOf(recipient.address);
    const amount = ethers.parseUnits("100", 6);

    const data = token.interface.encodeFunctionData("transfer", [recipient.address, amount]);
    const nonce = await forwarder.nonces(user.address);
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const domain = {
      name: "GlobalAssetForwarder",
      version: "1",
      chainId: chainId,
      verifyingContract: await forwarder.getAddress(),
    };

    const types = {
      ForwardRequest: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "gas", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint48" },
        { name: "data", type: "bytes" },
      ],
    };

    const request = {
      from: user.address,
      to: await token.getAddress(),
      value: 0n,
      gas: 100000n,
      nonce: nonce,
      deadline: BigInt(deadline),
      data: data,
    };

    const signature = await user.signTypedData(domain, types, request);

    const forwardRequest = {
        from: user.address,
        to: await token.getAddress(),
        value: 0n,
        gas: 100000n,
        deadline: BigInt(deadline),
        data: data,
        signature: signature
    };

    // Execute via owner (acting as relayer)
    await forwarder.connect(owner).execute(forwardRequest);

    expect(await token.balanceOf(recipient.address)).to.equal(initialBalance + amount);
    expect(await token.balanceOf(user.address)).to.equal(ethers.parseUnits("900", 6));
  });

  it("should support EIP-2612 permit", async function () {
    const amount = ethers.parseUnits("50", 6);
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const nonce = await token.nonces(user.address);
    const chainId = (await ethers.provider.getNetwork()).chainId;

    const domain = {
      name: "Tether USD",
      version: "1",
      chainId: chainId,
      verifyingContract: await token.getAddress(),
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const value = {
      owner: user.address,
      spender: owner.address,
      value: amount,
      nonce: nonce,
      deadline: deadline,
    };

    const signature = await user.signTypedData(domain, types, value);
    const { v, r, s } = ethers.Signature.from(signature);

    await token.permit(user.address, owner.address, amount, deadline, v, r, s);

    expect(await token.allowance(user.address, owner.address)).to.equal(amount);
  });
});
