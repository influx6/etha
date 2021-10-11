pragma solidity ^0.6.0;

import "./CrowdSales.sol";

contract TrentTokenSale is CrowdSale {
    constructor(uint256 rate, address payable wallet, IERC20 token){
        super(rate, wallet, token);
    }
}
