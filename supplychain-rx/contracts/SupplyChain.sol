pragma solidity ^0.8.0;

contract Ownable {
    address payable owner;

    constructor() public {
        owner = payable(address(msg.sender));
    }

    modifier onlyOwner() {
        require(isOwner(), "You are not the owner");
        _;
    }

    function isOwner() public view returns(bool) {
        return msg.sender == owner;
    }
}

contract PayContract {
    uint public priceInWei;
    uint public pricePaid;
    uint public index;
    SupplyChain parent;

    constructor(SupplyChain _parent, uint _priceInWei, uint _index) {
        index = _index;
        parent = _parent;
        priceInWei = _priceInWei;
    }

    receive() external payable {
        require(pricePaid == 0, "Item is paid already");
        require(msg.value == priceInWei, "Only full payment allowed");
        pricePaid += msg.value;
        (bool success, ) = address(parent).call{value: msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "Failed transaction: was not successful, cancelling");
    }

    fallback() external {

    }
}

contract SupplyChain is Ownable {
    enum SupplyChainState{Created, Paid, Delivered}
    event SupplyChainStep(uint index, SupplyChainState step, address payableAddress);

    struct Item {
        string identifier;
        uint itemPrice;
        PayContract payContract;
        SupplyChainState state;
    }

    uint itemIndex;
    mapping(uint => Item) public items;

    function createItem(string memory _identifier, uint _itemPrice) public onlyOwner {
        PayContract payer = new PayContract(this, _itemPrice, itemIndex);
        items[itemIndex].payContract = payer;
        items[itemIndex].identifier = _identifier;
        items[itemIndex].itemPrice = _itemPrice;
        items[itemIndex].state = SupplyChainState.Created;
        emit SupplyChainStep(itemIndex, SupplyChainState.Created, address(payer));
        itemIndex++;
    }

    function triggerPayment(uint index) public payable {
        require(items[index].itemPrice == msg.value, "Only full payment accepted");
        require(items[index].state == SupplyChainState.Created, "Item is further in the chain");
        items[index].state = SupplyChainState.Paid;
        emit SupplyChainStep(itemIndex, SupplyChainState.Paid, address(items[index].payContract));
    }

    function triggerDelivery(uint index) public onlyOwner {
        require(items[index].state == SupplyChainState.Paid, "Item must be in paid state");
        items[index].state = SupplyChainState.Delivered;
        emit SupplyChainStep(index, SupplyChainState.Delivered, address(items[index].payContract));
    }
}
