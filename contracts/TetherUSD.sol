// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TetherUSD
 * @dev implementation of a Tether USD (USDT) mock for security research and red teaming.
 * This contract mimics the name, symbol, and decimals of the real USDT.
 * It includes a permissioned minting function to allow liquidity injection in test environments.
 */
contract TetherUSD is ERC20, Ownable {
    uint8 private _decimals;

    /**
     * @dev Constructor that gives the msg.sender all of existing tokens.
     */
    constructor() ERC20("Tether USD", "USDT") Ownable(msg.sender) {
        _decimals = 6;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Function to mint tokens. Restricted to the contract owner.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
