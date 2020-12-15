import React, { Component } from "react";
import MembershipContract from "./contracts/Membership.json";
import getWeb3 from "./getWeb3";
import makeBlockie from "ethereum-blockies-base64";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOwner: false,
      isMember: false,
      tokenID: null,
      membersNumber: null,
      isCharity: false,
      donationBalance: null,
      donation: null,
      input: "",
      web3: null,
      contract: null,
      contractAddress: null,
      account: null,
      charity: null,
      network: null,
      balance: null,
    };
  }

  instantiateContract() {
    const contract = require("@truffle/contract");
    const Membership = contract(MembershipContract);
    Membership.setProvider(this.state.web3.currentProvider);
    //declaring this for later so we can chain functions on Membership
    var MembershipInstance;
    Membership.deployed().then((instance) => {
      MembershipInstance = instance;
      return instance;
    });
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balance = web3.utils.fromWei(balanceWei, "ether");

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MembershipContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MembershipContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed interacting with the contract's methods.
      this.setState(
        {
          web3,
          account: accounts[0],
          contract: instance,
          network: networkId,
          balance: balance,
        },
        this.runConnect
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runConnect = async () => {
    this.instantiateContract();
    const { account, contract } = this.state;
    const contract_address = contract._address;
    const donation = await contract.methods.donation().call();
    const charity = await contract.methods.charity().call();
    this.setState({ contractAddress: contract_address, donation: donation, charity: charity });

    const contractOwner = await contract.methods.owner().call();
    if (contractOwner === account) {
      this.setState({ isOwner: true });
    }

    const donationBalance = await contract.methods.donationBalance().call();
    if (charity == account) {
      this.setState({ isCharity: true, donationBalance: donationBalance })
    }

    const memberBalance = await contract.methods.balanceOf(account).call();
    const id = await contract.methods.tokenId(account).call();
    const count = await contract.methods.getMembersLength().call();
    if (parseInt(memberBalance) > 0) {
      this.setState({ isMember: true, tokenID: id, membersNumber: count });
    }
  };

  handleJoin(event) {
    this.instantiateContract();
    const { account, contract, donation } = this.state;
    contract.methods
      .newMember()
      .send({ from: account, value: donation })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleAddressInput = (event) => {
    this.setState({ input: event.target.value });
  }

  handleGift(event) {
    this.instantiateContract();
    const { account, contract, input, donation } = this.state;
    contract.methods
      .giftMembership(input)
      .send({ from: account, value: donation })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleRemove(event) {
    this.instantiateContract();
    const { account, contract, input } = this.state;
    contract.methods
      .removeMember(input)
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handlePause(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .pause()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleUnpause(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .unpause()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleKill(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .kill()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleWithdraw(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .withdraw()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  render() {
    if (!this.state.web3)
      return (
        <div className="noWeb3">
          Loading Web3, accounts, and contract...
          <p>You may need to install Metamask:</p>
          <a href="https://metamask.io/download.html">
            Metamask Browser Extension
          </a>
        </div>
      );
    else if (this.state.isOwner)
      return (
        <div className="isOwner">
          <div className="row">
            <h2>Your account owns this Membership contract!</h2>
            <p>Membership Contract Address: {this.state.contractAddress}</p>
            <p>There are a total of {this.state.membersNumber} members</p>
            <p>Charity Name: Rinkeby Demo</p>
            <p>Charity Wallet: {this.state.charity}</p>
            <img src={makeBlockie(this.state.contractAddress)} />
            <p>Your Wallet: {this.state.account}</p>
            <p>Your ETH Balance: {this.state.balance} ETH</p>
            {/* <p>Your Membership tokenId is {this.state.tokenID} </p> */}
            <h3>Member Management</h3>
            <p>Enter an Ethereum Address:</p>
            <input
              type="text"
              size="50"
              id="address"
              onChange={this.handleAddressInput}
            />
            <br></br>
            <button onClick={this.handleGift.bind(this)}>
              Gift Membership
            </button>
            <button onClick={this.handleRemove.bind(this)}>
              Remove Member
            </button>
            <br></br>
            <div className="management">
              <h3>Contract Management</h3>
              <button onClick={this.handlePause.bind(this)}>
                Pause Contract
              </button>
              <button onClick={this.handleUnpause.bind(this)}>
                Unpause Contract
              </button>
              <br></br>
              <br></br>
              <button onClick={this.handleKill.bind(this)}>
                Kill Contract
              </button>
            </div>
          </div>
        </div>
      );
    else if (this.state.isMember)
      return (
        <div className="App">
          <div className="row">
            <p>Membership Contract: {this.state.contractAddress}</p>
            <p>There are a total of {this.state.membersNumber} members</p>
            <img src={makeBlockie(this.state.contractAddress)} />
            <p>Thank you for your donation to [CharityName]</p>
            <p>Charity Wallet: {this.state.charity}</p>
            <p>Your Wallet: {this.state.account}</p>
            <p>Your ETH Balance: {this.state.balance} ETH</p>
            <p>Your Membership tokenId is {this.state.tokenID} </p>
            <p>
              Network ID:{" "}
              {this.state.network ? `${this.state.network}` : "No connection"}
            </p>
          </div>
          <div className="row">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h3>Gift a Membership!</h3>
                <p>Enter an Ethereum Address:</p>
                <input
                  type="text" size="50" id="address" onChange=
                  {this.handleAddressInput}/>
                <button onClick={this.handleGift.bind(this)}>
                  Gift Membership
                </button>
              </div>
              <br></br>
              <img src='http://www.afrostateofmind.com/wp-content/uploads/2015/08/Members-only.png'
              height='300' width='450'/>
            </div>
          </div>
        </div>
      );
      else if (this.state.isCharity)
      return (
        <div className="App">
          <div className="row">
            <p>Membership Contract Address: {this.state.contractAddress}</p>
            <p>There are a total of {this.state.membersNumber} members</p>
            <img src={makeBlockie(this.state.contractAddress)}/>
            <p>Welcome [CharityName]!</p>
            <p>Your Charity's Wallet: {this.state.charity}</p>
            <p>Your ETH Balance: {this.state.balance} ETH</p>
            <p>
              Network ID:{" "}
              {this.state.network ? `${this.state.network}` : "No connection"}
            </p>
            <p>Charity Donations balance (available to withdraw): {this.state.donationBalance} Wei</p>
            <button onClick={this.handleWithdraw.bind(this)}>
                  Withdraw Donations
                </button>
          </div>
        </div>
      )
    else if (!this.state.isMember)
      return (
        <div className="notMember">
          You are not a Member yet
          <br></br>
          <button onClick={this.handleJoin.bind(this)}>
            Click to become a Member!
          </button>
        </div>
      );
  }
}

export default App;
