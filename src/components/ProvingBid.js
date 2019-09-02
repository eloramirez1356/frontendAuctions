import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProvingBid extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hasError: false,
            showSending: false,
            proofOfBid: '',
        }
        this.handleProvingBid = this.handleProvingBid.bind(this);
        this.handleProvingChange = this.handleProvingChange.bind(this);
        }

    handleProvingChange (field){
        return (event) => {
            this.setState({
                [field]: event.target.value
            })
        }
    }


    validation(app){
        const parsedProofOfBid = JSON.parse(app.proofOfBid);
        if(parsedProofOfBid.bidHashedSent.length > 0 && parsedProofOfBid.encryptedBid.length > 0 && parsedProofOfBid.hashZokrates1.length > 0 && parsedProofOfBid.hashZokrates2.length > 0){
            return true;
        } else {
            return false;
        }
    }

    handleProvingBid(e){
        e.preventDefault();
        const { onClose, web3, contract, account } = this.props;
        const { proofOfBid } = this.state;
        const auctionContract = contract;
        const parsedProofOfBid = JSON.parse(proofOfBid);
        var encryptedBidBytes32 = web3.utils.padLeft((web3.utils.toHex(web3.utils.toBN(parsedProofOfBid.encryptedBid))),64);
        var hashZokrates1Bytes32 = web3.utils.padLeft((web3.utils.toHex(web3.utils.toBN(parsedProofOfBid.hashZokrates1))),64);
        var hashZokrates2Bytes32 = web3.utils.padLeft((web3.utils.toHex(web3.utils.toBN(parsedProofOfBid.hashZokrates2))),64);
        var bidHashedSentBytes32 = web3.utils.toHex(parsedProofOfBid.bidHashedSent);
        //const contract = web3.eth.contract(this.props.contractAbi);
        //const contractInstance = contract.at(this.props.contractAddress);
        if(this.validation(this.state)){
            this.setState({showSending:true});
            (async () => {
                console.log("Justo antes de bid prover");
                const accounts = await web3.eth.getAccounts();
                auctionContract.methods.bidProver(bidHashedSentBytes32, encryptedBidBytes32, hashZokrates1Bytes32, hashZokrates2Bytes32).send({from: accounts[0], gas:3000000}, function(error, result){
                    if(!error){
                        alert("You have proved your transaction successfully and you participate in the bid " + result);
                        console.log(auctionContract.methods.getHashesZokrates(0).call());

                    }else{
                        alert("You have not proved your transaction successfully and you do not participate in the bid because of the following error: " + error);
                    }
                });
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


    render() {
        const { showSending, hasError, proofOfBid} = this.state;
        const {onClose} = this.props;
        return (<div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose(false)}>&times;</span>
                <h2>Proving you have bid</h2>
                { showSending && (<span className="success"> Enviando... </span>)}
                { hasError && (<div className="error"> Some fields are empty or contain an wrong values. </div>)}
                <form>
                    <label>Information for proving your bid</label>
                    <input type="text" value={proofOfBid} onChange={this.handleProvingChange("proofOfBid")} minLength="3" maxLength="2000" required/>
                    <input type="submit" onClick={this.handleProvingBid} value="Submit" disabled={showSending}/>
                </form>
            </div>
        </div>);
    }
}

ProvingBid.propTypes = {
    onClose: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    contract: PropTypes.object.isRequired, 
    account: PropTypes.string.isRequired,
};

export default ProvingBid;