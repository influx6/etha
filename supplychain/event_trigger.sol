pragma solidity ^0.8.0;

contract Ownable {
    address payable owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(isOwner(), "You are not the owner");
    }

    function isOwner() public view returns(bool) {
        return msg.sender == owner;
    }
}

contract PayContract {
    uint public priceInWei;
    uint public pricePaid;
    uint public index;
    ItemManager parent;

    constructor(ItemManager parent, uint priceInWei, uint index) {
        index = index;
        pricePaid = 0;
        parent = parent;
        priceInWei = priceInWei;
    }

    receive() external payable {
        require(pricePaid == 0, "Item is paid already");
        require(msg.value == priceInWei, "Only full payment allowed");
        pricePaid += msg.value;
        (bool success, ) = address(parent).call.value(msg.value)(abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "Failed transaction: was not successful, cancelling");
    }

    fallback() external {

    }
}

contract ItemManager is Ownable {
    enum SupplyChainState{Created, Paid, Delivered}
    event SupplyChainStep(uint index, uint step, address payableAddress);

    struct Item {
        PayContract payable;
        string identifier;
        string itemPrice;
        ItemManager.SupplyChainState state;
    }

    uint itemIndex;
    mapping(uint => Item) public items;

    function createItem(string memory _identifier, uint _itemPrice) public onlyOwner {
        PayContract payer = new PayContract(this, _itemPrice, itemIndex);
        items[itemIndex].payable = payer;
        items[itemIndex].identifier = _identifier;
        items[itemIndex].itemPrice = _itemPrice;
        items[itemIndex].state = SupplyChainState.Created;
        emit SupplyChainStep(itemIndex, SupplyChainStep.Created, address(payer));
        itemIndex++;
    }

    function triggerPayment(uint index) public payable {
        require(index >= items.length, "index is out of range");
        require(items[index].itemPrice == msg.value, "Only full payment accepted");
        require(items[index].state == SupplyChainState.Created, "Item is further in the chain");
        items[index].state = SupplyChainState.Paid;
        emit SupplyChainStep(itemIndex, SupplyChainStep.Paid, address(items[index].payable));
    }

    function triggerDelivery(uint index) public onlyOwner {
        require(index >= items.length, "index is out of range");
        require(items[index].state == SupplyChainState.Paid, "Item must be in paid state");
        items[index].state = SupplyChainState.Delivered;
        emit SupplyChainStep(index, SupplyChainStep.Delivered, address(items[index].payable));
    }
}
