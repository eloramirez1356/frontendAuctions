import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ProvingProofOfWinner extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hasError: false,
            showSending: false,
            proofOfWinner: '',
        }
        this.handleProvingProofOfWinner = this.handleProvingProofOfWinner.bind(this);
        this.handleProvingProofOfWinnerChange = this.handleProvingProofOfWinnerChange.bind(this);
        }

    handleProvingProofOfWinnerChange (field){
        return (event) => {
            this.setState({
                [field]: event.target.value
            })
        }
    }


    validation(app){
        if(app.proofOfWinner.length > 0){
            return true;
        } else {
            return false;
        }
    }


    handleProvingProofOfWinner(e){
        e.preventDefault();
        const { onClose, passInfo } = this.props;
        const web3 = this.props.web3;
        const parsedAbi = JSON.parse(this.props.contractAbi);
        const auctionContract = new web3.eth.Contract(parsedAbi, this.props.contractAddress);
        console.log(this.state.proofOfWinner);
        const parsedProofOfWinner = JSON.parse(this.state.proofOfWinner); 
        //const contract = web3.eth.contract(this.props.contractAbi);
        //const contractInstance = contract.at(this.props.contractAddress);
        
        if(this.validation(this.state)){
            this.setState({showSending:true});
            (async () => {
                const accounts = await web3.eth.getAccounts();
                await auctionContract.methods.auctionEnd(parsedProofOfWinner.proof.a, parsedProofOfWinner.proof.b, parsedProofOfWinner.proof.c, parsedProofOfWinner.inputs).send({from: accounts[0], gas:3000000}, function(error, result){
                    if(!error){
                        alert("The proof is correct: " + result);

                        //console.log(auctionContract.methods.getHashesZokrates(0).call());
                    }else{
                        alert("The proof provided is incorrect: " + error);
                    }
                });
                await auctionContract.events.resultWinnerAndPosition((error, event) => {
                    if(!error){
                        console.log("winner amount is: " + event.winnerEvent + "position is: " + event.positionEvent);
                    }else{
                        console.log(error);
                    }
                });
                const winner = await auctionContract.methods.getWinner().call();
                const biggest = await auctionContract.methods.getBiggestBid().call();
                console.log(winner);
                console.log(biggest);
                passInfo(winner, biggest);
                


              })().then(onClose(true));
            
            //auctionContract.methods.bid(web3.utils.keccak256(web3.eth.abi.encodeParameters(['string', 'string', 'string'],[this.state.encryptedBid, this.state.hashZokrates1, this.state.hashZokrates2]))).send({from: accounts[0],to: this.props.contractAddress, value: 5}).then((f) => console.log(f))
            //contractInstance.bid.call()
            /*addVideo({
                title:this.state.title,
                description: this.state.description,
                url: this.state.url,
                thumbnail: `https://img.youtube.com/vi/${token}/maxresdefault.jpg`,
                embed: `https://www.youtube.com/embed/${token}`
            }).then(onClose(true));*/

        }else{
            this.setState({
                hasError:true
            })
        }
    }
    /*handleProvingProofOfWinner(e){
        e.preventDefault();
        const { onClose, passInfo } = this.props;
        const web3 = this.props.web3;
        const parsedAbi = JSON.parse(this.props.contractAbi);
        const auctionContract = new web3.eth.Contract(parsedAbi, this.props.contractAddress);
        console.log(this.state.proofOfWinner);
        const parsedProofOfWinner = JSON.parse(this.state.proofOfWinner); 
        //const contract = web3.eth.contract(this.props.contractAbi);
        //const contractInstance = contract.at(this.props.contractAddress);
        const stringHash0_0 = web3.utils.toBN(parsedProofOfWinner.inputs[0]).toString();
        const stringHash0_1 = web3.utils.toBN(parsedProofOfWinner.inputs[1]).toString();
        const stringHash1_0 = web3.utils.toBN(parsedProofOfWinner.inputs[2]).toString();
        const stringHash1_1 = web3.utils.toBN(parsedProofOfWinner.inputs[3]).toString();
        const stringHash2_0 = web3.utils.toBN(parsedProofOfWinner.inputs[4]).toString();
        const stringHash2_1 = web3.utils.toBN(parsedProofOfWinner.inputs[5]).toString();
        const stringHash3_0 = web3.utils.toBN(parsedProofOfWinner.inputs[6]).toString();
        const stringHash3_1 = web3.utils.toBN(parsedProofOfWinner.inputs[7]).toString();
        console.log(stringHash0_0);
        console.log(stringHash0_1);
        console.log(stringHash1_0);
        console.log(stringHash1_1);
        console.log(stringHash2_0);
        console.log(stringHash2_1);
        console.log(stringHash3_1);
        

        if(this.validation(this.state)){
            this.setState({showSending:true});
            (async () => {
                const accounts = await web3.eth.getAccounts();
                await auctionContract.methods.auctionEnd(parsedProofOfWinner.proof.a, parsedProofOfWinner.proof.b, parsedProofOfWinner.proof.c, parsedProofOfWinner.inputs).send({from: accounts[0], gas:3000000}, function(error, result){
                    if(!error){
                        alert("The proof is correct: " + result);

                        //console.log(auctionContract.methods.getHashesZokrates(0).call());
                    }else{
                        alert("The proof provided is incorrect: " + error);
                    }
                });
                await auctionContract.events.resultWinnerAndPosition((error, event) => {
                    if(!error){
                        console.log("winner amount is: " + event.winnerEvent + "position is: " + event.positionEvent);
                    }else{
                        console.log(error);
                    }
                const accounts = await web3.eth.getAccounts();
                var batch = web3.BatchRequest();
                batch.add(auctionContract.methods.checkingAuctioneerHashesInputs(stringHash0_0, stringHash0_1, stringHash1_0, stringHash1_1, stringHash2_0, stringHash2_1, stringHash3_0, stringHash3_1).send.request({from: accounts[0], gas:3000000}, (err, res) => {if(!err){console.log("first: " + res);}else{console.log(err);}}));
                batch.add(auctionContract.methods.auctionEnd(parsedProofOfWinner.proof.a, parsedProofOfWinner.proof.b, parsedProofOfWinner.proof.c, parsedProofOfWinner.inputs).send.request({from: accounts[0], gas:3000000}, (err, res) => {if(!err){console.log("second: " + res);
                const winner = auctionContract.methods.getWinner().call();
                const biggest = auctionContract.methods.getBiggestBid().call();
                console.log("el winner: " + winner);
                console.log("el biggest: " + biggest);
                passInfo(winner, biggest);
                onClose(true);
                }else{console.log(err);}}));
                batch.execute();
                await auctionContract.events.resultWinnerAndPosition((error, event) => {
                    if(!error){
                        console.log("winner amount is: " + event.winnerEvent + "position is: " + event.positionEvent);
                    }else{
                        console.log(error);
                    }
                });
                
                //return [correctHashes, txEndAuction];


              })().then(onClose(true));
              
            


        }else{
            this.setState({
                hasError:true
            })
        }
        }*/


    render() {
        const { showSending, proofOfWinner, hasError} = this.state;
        const {onClose} = this.props;
        return (<div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose(false)}>&times;</span>
                <h2>Placing a bid</h2>
                { showSending && (<span className="success"> Enviando... </span>)}
                { hasError && (<div className="error"> Some fields are empty or contain an wrong values. </div>)}
                <form>
                    <label>Proof generated by ZoKrates</label>
                    <input type="text" value={proofOfWinner} onChange={this.handleProvingProofOfWinnerChange("proofOfWinner")} minLength="3" maxLength="2000" required/>
                    <input type="submit" onClick={this.handleProvingProofOfWinner} value="Submit" disabled={showSending}/>
                </form>
            </div>
        </div>);
    }
}

ProvingProofOfWinner.propTypes = {
    onClose: PropTypes.func.isRequired,
    passInfo: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    contractAddress: PropTypes.string.isRequired,
    contractAbi: PropTypes.string.isRequired
};

export default ProvingProofOfWinner;