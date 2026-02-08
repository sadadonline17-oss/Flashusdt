// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/**
 * @title GlobalAssetUSDT
 * @dev ERC20 token simulating USDT with EIP-2612 Permit and EIP-2771 Meta-Transactions.
 * Part of the Global Asset Simulator turnkey solution for Red-Teaming research.
 */
contract GlobalAssetUSDT is ERC20, ERC20Permit, Ownable, ERC2771Context {

    constructor(address trustedForwarder)
        ERC20("Tether USD", "USDT")
        ERC20Permit("Tether USD")
        Ownable(msg.sender)
        ERC2771Context(trustedForwarder)
    {
        // Initial supply: 1,000,000,000 USDT (6 decimals)
        _mint(msg.sender, 1000000000 * 10**decimals());
    }

    /**
     * @dev USDT typically uses 6 decimals.
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /**
     * @dev Function to mint tokens, only callable by the owner.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Overrides for GSN support (EIP-2771)

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength() internal view override(Context, ERC2771Context) returns (uint256) {
        return ERC2771Context._contextSuffixLength();
    }
}
