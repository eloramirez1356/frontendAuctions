import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const Item = ({data}) => (<Link className="grid-item-link" to={`/${data.id}`}>
    <div className="grid-item">
        <img className="preview-image" src={data.image} alt={data.title}/>
        <div className="preview-title">{data.title}</div>
        <div className="preview-bidding-period">Bidding Period: {data.biddingPeriod}</div>
        <div className="preview-proving-period">Proving Period: {data.provingPeriod}</div>
    </div>
    </Link>)

Item.propTypes = {
    data: PropTypes.object.isRequired
};

export default Item;