# CryptoStarDAPP-UdacityProj5
## Udacity Project 5 Distributed App for Star Notary Service
###  Decentralized Star Notary Service - From ZIP Download Starter Code
###  Versions
    $ truffle version
    Truffle v5.0.10 (core: 5.0.10)
    Solidity - 0.5.6 (solc-js)
    Node v10.15.0
    Web3.js v1.0.0-beta.37

    "openzeppelin-solidity": "^2.1.2",
    "truffle-hdwallet-provider": "^1.0.6"

## Rinkeby Network Token Details:
###Address 0xb77988cd20700adff9b43fc3516bd91489a8445f
### Token Name: CryptoStarToken
### Token Symbol: CST

##Notes:
1. NO package.json can be provided for the root directory despite numeruous attempts to do so.
  a. Submitting per AlvaroP's (Mentor) recommendation to NOT submit a package.json / package-lock.json
2. Attempts to create a working package.json included:
  a. Running npm init on the ZIP download provided yielded a notably different node_modules result
  b. Attempts to build with the GITHUB version of the starter code / package.json would not allow for intercting with the network correctly
  c. Attempts were made with     "truffle-hdwallet-provider": "^1.0.0-web3one.5", but could not arrive at a working combination of component versions to allow for creating and looking-up a star on the web-app page.
3. THEREFORE: Submitted Project Code must be executed in an environment similar to the ZIP download node_modules configuration
4. Encountered many problems from Infura's change in token ID's / timeframe of genration regarding "Exceeded legacy access transaction rate"