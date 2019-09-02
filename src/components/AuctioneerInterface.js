import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableWithBids from './TableWithBids';
import ProvingProofOfWinner from './ProvingProofOfWinner';

class AuctioneerInterface extends Component {
    constructor (props){
        super(props);
        this.state = {
            hasError:false,
            showTableWithBidsForAuctioneer:false,
            showProvingProofOfWinnerModal:false,
            allInfoBids:'',
        }
        this.retrieveBids = this.retrieveBids.bind(this);
        this.handleProvingProofOfWinner = this.handleProvingProofOfWinner.bind(this);
        this.handleCloseProvingProofOfWinnerModal = this.handleCloseProvingProofOfWinnerModal.bind(this);
    }


    handleProvingProofOfWinner(e){
        e.preventDefault();
        this.setState({showProvingProofOfWinnerModal:true});
    }

    handleCloseProvingProofOfWinnerModal(reload){
        const { closeModal } = this.props;
        return () => {
            if(reload){
                this.setState({showProvingProofOfWinnerModal: false});
                closeModal();
            }else{
                this.setState({showProvingProofOfWinnerModal:false});
            }
        }
    }

    
    retrieveBids(e){
        e.preventDefault();
        const auctionContract = this.props.contract;
        var infoBids = [];
        (async () => {
            var i;
            for (i = 0; i < 4; i++) { 
                const encryptedBid = await auctionContract.methods.getBidAmounts(i).call();
                const hashes = await auctionContract.methods.getHashesZokrates(i).call();
                console.log(encryptedBid);
                console.log(hashes);
                infoBids.push({bidder:"Bidder" + i+1,encryptedBid:encryptedBid, hashBid1:hashes[0], hashBid2:hashes[1]});
            }
            const infoBids2 = await Promise.all(infoBids);
            this.setState({allInfoBids:infoBids2, showTableWithBidsForAuctioneer:true});

          })().then();
    }

    render(){
        const {showTableWithBidsForAuctioneer, allInfoBids} = this.state;
        return(<React.Fragment>
            <div>
                <h4><i>Procedure for determining the winner:</i></h4>
                <ol>
                    <li>Retrieve all the information of the bids clicking the button below</li>
                    <li>Compile the following program and generate a proof using the following command:
                        <p>zokrates compute-witness -a <i>decryptedBidBidder1</i> <i>decryptedBidBidder2</i> <i>part1HashZokratesBidder1</i> <i>part2HashZokratesBidder1</i> <i>part1HashZokratesBidder2</i> <i>part2HashZokratesBidder2</i></p>
                    </li>
                    <li>Click the button for submitting the proof, and copy the JSON from the proof.json generated in the directory where you have executed the program</li>
                </ol>

                <p>If you have errors you must to generate another proof repeat the process</p>

                {(showTableWithBidsForAuctioneer) ? (<TableWithBids retrievedBids={allInfoBids}/>) : null}
                {(!showTableWithBidsForAuctioneer) ? <input type="button" onClick={this.retrieveBids} value="Retrieve bids" className="detail-button"/> : null }
                <input type="button" onClick={this.handleProvingProofOfWinner} value="Submit proof of Winner" className="detail-button"/>

            </div>

            { this.state.showProvingProofOfWinnerModal && (<ProvingProofOfWinner onClose={this.handleCloseProvingProofOfWinnerModal} contract={this.props.contract} account={this.props.account}/>)}
            </React.Fragment>
        );
    }
}

AuctioneerInterface.propTypes = {
    closeModal: PropTypes.func.isRequired,
    contract: PropTypes.object.isRequired,
    account: PropTypes.string.isRequired,
}

export default AuctioneerInterface;