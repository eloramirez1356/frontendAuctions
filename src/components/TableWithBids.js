import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TableWithBids extends Component {
    constructor (props){
        super(props);
        this.state = {
            hasError:false,
        }
    }

    render() {
        console.log(this.props.retrievedBids);
        return (<div className="tablesInfoBids">
        <div className="tableWithEncryptedBids">
            <h4>Table with Encrypted Bids with Public Keys</h4>
            <p>You have to decrypt this values with the private key, and obtain the bids. These must be introduced as private inputs in the ZoKrates program</p>
            <table id="simple-board">
               <tbody>
                <tr id="row0">
                    <th>Bidders</th>
                    <th>Encrypted Bid with Public Key</th>
                </tr>
                <tr id="row1">
                    <td id="cell1-0">Bidder 1</td>
                    <td id="cell1-1">{this.props.retrievedBids[0].encryptedBid}</td>
                    
                </tr>
                <tr id="row2">
                    <td id="cell2-0">Bidder 2</td>
                    <td id="cell2-1">{this.props.retrievedBids[1].encryptedBid}</td>
                </tr>
                <tr id="row3">
                    <td id="cell3-0">Bidder 3</td>
                    <td id="cell3-1">{this.props.retrievedBids[2].encryptedBid}</td>
                </tr>
                <tr id="row4">
                    <td id="cell4-0">Bidder 4</td>
                    <td id="cell4-1">{this.props.retrievedBids[3].encryptedBid}</td>
                </tr>
               </tbody>
            </table>
        </div>
        <h4>Table with Hashed Bids with ZoK</h4>
        <p>You have to introduced these values as public inputs in the ZoKrates program for determining the winner</p>
        <div className="tableWithHashedBids">
        <table id="simple-board">
           <tbody>
            <tr id="row0">
                <th>Bidders</th>
                <th>Hashed Bid with ZoK (1) and Hashed Bid with Zok (2)</th>
            </tr>
            <tr id="row1">
                <td id="cell1-0">Bidder 1</td>
                <td id="cell1-1">{this.props.retrievedBids[0].hashBid1} {this.props.retrievedBids[0].hashBid2}</td>
                
            </tr>
            <tr id="row2">
                <td id="cell2-0">Bidder 2</td>
                <td id="cell2-1">{this.props.retrievedBids[1].hashBid1} {this.props.retrievedBids[1].hashBid2}</td>
            </tr>
            <tr id="row3">
                <td id="cell3-0">Bidder 3</td>
                <td id="cell3-1">{this.props.retrievedBids[2].hashBid1} {this.props.retrievedBids[2].hashBid2}</td>
            </tr>
            <tr id="row4">
                <td id="cell4-0">Bidder 4</td>
                <td id="cell4-1">{this.props.retrievedBids[3].hashBid1} {this.props.retrievedBids[3].hashBid2}</td>
            </tr>
           </tbody>
        </table>
    </div>
    </div>);
    }
}

TableWithBids.propTypes = {
    retrievedBids: PropTypes.array.isRequired,
};

export default TableWithBids;
