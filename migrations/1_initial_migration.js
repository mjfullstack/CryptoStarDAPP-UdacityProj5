// var Migrations = artifacts.require('./Migrations.sol')
const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
