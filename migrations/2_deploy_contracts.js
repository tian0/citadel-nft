var Membership = artifacts.require("./Membership.sol");
const web3 = require('../node_modules/web3');

module.exports = function(deployer) {
  const charity = '0xD1953FE9BCB3Baf36b829Bd88347f87D25Eb87cA';
  const donation = web3.utils.toWei('0.1', 'ether');
  deployer.deploy(Membership, charity, donation);
};
