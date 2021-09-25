pragma solidity ^0.8;

import "./allowance.sol";

contract SimpleWallet is Allowance {
    event moneySent(address indexed _from, address indexed _beneficiary, uint amount);
    event moneyReceived(address indexed _from, uint amount);

    function renounceOwnership() public onlyOwner {
        revert("Cant renounce ownership");
    }

    function withdrawMoney(address payable _to, uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, "There are not enough funds stored in the smart contract");
        if (!isOwner()) {
            reduceAllowance(_to, _amount);
        }
        emit moneySent(msg.sender, _to, _amount);
        _to.transfer(_amount);
    }

    // fallback function -> by default will send all ether to the
    // internal contract address.
    // Remember every contract gets an explicit internal chain address.
    fallback() external payable {

    }

    receive() external payable {
        emit moneyReceived(msg.sender, msg.value);
    }
}