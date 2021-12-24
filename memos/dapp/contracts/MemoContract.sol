pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract  MemoContract {
    uint memoCount;
    address public owner;

    constructor() payable {
        console.log("Creating memo contract for address %s", msg.sender);
        owner = msg.sender;
    }

    function getMemoCount() public view returns (uint) {
        return memoCount;
    }

    function sendMemo(string memory message) public payable {
        memoCount++;
        console.log("Sending message %s with memo count %s", message, memoCount);
    }
}
