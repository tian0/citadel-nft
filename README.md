# Citadel NFT

A simple Ethereum-based decentralized application (dapp) to create and obtain non-fungible membership tokens. Based on the [ERC-721](https://erc721.org) standard, these tokens are clear of user approvals making them nontransferable while also avoiding re-sale in secondary markets. Holding them in an ethereum wallet will grant access to the content enabled for token holders by the Citadel contract owner in their front-end and future Internet of Things integrations.

---

![Citadel NFT]


## Prerequisites

* **Node** - v12.x.x (preferrably v12.18.3 for long term support)
* **npm** - v6.x.x (preferrably v6.14.8)

## Running Locally

Clone this repo to your local machine and install the dependencies as follows:

```bash
git clone https://github.com/tian0/citadel-nft.git
cd citadel-nft
npm install
```

A contract deployment instance is available on Ethereum's Rinkeby testnet, at the following address: 
`0x9333F09Df22efEb5B4ad87604528D267A3e3d9D5`

To deploy your own Citadel contract instance on Rinkeby, first paste your own INFURA_PROJECT_ID and contract owner wallet MNEMONIC in the .env file, and in the terminal run:
```bash
truffle compile
truffle migrate --network rinkeby
```

To deploy locally, first install and run an Ethereum development testnet using [Ganache](https://www.trufflesuite.com/ganache):

```bash
npm install -g ganache-cli
ganache-cli
```

After ganache launches, run the following to compile and deploy the Membership contract:

```bash
truffle compile
truffle migrate
```

Finally, install the client dependencies and serve the application in the development environment via:

```bash
cd client
npm install
npm run start
```

With Metamask installed and connected to Rinkeby, once whitelisted you can join an existing Citadel contract on Rinkeby provided at `0x9333F09Df22efEb5B4ad87604528D267A3e3d9D5`

The member dashboard will allow you to see:
1. Citadel Contract Address & Citadel Name
2. Citadel Contract Owner's Address
3. Citadel Reserve Currency
4. Your ETH Wallet
5. Your Citadel NFT tokenId
6. The total number of Members
7. The Network ID (4 is Rinkeby)


If you deploy your own Membership contract instance, the Owner dashboard will allow you to see:
1. Citadel Contract Address & Citadel Name
2. Citadel Contract Owner's Address
3. Citadel Reserve Currency
4. The total number of Members
5. Your ETH Wallet
6. Citadel Reserve Currency Balance (available for you to withdraw)
7. Gas spent on Whitelisting Members
8. Member Management Panel
9. Contract Management Panel
10. Members List 

Only whitelisted addresses will be allowed to contribute and have the Citadel NFT minted to their address. Owners can withdraw the Citadel's reserve currency balance by clicking the [Withdraw-Reserves] button. Owners can whitelist or remove addresses by pasting one or several comma-separated addresses in the Member Management section and clicking the [Whitelist] or [Remove] buttons. The Contract Management Panel allows the owner to [Pause], [Unpause], and [Kill] the contract.

## Built With

* [Truffle](https://www.trufflesuite.com/boxes/react) - Truffle React Box
* [Solidity](https://solidity.readthedocs.io/en/v0.5.3/) - Ethereum's smart contract programming language
* [React.js](https://reactjs.org/) - Javascript framework used
* [web3.js](https://github.com/ethereum/web3.js/) - Javascript library used to interact with the Ethereum blockchain
