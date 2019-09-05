import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Bid from './Bid';

class BidExplanation extends Component{
    constructor (props){
        super(props);
        this.state = {
            hasError:false,
            showBidModal:false,
        }
        this.handleBid = this.handleBid.bind(this);
        this.handleCloseBid = this.handleCloseBid.bind(this);
    }


    handleBid(e){
        e.preventDefault();
        this.setState({showBidModal:true});
    }

    handleCloseBid(reload,hashedBid,encryptedBid,hashZok1,hashZok2){
        const { closeModal, obtainInfoFromBid } = this.props;
        return () => {
            if(reload){
               this.setState({showBidModal:false});
               obtainInfoFromBid(hashedBid, encryptedBid, hashZok1, hashZok2);
               closeModal();
            }else{
                this.setState({showBidModal:false});
            }
        }
    }


    render(){
        const {web3, contract, account, contractAddress, publicKey} = this.props;
        const {showBidModal} = this.state;
        return(
            <React.Fragment>
            <div>
                <h4><i>Bidding procedure:</i></h4>
                <ol>
                    <li>Click in the Bid button during the period established for bidding.</li>
                    <li>Introduce your bid</li>
                    <li>Introduce the hashed values in the last two fields, obtained from the execution of ZoKrates (Detailed explanation clickin in ZoKrates Explanation Button)</li>
                </ol>

                <h4><i>Using ZoKrates:</i></h4>
                <p>For bidding you must download ZoKrates. You can find all the information <a href="https://zokrates.github.io/gettingstarted.html" target="_blank">here</a>.</p>
                <p>Once installed, <a href="webContent/hashingNumbers.code">download this program</a> for obtaining the hashes of your bid. Compile and generate your hashes for bidding with the following commands:</p>
                <ul>
                    <li>./zokrates compile -i hashingZokrates.code</li>
                    <li>./zokrates compute-witness -a YourBidHere</li>
                </ul>
                <p>After the last command and changing your bid amount for the words YourBidHere, you will obtain two values in your console. You set these two as inputs</p>

                <input type="button" onClick={this.handleBid} value="Bid" className="detail-button"/>

            </div>
            { showBidModal && (<Bid onClose={this.handleCloseBid} web3={web3} contract={contract} account={account} contractAddress={contractAddress} publicKey={publicKey}/>)}
            </React.Fragment>
        );
    }

    
}

BidExplanation.propTypes = {
    closeModal: PropTypes.func.isRequired,
    obtainInfoFromBid: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
    contract: PropTypes.object.isRequired, 
    account: PropTypes.string.isRequired,
    contractAddress: PropTypes.string.isRequired,
};

export default BidExplanation;