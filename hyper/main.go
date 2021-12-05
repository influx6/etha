package main

import (
	"github.com/hyperledger/fabric-contract-api/contractapi"
)

type Property struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Area string `json:"area"`
	OwnerName string `json:"ownerName"`
	Value int `json:"value"`
}

type PropertyContract struct {
	contractapi.Contract
}

func (p *PropertyContract) AddProperty(
	ctx contractapi.TransactionContextInterface,
	String id,
	String name,
	String area,
	String ownerName,
	int value,
) {
	var propertyJSON, err = ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("Failed to read the data from world state", err)
	}

	if propertyJSON != nil {
		return fmt.Errorf("id %s already exists", id)
	}

	var prop Property
	prop.ID = id
	prop.Name = name
	prop.Area = area
	prop.OwnerName = ownerName
	prop.Value = value

	var propertyData, marshalErr = json.Marshal(prop)
	if marshalErr != nil {
		return marshalErr
	}

	return ctx.GetStub().PutState(id, propertyData)
}
//func (p *PropertyContract) Invoke(ctx contractapi.TransactionContextInterface) {}
//func (p *PropertyContract) Delete(ctx contractapi.TransactionContextInterface) {}
//func (p *PropertyContract) Query(ctx contractapi.TransactionContextInterface) {}


func main() {
	var propContract = new(PropertyContract)
	var cc, err = contractapi.NewChainCode(propContract)
	if err != nil {
		log.Fatalf("Failed to create contract: %+s",err)
	}

	if startErr := cc.Start(); startErr != nil {
		log.Fatalf("Failed to start contract: %+s",err)
	}
}
