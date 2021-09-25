pragma solidity ^0.8;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

contract Allowance is Ownable{
    using SafeMath for uint;

    event AllowanceChanged(address indexed _forWho, address indexed _fromWhom,  uint _oldAmount, uint _newAmount);

    mapping(address => uint) public allowance;

    function isOwner() public view returns (bool) {
        return msg.sender == owner();
    }

    modifier allowanceAvailable(uint amount) {
        require(isOwner() || allowance[msg.sender] > amount, "You dont have enough amount");
        _;
    }

    function reduceAllowance(address _to, uint _amount) internal {
        old_allowance = allowance[_to];
        allowance[_to] = allowance[_to].sub(_amount);
        emit AllowanceChanged(_who, msg.sender, old_allowance, allowance[_who]);
    }

    function addAllowance(address _who, uint amountAllowed) public allowanceAvailable(amountAllowed) {
        emit AllowanceChanged(_who, msg.sender, allowance[_who], amountAllowed);
        allowance[_who] = amountAllowed;
    }

    function availableAllowance() public view returns (uint) {
        return allowance[msg.sender];
    }

    function availableAllowanceFor(address _who) public view returns (uint) {
        return allowance[_who];
    }

}

