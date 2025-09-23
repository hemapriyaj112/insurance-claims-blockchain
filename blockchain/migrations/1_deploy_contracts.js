const InsuranceClaims = artifacts.require("InsuranceClaims");

module.exports = function (deployer) {
  deployer.deploy(InsuranceClaims);
};
