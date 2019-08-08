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
        const { onClose } = this.props;
        const web3 = this.props.web3;
        const parsedAbi = JSON.parse(this.props.contractAbi);
        const auctionContract = new web3.eth.Contract(parsedAbi, this.props.contractAddress);
        /*auctionContract.methods.getBiggestBid().call(function(err, res){
            if(!err){
                winnerBid = res;
            }else{
                console.log(err);
            }
            
        });*/
        this.setState({showSending:true});
            (async () => {
                const accounts = await web3.eth.getAccounts();
                const winnerBid = await auctionContract.methods.getBiggestBid().call();
                console.log(winnerBid.toString());
                auctionContract.methods.paymentOperations().send({from: accounts[0],to: this.props.contractAddress, value: web3.utils.toWei(winnerBid.toString(), "wei"), gas:3000000}, function(error, result){
                    if(!error){
                        alert("You have proved your transaction successfully and you participate in the bid " + result);
                        //console.log(auctionContract.methods.getHashesZokrates(0).call());
                    }else{
                        alert("You have not proved your transaction successfully and you do not participate in the bid because of the following error: " + error);
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
                    <input type="submit" onClick={this.handleWinnerPayment} value="Submit" disabled={showSending}/>
                </form>
            </div>
        </div>);
    }
}

WinnerPayment.propTypes = {
    onClose: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    contractAddress: PropTypes.string.isRequired,
    contractAbi: PropTypes.string.isRequired
};

export default WinnerPayment;