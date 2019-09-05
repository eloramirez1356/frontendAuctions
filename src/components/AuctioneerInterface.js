import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableWithBids from './TableWithBids';
import ProvingProofOfWinner from './ProvingProofOfWinner';
import NodeRSA from 'node-rsa';

class AuctioneerInterface extends Component {
    constructor (props){
        super(props);
        this.state = {
            hasError:false,
            showTableWithBidsForAuctioneer:false,
            showProvingProofOfWinnerModal:false,
            privateKeySet:false,
            allInfoBids:'',
            privateKey:'',
        }
        this.retrieveBids = this.retrieveBids.bind(this);
        this.handleProvingProofOfWinner = this.handleProvingProofOfWinner.bind(this);
        this.handleCloseProvingProofOfWinnerModal = this.handleCloseProvingProofOfWinnerModal.bind(this);
        this.handlePrivateKey = this.handlePrivateKey.bind(this);
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

    handleProvingChange (field){
        return (event) => {
            this.setState({
                [field]: event.target.value
            })
        }
    }

    handlePrivateKey(e){
        e.preventDefault();
        this.setState({
            privateKeySet: true
        });
    }

    
    retrieveBids(e){
        e.preventDefault();
        const {web3} = this.props;
        const auctionContract = this.props.contract;
        const {privateKey} = this.state;
        const privateKeyRsa = new NodeRSA(privateKey);
        var infoBids = [];
        (async () => {
            var i;
            for (i = 0; i < 4; i++) { 
                const encryptedBid = await auctionContract.methods.getBidAmounts(i).call();
                const hashes = await auctionContract.methods.getHashesZokrates(i).call();
                console.log(encryptedBid);
                console.log("Decripted: " + web3.utils.hexToUtf8(encryptedBid));
                console.log(hashes);
                infoBids.push({bidder:"Bidder" + i+1, clearBid:privateKeyRsa.decrypt(web3.utils.hexToUtf8(encryptedBid), 'utf8'), hashBid1:web3.utils.toBN(hashes[0]).toString(), hashBid2:web3.utils.toBN(hashes[1]).toString()});
            }
            const infoBids2 = await Promise.all(infoBids);
            this.setState({allInfoBids:infoBids2, showTableWithBidsForAuctioneer:true});

            const element = document.createElement("a");
            const file = new Blob(['./zokrates compute-witness -a ' + infoBids2[0].clearBid + " " + infoBids2[1].clearBid + " " + infoBids2[2].clearBid + " " + infoBids2[3].clearBid + " " + infoBids2[0].hashBid1 + " " + infoBids2[0].hashBid2 + " " + infoBids2[1].hashBid1 + " " + infoBids2[1].hashBid2 + " " + infoBids2[2].hashBid1 + " " + infoBids2[2].hashBid2 + " " + infoBids2[3].hashBid1 + " " + infoBids2[3].hashBid2], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = "commandZokrates.txt";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();

          })().then();
    }

    render(){
        const {showTableWithBidsForAuctioneer, allInfoBids, privateKey, privateKeySet} = this.state;
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

                {(showTableWithBidsForAuctioneer) && privateKeySet ? (<TableWithBids retrievedBids={allInfoBids}/>) : null}
                {(!showTableWithBidsForAuctioneer) && privateKeySet ? <input type="button" onClick={this.retrieveBids} value="Retrieve bids" className="detail-button"/> : null }
                {(privateKeySet) ? <input type="button" onClick={this.handleProvingProofOfWinner} value="Submit proof of Winner" className="detail-button"/> : null}
                {(!privateKeySet) ? <input type="text" value={privateKey} onChange={this.handleProvingChange("privateKey")} minLength="3" maxLength="2000" required/> : null}
                {(!privateKeySet) ? <input type="button" onClick={this.handlePrivateKey} value="Add private key" className="detail-button"/> : null}

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