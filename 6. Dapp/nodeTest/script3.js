var  Web3  =  require('web3');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

provider = new HDWalletProvider(`${process.env.MNEMONIC}`, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`)
web3 = new Web3(provider);


const tx = {
  from: '0x75817fb5B74DFa5b9d5D607f70F96925D0F73654', 
  to: '0xc5750ccf56bF70bC98Dd565cee707B38F6254848', 
  value: 100000000000000000,
};

const signPromise = web3.eth.signTransaction(tx, tx.from);

signPromise.then((signedTx) => {  
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  
  
    sentTx.on("receipt", receipt => {
        console.log("super");
    });
    
    sentTx.on("error", err => {
      console.log("oopsie");
    });
    
}).catch((err) => {
    
    console.log("oupsie2");
    
  });