import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProvingBid extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hasError: false,
            showSending: false,
            bidHashedSent: '',
            encryptedBid: '',
            hashZokrates1: '',
            hashZokrates2: ''
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
        if(app.bidHashedSent.length > 0 && app.encryptedBid.length > 0 && app.hashZokrates1.length > 0 && app.hashZokrates2.length > 0){
            return true;
        } else {
            return false;
        }
    }

    handleProvingBid(e){
        e.preventDefault();
        const { onClose } = this.props;
        const web3 = this.props.web3;
        const parsedAbi = JSON.parse(this.props.contractAbi);
        const auctionContract = new web3.eth.Contract(parsedAbi, this.props.contractAddress);
        //const contract = web3.eth.contract(this.props.contractAbi);
        //const contractInstance = contract.at(this.props.contractAddress);
        if(this.validation(this.state)){
            this.setState({showSending:true});
            (async () => {
                console.log("Justo antes de bid prover");
                const accounts = await web3.eth.getAccounts();
                auctionContract.methods.bidProver(this.state.bidHashedSent, this.state.encryptedBid, this.state.hashZokrates1, this.state.hashZokrates2).send({from: accounts[0], gas:3000000}, function(error, result){
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
        const { showSending, bidHashedSent, encryptedBid, hashZokrates1, hashZokrates2, hasError} = this.state;
        const {onClose} = this.props;
        return (<div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose(false)}>&times;</span>
                <h2>Placing a bid</h2>
                { showSending && (<span className="success"> Enviando... </span>)}
                { hasError && (<div className="error"> Some fields are empty or contain an wrong values. </div>)}
                <form>
                    <label>Your hashed bid</label>
                    <input type="text" value={bidHashedSent} onChange={this.handleProvingChange("bidHashedSent")} minLength="3" maxLength="200" required/>
                    <label>Encrypted bid with the public key of the Auctioneer</label>
                    <input type="text" value={encryptedBid} onChange={this.handleProvingChange("encryptedBid")} minLength="3" maxLength="200" required/>
                    <label>Hash obtained from ZoKrates (part 1)</label>
                    <input type="text" value={hashZokrates1} onChange={this.handleProvingChange("hashZokrates1")} minLength="3" maxLength="200" required/>
                    <label>Hash obtained from ZoKrates (part 2)</label>
                    <input type="text" value={hashZokrates2} onChange={this.handleProvingChange("hashZokrates2")} minLength="3" maxLength="200" required/>
                    <input type="submit" onClick={this.handleProvingBid} value="Submit" disabled={showSending}/>
                </form>
            </div>
        </div>);
    }
}

ProvingBid.propTypes = {
    onClose: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    contractAddress: PropTypes.string.isRequired,
    contractAbi: PropTypes.string.isRequired
};

export default ProvingBid;