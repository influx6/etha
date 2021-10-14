pragma solidity ^0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    event KycCompletedFor(address);
    event KycRevokedFor(address);

    function kycCompleted(address _addr) public view returns (bool) {
        return allowed[_addr];
    }

    function setKycRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
        emit KycRevokedFor(_addr);
    }

    function setKycCompleted(address _addr) public onlyOwner {
        allowed[_addr] = true;
        emit KycCompletedFor(_addr);
    }

}