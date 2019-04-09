const StarNotary = artifacts.require('./starNotary.sol')

var accounts;
var owner;

  contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
  });

  it('can Create a Star', async() => {
    let tokenId = 770001;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome 770001 Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome 770001 Star!')
  }).timeout(15000);;

  it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 770002;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('Awesome 770002 Star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
  }).timeout(15000);;

  it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 770003;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome 770003 star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    // assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
  }).timeout(15000);;

  it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 770004;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome 770004 star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
  }).timeout(15000);;

  it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 770005;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome 770005 star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
    // assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
  }).timeout(15000);;

  
////////////////////////////////////////////////
// Implement Task 2 Add supporting unit tests //
////////////////////////////////////////////////
// Write Tests for:
// 1) The token name and token symbol are added properly.
// 2) 2 users can exchange their stars.
// 3) Stars Tokens can be transferred from one address to another.
// 4) Use lookUptokenIdToStarInfo to get star name

it('can add the star name and star symbol properly', async() => {
  // 1. create a Star with different tokenId
  let tokenId = 770006;
  let instance = await StarNotary.deployed();
  await instance.createStar('Awesome 770006 Star!', tokenId, {from: accounts[3]})
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome 770006 Star!')
  // 2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
  let testTokenName = "CryptoStarToken";
  let testTokenSymbol = "CST";
  let rtndName = await instance.tokenName.call();
  let rtndSymbol = await instance.tokenSymbol.call();
  assert.equal(await rtndName, testTokenName);
  assert.equal(await rtndSymbol, testTokenSymbol);
  // console.log( "ADD: testTokenName: ", testTokenName, "; rtndName: ", rtndName);
  // console.log( "ADD: testTokenSymbol: ", testTokenSymbol, "; rtndSymbol: ", rtndSymbol);
}).timeout(15000);;

it('lets 2 users exchange stars', async() => {
  // 1. create 2 Stars with different tokenIds
  let tokenId_1 = 770009;
  let instance = await StarNotary.deployed();
  await instance.createStar('Awesome 770009 Star!', tokenId_1, {from: accounts[6]})
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId_1), 'Awesome 770009 Star!')
  let owner_1 = await instance.ownerOf.call(tokenId_1);
  let tokenId_2 = 770010;
  await instance.createStar('Awesome 770010 Star!', tokenId_2, {from: accounts[7]})
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId_2), 'Awesome 770010 Star!')
  let owner_2 = await instance.ownerOf.call(tokenId_2);
  // console.log("BEFORE EXCHANGE: owner_1: ", owner_1, "; owner_2: ", owner_2);
  // 2. Call the exchangeStars functions implemented in the Smart Contract
  let testMsgSender = await instance.exchangeStars( tokenId_1, tokenId_2, {from: owner_1});
  // console.log("AFTER EXCHANGE: testMsgSender:", testMsgSender);
  // 3. Verify that the owners changed
  let owner_1_nowOwnsId2 = await instance.ownerOf.call(tokenId_2);
  let owner_2_nowOwnsId1 = await instance.ownerOf.call(tokenId_1);
  // console.log("AFTER EXCHANGE: owner_1_nowOwnsId2: ", owner_1_nowOwnsId2, "; owner_1: ", owner_1)
  // console.log("AFTER EXCHANGE: owner_2_nowOwnsId1: ", owner_2_nowOwnsId1, "; owner_2: ", owner_2)
  assert.equal(owner_1_nowOwnsId2, accounts[6] );
  assert.equal(owner_2_nowOwnsId1, accounts[7] );
}).timeout(15000);;

it('lets a user transfer a star', async() => {
  // 1. create a Star with different tokenId
  let tokenId = 770007;
  let instance = await StarNotary.deployed();
  await instance.createStar('Awesome 770007 Star!', tokenId, {from: accounts[4]})
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome 770007 Star!');
  // 2. use the transferStar function implemented in the Smart Contract
  await instance.transferStar( accounts[5], tokenId, {from: accounts[4]} );
  newOwner = await instance.ownerOf.call(tokenId);
  // 3. Verify the star owner changed.
  let returnedStarStructName = await instance.lookUptokenIdToStarInfo(tokenId)
  assert.equal(await returnedStarStructName, 'Awesome 770007 Star!');
  // console.log("TRANSFER: returnedStarStructName: ", returnedStarStructName, '; Expected: Awesome 770007 Star!');
  // console.log("TRANSFER: newOwner: ", newOwner);
  assert.equal (newOwner, accounts[5] );
}).timeout(15000);;

it('lookUptokenIdToStarInfo test', async() => {
  // 1. create a Star with different tokenId
  let tokenId = 770008;
  let instance = await StarNotary.deployed();
  await instance.createStar('Awesome 770008 Star!', tokenId, {from: accounts[0]})
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome 770008 Star!')
  // 2. Call your method lookUptokenIdToStarInfo
  let returnedStarStructName = await instance.lookUptokenIdToStarInfo(770008)
  // 3. Verify if you Star name is the same
  assert.equal(await returnedStarStructName, 'Awesome 770008 Star!');
  // console.log("LOOKUP: returnedStarStructName: ", returnedStarStructName, '; Expected: Awesome 770008 Star!');
}).timeout(15000);;


