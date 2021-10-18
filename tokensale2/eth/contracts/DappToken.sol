pragma solidity ^0.6.0;

contract DappToken {
    string public constant name = "Dappa Token";
    string public constant symbol = "DAPPT";
    uint8 public constant decimals = 0;

    uint public totalSupply;
    mapping(address => uint256) balances;

    // mapping of approval who allows a giving address to spend from their own account.
    mapping(address => mapping(address => uint256)) allowances;

    constructor(uint _totalSupply) public {
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowances[_owner][_spender];
    }

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function approve(address _spender, uint256 value) public returns (bool success) {
        if (value <= 0 ) {
            return false;
        }

        allowances[msg.sender][_spender] = value;

        emit Approval(msg.sender, _spender, value);

        return true;
    }

    event Transfer(address _from, address _to, uint256 _val);

    // where the transaction sender would be allowed based on allowances to do transfer between accounts.
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        if ((_value <= 0) || (_value > 0 && balances[_from] < _value)) {
            return false;
        }

        // can the sender of this transaction allowed to spend this much or do this much?
        if (allowances[_from][msg.sender] < _value) return false;

        if (allowances[_from][_to] < _value) return false;

        balances[_from] -= _value;
        balances[_to] += _value;

        // reduce allowance of transaction sender.
        allowances[_from][msg.sender] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function transfer(address _to, uint256 _val) public returns (bool success) {
        if ((_val == 0) || (_val > 0 && balances[msg.sender] < _val)) {
            return false;
        }

        // reduce balance by value
        balances[msg.sender] -= _val;

        // increase to balance;
        balances[_to] += _val;

        // emit transfer event
        emit Transfer(msg.sender, _to, _val);

        return true;
    }
}