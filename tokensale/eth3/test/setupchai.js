const chai = require("chai");

const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

const chaiPromises = require("chai-as-promised");
chai.use(chaiPromises);


module.exports = chai;