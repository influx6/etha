pragma solidity ^0.6.0;

import "./CrowdSale.sol";
import "./KycContract.sol";

contract TrentTokenSale is CrowdSale {
    KycContract kyc;

    constructor(uint256 rate, address payable wallet, IERC20 token, KycContract _kyc) CrowdSale(rate, wallet, token) public {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 amount) internal view override {
        super._preValidatePurchase(beneficiary, amount);
        require(kyc.kycCompleted(msg.sender), "Beneficiary has not processed Kyc");
    }
}
