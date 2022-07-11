var  Web3  =  require('web3'); 

web3  =  new Web3(new  Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9f5e9c70377e43549f81007f3a964636'));

var  ethTx  = ('0x85b8dc103159d624b9a8ee257b66ff96b79f3cc33cfe75df65c0ad0d9d668296');

web3.eth.getTransaction(ethTx, function(err, result) { 

if (!err  &&  result !==  null) {

    console.log(result); // Log all the transaction info

    console.log('From Address: ' +  result.from); // Log the from address

    console.log('To Address: ' +  result.to); // Log the to address

    console.log('Ether Transacted: ' + (web3.utils.fromWei(result.value, 'ether'))); // Get the value, convert from Wei to Ether and log it

}

else {

    console.log('Error!', err); // Dump errors here

}

});