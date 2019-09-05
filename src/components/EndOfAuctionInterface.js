import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WinnerPayment from './WinnerPayment';

class EndOfAuctionInterface extends Component{
    constructor (props){
        super(props);
        this.state = {
            hasError:false,
            showWinnerPaymentModal: false,
        }
        this.handleWinnerPayment = this.handleWinnerPayment.bind(this);
        this.handleCloseWinnerPayment = this.handleCloseWinnerPayment.bind(this);
    }

    handleWinnerPayment(e){
        e.preventDefault();
        this.setState({showWinnerPaymentModal:true});
    }

    handleCloseWinnerPayment(reload){
        const {closeModal} = this.props;
        return () => {
            if(reload){
                this.setState({ showWinnerPaymentModal: false });
                closeModal();
            }else{
                this.setState({showWinnerPaymentModal:false});
            }
        }
    }

    render(){
        const {web3, contract, contractAddress, winner, winnerBid, account} = this.props;
        const {showWinnerPaymentModal} = this.state;
        return(
            <React.Fragment>
            <div>
                <label>The winner address is: </label><p>{winner} bidding the amount of {winnerBid} Ethers</p>
            </div>
            {(winner == account) ? <input type="button" onClick={this.handleWinnerPayment} value="Are you the winner?" className="detail-button"/> : null}
            { showWinnerPaymentModal && (<WinnerPayment onClose={this.handleCloseWinnerPayment} web3={web3} contractAddress={contractAddress} contract={contract}/>)}
            </React.Fragment>
        );
    }

    
}

EndOfAuctionInterface.propTypes = {
    closeModal: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    contract: PropTypes.object.isRequired, 
    account: PropTypes.string.isRequired,
    contractAddress: PropTypes.string.isRequired,
}

export default EndOfAuctionInterface;