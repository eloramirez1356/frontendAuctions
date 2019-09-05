import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { getAuctionDetail, getAuctions, addWinner } from '../api';
import Loading from './Loading';
import Web3 from 'web3';
import Bid from './Bid';
import ProvingBid from './ProvingBid';
import ProvingProofOfWinner from './ProvingProofOfWinner';
import WinnerPayment from './WinnerPayment';
import TableWithBids from './TableWithBids';
import BidExplanation from './BidExplanation';
import ProvingBidExplanation from './ProvingBidExplanation'
import AuctioneerInterface from './AuctioneerInterface';
import EndOfAuctionInterface from './EndOfAuctionInterface';

//import Video from './Video';

class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            isConnected:false,
            account: '',
            biddingHash:'',
            encryptedBidPk:'',
            hashZok1:'',
            hashZok2:'',
            loaded:false,
            publicKey:'',
            
        };
        this.web3 = new Web3( Web3.givenProvider || ('http://127.0.0.1:7545'));
        this.handleWinnerPayment = this.handleWinnerPayment.bind(this);
        this.handleCloseWinnerPayment = this.handleCloseWinnerPayment.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInfoFromBid = this.handleInfoFromBid.bind(this);
    }

    /*componentWillMount(){
        const { match } = this.props;
        this.setState({ isLoading: true });
        if(this.web3 && this.web3.eth.net.isListening()) {
            this.setState({isConnected: true});
            console.log("Esta conectado");
        }
        (async () => {
            const accounts = await this.web3.eth.getAccounts();
            console.log("las cuentas son: " + accounts);
        })().then();
    }*/
    componentDidMount() {
        const { match } = this.props;
        this.setState({ isLoading: true });
        if(this.web3 && this.web3.eth.net.isListening()) {
            this.setState({isConnected: true});
            console.log("Esta conectado");
          }
        (async () => {
            const data = await getAuctionDetail({ idAuction: this.props.match.params.id}).catch(err => this.setState({error:err, isLoading: false}));
            this.setState({auction: data, isLoading: false});
            const { auction } = this.state;
            const parsedAbi = JSON.parse(auction.abi);
            const auctionContract = new this.web3.eth.Contract(parsedAbi, auction.contractAddress);
            const accounts = await this.web3.eth.getAccounts();
            console.log("las cuentas son: " + accounts);
            this.setState({account: accounts[0], contract: auctionContract, contractAddress: auction.contractAddress, publicKey:auction.publicKey});
            const winnerData = await auctionContract.methods.getWinner().call();
            const winnerBidData = await auctionContract.methods.getBiggestBid().call();
            console.log("Winner: " + winnerData.toString() + " winnerBid: " + (winnerBidData/1e18).toString());
            this.setState({winner: winnerData.toString(), winnerBid: (winnerBidData/1e18).toString(), loaded: true});
      })().then();

        
    }

    handleClose(){
        this.setState({
            isLoading:true,
        });
        getAuctions().then(data => this
            .setState({auctions:data, isLoading:false}))
            .catch(error => this.setState({error, isLoading:false}));
    }

    handleInfoFromBid(hashedBid,encryptedBid,hashZok1,hashZok2){
        this.setState({ 
            biddingHash: hashedBid,
            encryptedBidPk: encryptedBid,
            hashZok1:hashZok1,
            hashZok2:hashZok2,
        });
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
    render(){
        const { isLoading, error, auction, contract ,allInfoBids, biddingHash, loaded, publicKey, winner, winnerBid, account, contractAddress} = this.state;
        if (error) return <p className="error">{error.message}</p>;
        if (isLoading || !auction) return <Loading message={`Loading Auction (#${this.props.match.params.id}) ....`}/>;
        return (<React.Fragment> 
            <div className="detail-container">
                <div className="detail-summary">
                    <h2 className="detail-title">{auction.title}</h2>
                    <p>{auction.description}</p>
                    {(account != auction.auctioneer && biddingHash=='' && winnerBid == 0) ? <BidExplanation web3={this.web3} account = {account} contract={contract} contractAddress={contractAddress} closeModal={this.handleClose} obtainInfoFromBid={this.handleInfoFromBid} publicKey={publicKey}></BidExplanation> : null}
                    {(account != auction.auctioneer && biddingHash!='' && winnerBid == 0) ? <ProvingBidExplanation web3={this.web3} account = {account} contract={contract} closeModal={this.handleClose}></ProvingBidExplanation> : null}
                    {(account == auction.auctioneer && winnerBid == 0) ? <AuctioneerInterface web3={this.web3} account = {account} contract={contract} closeModal={this.handleClose}></AuctioneerInterface> : null }
                    {(account != auction.auctioneer && winnerBid != 0 && loaded)  ? <EndOfAuctionInterface web3={this.web3} account = {account} contract={contract} contractAddress={contractAddress} closeModal={this.handleClose} winner={winner} winnerBid={winnerBid}></EndOfAuctionInterface> : null}
                </div>
            </div>
            
            { this.state.showWinnerPaymentModal && (<WinnerPayment onClose={this.handleCloseWinnerPayment} web3={this.web3} contractAddress={auction.contractAddress} contractAbi={auction.abi}/>)}
        </React.Fragment>)
    }
}
/*{this.state.isConnected ? 'Connected to local node':'Not Connected'}*/
//&& biddingHash != ''
export default withRouter(Detail);
