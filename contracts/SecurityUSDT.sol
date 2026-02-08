// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/**
 * @title SecurityUSDT
 * @dev ERC20 token with EIP-2612 permit and GSN support (EIP-2771).
 * This allows for gasless transactions where a relayer pays the gas fees.
 */
contract SecurityUSDT is ERC20, ERC20Permit, Ownable, ERC2771Context {

    constructor(address trustedForwarder)
        ERC20("Security USDT", "sUSDT")
        ERC20Permit("Security USDT")
        Ownable(msg.sender)
        ERC2771Context(trustedForwarder)
    {
        // Mint initial supply to the deployer
        _mint(msg.sender, 1000000 * 10**decimals());
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
