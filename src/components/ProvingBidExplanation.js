import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProvingBid from './ProvingBid';

class ProvingBidExplanation extends Component{
    constructor (props){
        super(props);
        this.state = {
            hasError:false,
            showProvingBidModal:false,
        }
        this.handleProvingBid = this.handleProvingBid.bind(this);
        this.handleCloseProvingBid = this.handleCloseProvingBid.bind(this);
    }

    handleProvingBid(e){
        e.preventDefault();
        this.setState({showProvingBidModal:true});
    }
    handleCloseProvingBid(reload){
        const {closeModal} = this.props;
        return () => {
            if(reload){
                this.setState({showProvingBidModal: false});
                closeModal();
            }else{
                this.setState({showProvingBidModal:false});
            }
        }
    }

    render(){
        const {web3, account, contract} = this.props;
        return(
            <React.Fragment>
            <div>
                <h4><i>Proving your Bid:</i></h4>
                <p>In this step you will have to provide the data provided in the bidding period, concretely the hashed bid, the encrypted bid and
                    the two parts of the ZoKrates hash.
                </p>
                <input type="button" onClick={this.handleProvingBid} value="Prove your bid" className="detail-button"/>

            </div>
            { this.state.showProvingBidModal && (<ProvingBid onClose={this.handleCloseProvingBid} web3={web3} contract={contract} account={account}/>)}
            </React.Fragment>
        );
    }

    
}

ProvingBidExplanation.propTypes = {
    web3: PropTypes.object.isRequired,
    contract: PropTypes.object.isRequired, 
    account: PropTypes.string.isRequired,
};

export default ProvingBidExplanation;