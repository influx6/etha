pragma solidity ^0.6.0;

import "./DappToken.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract TokenSale {
    uint256 public priceInWei;
    uint256 public tokensSold;
    DappToken public tokenContract;

    using SafeMath for uint256;

    address admin;

    event Sell(address _buyer, uint256 _amount);
    event SoldFor(address _buyer, uint256 _tokensSize, uint256 _forAmount);

    constructor(DappToken _tokenContract, uint256 _priceInWei) public {
        admin = msg.sender;
        priceInWei = _priceInWei;
        tokenContract = _tokenContract;
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "only the admin can perform action");
        _;
    }

    function endSale() public onlyOwner {
        address payable thisAddr = payable(address(this));
        uint256 currentBalance = tokenContract.balanceOf(thisAddr);
        require(tokenContract.transferFrom(address(this), address(tokenContract), currentBalance), "should transfer all tokens to contract");

        address payable adminAddr = payable(address(admin));
        selfdestruct(adminAddr);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        uint256 totalExpectedCost = priceInWei.mul(_numberOfTokens);
        require(msg.value == totalExpectedCost, "Should be the same as expected price in wei");

        address thisAddr = address(this);
        uint256 balanceOfSales = tokenContract.balanceOf(thisAddr);
        require(_numberOfTokens > 0, "should be greater than zero");
        require(_numberOfTokens <= balanceOfSales, "should be within available tokens remaining");

        // send tokens from token-sale to sender.
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
        emit SoldFor(msg.sender,_numberOfTokens, totalExpectedCost);
    }
}
