// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @dev Implementation of a mock USDT for security research and red-teaming simulations.
 * This contract mimics the characteristics of Tether USD (USDT) on various networks.
 */
contract MockUSDT is ERC20, Ownable {
    uint8 private _decimals;

    constructor() ERC20("Tether USD", "USDT") Ownable(msg.sender) {
        _decimals = 6;
        // Initial supply for the deployer to facilitate testing
        _mint(msg.sender, 1000000 * 10 ** _decimals);
    }

    /**
     * @dev Overrides the decimals function to match USDT's 6 decimals.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Function to mint simulation tokens to a specific address.
     * Restricted to the owner (the deployment/simulation bot).
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint (in base units).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
