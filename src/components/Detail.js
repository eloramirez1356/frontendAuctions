import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { getAuctionDetail, getAuctions } from '../api';
import Loading from './Loading';
import Web3 from 'web3';
import {Network} from 'web3-net';
import Bid from './Bid';
import ProvingBid from './ProvingBid';
//import Video from './Video';

class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            isConnected:false,
            showBidModal:false,
            showProvingBidModal:false, 
        };
        this.web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        this.handleBid = this.handleBid.bind(this);
        this.handleCloseBid = this.handleCloseBid.bind(this);
        this.handleProvingBid = this.handleProvingBid.bind(this);
        this.handleCloseProvingBid = this.handleCloseProvingBid.bind(this);
    }
    

    componentWillMount() {
        if(this.web3 && this.web3.eth.net.isListening()) {
          this.setState({isConnected: true});
        }
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
    handleCloseBid(reload){
        return () => {
            if(reload){
                this.setState({
                    isLoading:true, 
                    showBidModal: false
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

    render(){
        const { isLoading, error, auction } = this.state;
        if (error) return <p className="error">{error.message}</p>;
        if (isLoading || !auction) return <Loading message={`Loading Auction (#${this.props.match.params.id}) ....`}/>;
        return (<React.Fragment> 
            <div className="detail-container">
                <div className="detail-summary">
                    <h2 className="detail-title">{auction.title}</h2>
                    <p>{auction.description}</p>
                    <input type="button" onClick={this.handleBid} value="Bid" className="detail-button"/>
                    <input type="button" onClick={this.handleProvingBid} value="Prove your bid" className="detail-button"/>
                </div>
            </div>
            {this.state.isConnected?'Connected to local node':'Not Connected'}
            { this.state.showBidModal && (<Bid onClose={this.handleCloseBid} web3={this.web3} contractAddress={auction.contractAddress} contractAbi={auction.abi}/>)}
            { this.state.showProvingBidModal && (<ProvingBid onClose={this.handleCloseProvingBid} web3={this.web3} contractAddress={auction.contractAddress} contractAbi={auction.abi}/>)}
        </React.Fragment>)
    }
}

export default withRouter(Detail);
