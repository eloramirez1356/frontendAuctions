import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WinnerPayment extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hasError: false,
            showSending: false,
        }
        this.handleWinnerPayment = this.handleWinnerPayment.bind(this);
        //this.handleWinnerPaymentChange = this.handleProvingProofOfWinnerChange.bind(this);
        }

    /*handleProvingProofOfWinnerChange (field){
        return (event) => {
            this.setState({
                [field]: event.target.value
            })
        }
    }*/

    handleWinnerPayment(e){
        e.preventDefault();
        const { onClose, web3, contract, contractAddress } = this.props;
        const auctionContract = contract;
        this.setState({showSending:true});
            (async () => {
                const accounts = await web3.eth.getAccounts();
                const winnerBid = await auctionContract.methods.getBiggestBid().call();
                console.log(winnerBid.toString());
                auctionContract.methods.paymentOperations().send({from: accounts[0],to: contractAddress, value: web3.utils.toWei(winnerBid.toString(), "wei"), gas:3000000}, function(error, result){
                    if(!error){
                        alert("Congrats! You have won the auction and have paid the beneficiary correctly! This is your tx which confirms it: " + result);
                        //console.log(auctionContract.methods.getHashesZokrates(0).call());
                    }else{
                        alert("Are you the winner? Something happened: " + error);
                    }
                });
              })().then(onClose(true));
    }


    render() {
        const { showSending, hasError} = this.state;
        const {onClose} = this.props;
        return (<div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose(false)}>&times;</span>
                <h2>Congratulations!</h2>
                { showSending && (<span className="success"> Enviando... </span>)}
                { hasError && (<div className="error"> Some fields are empty or contain an wrong values. </div>)}
                <form>
                    <label>You Are The Winner of the bid!</label>
                    <input type="submit" onClick={this.handleWinnerPayment} value="Check if you won" disabled={showSending}/>
                </form>
            </div>
        </div>);
    }
}

WinnerPayment.propTypes = {
    onClose: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    contract: PropTypes.object.isRequired,
    contractAddress: PropTypes.string.isRequired,
};

export default WinnerPayment;