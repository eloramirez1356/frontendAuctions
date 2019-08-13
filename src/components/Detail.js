import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { getAuctionDetail, getAuctions } from '../api';
import Loading from './Loading';
import Web3 from 'web3';
import {Network} from 'web3-net';
import Bid from './Bid';
import ProvingBid from './ProvingBid';
import ProvingProofOfWinner from './ProvingProofOfWinner';
import WinnerPayment from './WinnerPayment';
import { async } from 'q';
import TableWithBids from './TableWithBids';
//import Video from './Video';

class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            isConnected:false,
            account: '',
            showBidModal:false,
            showProvingBidModal:false,
            showProvingProofOfWinnerModal:false,
            showWinnerPaymentModal: false,
            showTableWithBidsForAuctioneer:false,
            biddingHash:'',
            encryptedBidPk:'',
            hashZok1:'',
            hashZok2:'',
            winner: '',
            biggestBid:'',
            
        };
        this.web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        this.handleBid = this.handleBid.bind(this);
        this.handleCloseBid = this.handleCloseBid.bind(this);
        this.handleProvingBid = this.handleProvingBid.bind(this);
        this.handleCloseProvingBid = this.handleCloseProvingBid.bind(this);
        this.handleProvingProofOfWinner = this.handleProvingProofOfWinner.bind(this);
        this.handleCloseProvingProofOfWinnerModal = this.handleCloseProvingProofOfWinnerModal.bind(this);
        this.handleWinnerPayment = this.handleWinnerPayment.bind(this);
        this.handleCloseWinnerPayment = this.handleCloseWinnerPayment.bind(this);
        this.retrieveBids = this.retrieveBids.bind(this);
    }
    

    componentWillMount() {
        if(this.web3 && this.web3.eth.net.isListening()) {
          this.setState({isConnected: true});
        }
        (async () => {
            const accounts = await this.web3.eth.getAccounts();
            this.setState({account: accounts[0]});
          })().then();
    }

    componentDidMount() {
        const { match } = this.props;
        this.setState({ isLoading: true });
        getAuctionDetail({ idAuction: this.props.match.params.id})
        .then(data => this.setState({auction: data, isLoading: false}))
        .catch(err => this.setState({error:err, isLoading: false}));
    }

    handleBid(e){
        e.preventDefault();
        this.setState({showBidModal:true});
    }
    handleCloseBid(reload,hashedBid,encryptedBid,hashZok1,hashZok2){
        return () => {
            if(reload){
                this.setState({
                    isLoading:true, 
                    showBidModal: false,
                    biddingHash: hashedBid,
                    encryptedBidPk: encryptedBid,
                    hashZok1:hashZok1,
                    hashZok2:hashZok2,
                });
                getAuctions().then(data => this
                    .setState({auctions:data, isLoading:false, showBidModal:false}))
                    .catch(error => this.setState({error, isLoading:false, showBidModal:false}));
            }else{
                this.setState({showBidModal:false});
            }
        }
    }


    handleProvingBid(e){
        e.preventDefault();
        this.setState({showProvingBidModal:true});
    }
    handleCloseProvingBid(reload){
        return () => {
            if(reload){
                this.setState({
                    isLoading:true, 
                    showProvingBidModal: false
                });
                getAuctions().then(data => this
                    .setState({auctions:data, isLoading:false, showProvingBidModal:false}))
                    .catch(error => this.setState({error, isLoading:false, showProvingBidModal:false}));
            }else{
                this.setState({showProvingBidModal:false});
            }
        }
    }

    handleProvingProofOfWinner(e){
        e.preventDefault();
        this.setState({showProvingProofOfWinnerModal:true});
    }

    handleCloseProvingProofOfWinnerModal(reload, winner){
        return () => {
            if(reload){
                this.setState({
                    isLoading:true, 
                    showProvingProofOfWinnerModal: false,
                    winner: winner,

                });
                getAuctions().then(data => this
                    .setState({auctions:data, isLoading:false, showProvingProofOfWinnerModal:false}))
                    .catch(error => this.setState({error, isLoading:false, showProvingProofOfWinnerModal:false}));
            }else{
                this.setState({showProvingProofOfWinnerModal:false});
            }
        }
    }

    handleWinnerPayment(e){
        e.preventDefault();
        this.setState({showWinnerPaymentModal:true});
    }

    handleCloseWinnerPayment(reload){
        return () => {
            if(reload){
                this.setState({
                    isLoading:true, 
                    showWinnerPaymentModal: false
                });
                getAuctions().then(data => this
                    .setState({auctions:data, isLoading:false, showWinnerPaymentModal:false}))
                    .catch(error => this.setState({error, isLoading:false, showWinnerPaymentModal:false}));
            }else{
                this.setState({showWinnerPaymentModal:false});
            }
        }
    }

    handleWinnerAndBiggestBid(winner, biggestBid){
        this.setState({winner:winner, biggestBid:biggestBid});
    }

    retrieveBids(e){
        e.preventDefault();
        const { auction } = this.state;
        const web3 = this.web3;
        console.log(auction);
        const parsedAbi = JSON.parse(auction.abi);
        const auctionContract = new web3.eth.Contract(parsedAbi, auction.contractAddress);
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
        const { isLoading, error, auction, showTableWithBidsForAuctioneer, allInfoBids, biddingHash, encryptedBidPk, hashZok1, hashZok2, winner, biggestBid, account} = this.state;
        const explanationForBidding = <div>
                <p>The procedure for bidding is the following: </p>
                <ol>
                    <li>Click in the Bid button during the period established for bidding.</li>
                    <li>Fill the Encrypted bid field with your encrypted bid</li>
                    <li>Introduce the hashed values in the last two fields, obtained from the execution of ZoKrates (Detailed explanation clickin in ZoKrates Explanation Button)</li>
                </ol>

                <h4>Zokrates Explanation</h4>
                <p>For bidding using this System you have to download this program. You can find all the information here.</p>
                <p>Once installed, copy the following program and save it in your computer as hashingZokrates.code, and then compile and generate your hashes for bidding with the following commands:</p>
                <ul>
                    <li>./zokrates compile -i hashingZokrates.code</li>
                    <li>./zokrates compute-witness -a YourBidHere</li>
                </ul>
                <p>After the last command and changing your bid amount for the words YourBidHere, you will obtain two values in your console. You set these two as inputs</p>
            </div>;
        if (error) return <p className="error">{error.message}</p>;
        if (isLoading || !auction) return <Loading message={`Loading Auction (#${this.props.match.params.id}) ....`}/>;
        return (<React.Fragment> 
            <div className="detail-container">
                <div className="detail-summary">
                    <h2 className="detail-title">{auction.title}</h2>
                    <p>{auction.description}</p>
                    {(showTableWithBidsForAuctioneer) ? (<TableWithBids retrievedBids={allInfoBids}/>) : null}
                    {(account != auction.auctioneer && (biddingHash == '')) ? explanationForBidding : null}
                    {(winner != '') ? <div><label>The winner address is: </label><p>{winner} bidding the amount of {biggestBid}</p></div> : null}
                    {(account != auction.auctioneer && (biddingHash == '')) ? <input type="button" onClick={this.handleBid} value="Bid" className="detail-button"/> : null}
                    {(account != auction.auctioneer && biddingHash != '') ? <div><p>Your hashed bid and data are these:</p><label>Hashed bid: {biddingHash}</label><label>Encrypted bid: </label><p>{encryptedBidPk}</p><label>Hash ZoKrates 1: </label><p>{hashZok1}</p> <label>Hash ZoKrates 2: </label><p>{hashZok2}</p><p>Save them for proving it in the next period.</p></div> : null}
                    {(account != auction.auctioneer) ? <input type="button" onClick={this.handleProvingBid} value="Prove your bid" className="detail-button"/> : null}
                    {((account == auction.auctioneer) && (!showTableWithBidsForAuctioneer)) ? <input type="button" onClick={this.retrieveBids} value="Retrieve bids" className="detail-button"/> : null }
                    {(account == auction.auctioneer) ? <input type="button" onClick={this.handleProvingProofOfWinner} value="Submit proof of Winner" className="detail-button"/> : null }
                    {(account != auction.auctioneer) ? <input type="button" onClick={this.handleWinnerPayment} value="Are you the winner?" className="detail-button"/> : null}
                </div>
            </div>
            
            { this.state.showBidModal && (<Bid onClose={this.handleCloseBid} web3={this.web3} contractAddress={auction.contractAddress} contractAbi={auction.abi}/>)}
            { this.state.showProvingBidModal && (<ProvingBid onClose={this.handleCloseProvingBid} web3={this.web3} contractAddress={auction.contractAddress} contractAbi={auction.abi}/>)}
            { this.state.showProvingProofOfWinnerModal && (<ProvingProofOfWinner passInfo={this.handleWinnerAndBiggestBid} onClose={this.handleCloseProvingProofOfWinnerModal} web3={this.web3} contractAddress={auction.contractAddress} contractAbi={auction.abi}/>)}
            { this.state.showWinnerPaymentModal && (<WinnerPayment onClose={this.handleCloseWinnerPayment} web3={this.web3} contractAddress={auction.contractAddress} contractAbi={auction.abi}/>)}
        </React.Fragment>)
    }
}
/*{this.state.isConnected ? 'Connected to local node':'Not Connected'}*/

export default withRouter(Detail);
