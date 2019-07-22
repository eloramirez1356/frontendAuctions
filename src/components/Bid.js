import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Bid extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hasError: false,
            showSending: false,
            encryptedBid: '',
            hashZokrates1: '',
            hashZokrates2: ''
        }
        this.handleBid = this.handleBid.bind(this);
        this.handleChange = this.handleChange.bind(this);
        }

    handleChange (field){
        return (event) => {
            this.setState({
                [field]: event.target.value
            })
        }
    }


    validation(app){
        if(app.encryptedBid.length > 0 && app.hashZokrates1.length > 0 && app.hashZokrates2.length > 0){
            return true;
        } else {
            return false;
        }
    }

    handleBid(e){
        e.preventDefault();
        const { onClose } = this.props;
        const web3 = this.props.web3;
        const parsedAbi = JSON.parse(this.props.contractAbi);
        const auctionContract = new web3.eth.Contract(parsedAbi, this.props.contractAddress);
        if(this.validation(this.state)){
            this.setState({showSending:true});
            //console.log(web3.utils.randomHex(32));
            console.log(web3.utils.keccak256(web3.eth.abi.encodeParameters(['string', 'string', 'string'],[this.state.encryptedBid, this.state.hashZokrates1, this.state.hashZokrates2])));
            (async () => {
                const accounts = await web3.eth.getAccounts();
                console.log(accounts);
              
                const balance = await web3.eth.getBalance(accounts[0]);
                console.log("balance", web3.utils.fromWei(balance, "ether"));
                auctionContract.methods.bid(web3.utils.keccak256(web3.eth.abi.encodeParameters(['string', 'string', 'string'],[this.state.encryptedBid, this.state.hashZokrates1, this.state.hashZokrates2]))).send({from: accounts[0],to: this.props.contractAddress, value: web3.utils.toWei('5', "ether")}, function(error, result){
                    if(!error){
                        alert("Your bid has been processed succesfully. These are the detais of your transaction");
                    }else{
                        alert("Your bid has not been processed succesfully because of the following error: " + error);
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
        const { showSending, encryptedBid, hashZokrates1, hashZokrates2, hasError} = this.state;
        const {onClose} = this.props;
        return (<div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose(false)}>&times;</span>
                <h2>Placing a bid</h2>
                { showSending && (<span className="success"> Enviando... </span>)}
                { hasError && (<div className="error"> Some fields are empty or contain an wrong values. </div>)}
                <form>
                    <label>Encrypted bid with the public key of the Auctioneer</label>
                    <input type="text" value={encryptedBid} onChange={this.handleChange("encryptedBid")} minLength="3" maxLength="200" required/>
                    <label>Hash obtained from ZoKrates (part 1)</label>
                    <input type="text" value={hashZokrates1} onChange={this.handleChange("hashZokrates1")} minLength="3" maxLength="200" required/>
                    <label>Hash obtained from ZoKrates (part 2)</label>
                    <input type="text" value={hashZokrates2} onChange={this.handleChange("hashZokrates2")} minLength="3" maxLength="200" required/>
                    <input type="submit" onClick={this.handleBid} value="Submit" disabled={showSending}/>
                </form>
            </div>
        </div>);
    }
}

Bid.propTypes = {
    onClose: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    contractAddress: PropTypes.string.isRequired,
    contractAbi: PropTypes.string.isRequired
};

export default Bid;