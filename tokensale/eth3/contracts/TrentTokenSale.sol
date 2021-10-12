pragma solidity ^0.6.0;

import "./CrowdSale.sol";

contract TrentTokenSale is CrowdSale {
    constructor(uint256 rate, address payable wallet, IERC20 token) CrowdSale(rate, wallet, token) public {

    }
}
