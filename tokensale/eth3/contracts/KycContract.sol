pragma solidity ^0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    function kycCompleted(address _addr) public view returns (bool) {
        return allowed[_addr];
    }

    function setKycRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function setKycCompleted(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }

}