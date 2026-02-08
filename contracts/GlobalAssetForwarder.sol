// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";

/**
 * @title GlobalAssetForwarder
 * @dev EIP-2771 Forwarder for the Global Asset Simulator project.
 */
contract GlobalAssetForwarder is ERC2771Forwarder {
    constructor() ERC2771Forwarder("GlobalAssetForwarder") {}
}
