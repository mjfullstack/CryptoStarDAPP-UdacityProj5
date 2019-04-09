import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    console.log("Hello from ./app/SRC/index.js: NAME: ", name, "; ID: ", id);
    console.log("SRC account: ", this.account);
    console.log("THIS createStar: ", this.createStar);
    console.log("destructured createStar: ", createStar);
    await createStar(name, id).send({from: this.account});
    console.log("Afer await createStar...");
    App.setStatus("New Star Owner is " + this.account + ".");
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function (){
    const { lookUptokenIdToStarInfo } = this.meta.methods;
    const lookid = document.getElementById("lookid").value;
    console.log("Hello from ./app/SRC/index.js: ID: ", lookid);
    let foundStar = await lookUptokenIdToStarInfo(lookid);
    App.setStatus("Found Star NAME is --> " + foundStar + " <--.");
    console.log("LOOKUP: lookid: ", lookid, "; foundStar: ", foundStar);
  }

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts

  // From https://github.com/truffle-box/react-auth-box/issues/6 
  // window.addEventListener('load', function(dispatch) {
  //     var results
  
  //     // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  //     if (typeof window.web3 !== 'undefined') {
  //       // Use Mist/MetaMask's provider.
  //       results = {
  //         web3Instance: new Web3(window.web3.currentProvider)
  //       }
  //       console.log('Injected web3 detected.');
  //       resolve(store.dispatch(web3Initialized(results)))
  
    } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});
