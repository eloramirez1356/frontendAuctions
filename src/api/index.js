const FAKE_DELAY = 2000;
const FAKE_DATA = [
	{	
		id:0,
		title:'Gryffindor Scarf used by Harry Potter',
		description: 'Scarf used by Harry Potter during his first Quidditch match',
		biddingPeriod:'August 5th 2019 to August 25th 2019',
		provingPeriod:'August 26th 2019 to August 31st 2019',
		contractAddress: '0xb55C0F41E6C8E385B83D85cf5dd98E0E238DE045',
		auctioneer: '0x5E905cC01f3caFE8DE57df119de0B3f9d66395D2',
		abi:'[{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"getBidAmounts","outputs":[{"name":"encryptedAmount","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"biggestBid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"expectedHashes","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"idAuction","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"getBids","outputs":[{"name":"position","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bidHashedSent","type":"bytes32"},{"name":"encryptedBid","type":"string"},{"name":"hashZokrates1","type":"string"},{"name":"hashZokrates2","type":"string"}],"name":"bidProver","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bids","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"paymentOperations","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"auctioneer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"isCorrect","type":"bool"}],"name":"setExpectedHashes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"auctionStartingDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"signalForBid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"positionWinnerBid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"auctionEnded","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getWinner","outputs":[{"name":"winner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"hashedEncryptedBid","type":"bytes32"}],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"provingBidsEndingDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bidAmounts","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"winnerObtained","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"verifierContractZoKrates","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"auctionEndingDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[14]"}],"name":"auctionEnd","outputs":[{"name":"position","type":"uint256"},{"name":"highestBid","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"winner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"hashZokratesBids","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getBiggestBid","outputs":[{"name":"winnerBid","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"getHashesZokrates","outputs":[{"name":"hashZok1","type":"string"},{"name":"hashZok2","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numberOfBidders","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"provingBidsStartingDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hash0_0","type":"string"},{"name":"hash0_1","type":"string"},{"name":"hash1_0","type":"string"},{"name":"hash1_1","type":"string"},{"name":"hash2_0","type":"string"},{"name":"hash2_1","type":"string"},{"name":"hash3_0","type":"string"},{"name":"hash3_1","type":"string"}],"name":"checkingAuctioneerHashesInputs","outputs":[{"name":"correctHashes","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"encrypted","type":"string"},{"name":"hashZokrates1","type":"string"},{"name":"hashZokrates2","type":"string"}],"name":"keccak256Hash","outputs":[{"name":"hashSolidity","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"inputs":[{"name":"_auctionStartingDate","type":"uint256"},{"name":"_auctionEndingDate","type":"uint256"},{"name":"_signalForBid","type":"uint256"},{"name":"_idAuction","type":"uint256"},{"name":"_numberOfBidders","type":"uint256"},{"name":"_beneficiary","type":"address"},{"name":"_auctioneer","type":"address"},{"name":"_verifierContractAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winnerEvent","type":"uint256"},{"indexed":false,"name":"positionEvent","type":"uint256"}],"name":"resultWinnerAndPosition","type":"event"}]',
		image:'data:image/jpeg;base64,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',
	}
]; 

export const addAuction = (newAuction) => new Promise((resolve, reject) => {	
	setTimeout(() => { 
		newAuction.id = FAKE_DATA.length + 1;
		FAKE_DATA.push(newAuction);
		return resolve({ok:1});
	},FAKE_DELAY);
});

export const addWinner = (winnerAddress) => new Promise((resolve, reject) => {	
	setTimeout(() => { 
		FAKE_DATA[0].winner = winnerAddress;
		return resolve({ok:1});
	},FAKE_DELAY);
});
 
export const getAuctions = () => new Promise((resolve, reject) => {	
	setTimeout(() => { 
		return resolve(FAKE_DATA);
	},FAKE_DELAY);
});

// Return a description from server
const getDescription = async () => {
	try{
		const resp = await fetch('https://baconipsum.com/api/?type=all-meat&paras=3&start-with-lorem=1');
		return resp.json();
	}catch(error){
		throw error;
	}
}

export const getAuctionDetail = ({idAuction}) => new Promise((resolve, reject) => {	
	setTimeout(() => { 
		const auction = FAKE_DATA.find((el) => parseInt(el.id) === parseInt(idAuction));
		// Something goes wrong
		if(!auction) return reject({message:"No se ha encontrado la subasta ;("});
		// All is ok
		if(auction.description) return resolve(auction);
		//In case video don't have text description
		return getDescription().then(description => {
			auction.description = description.join();
			return resolve(auction);
		});
	},FAKE_DELAY);
});