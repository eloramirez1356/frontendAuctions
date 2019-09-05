import React, { Component } from 'react';
import Loading from './Loading';
import Item from './Item';
//import Bid from './Bid';
import Header from './Header';


//import Api from '../api';
import { getAuctions } from '../api';

class List extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading:false,
            auctions: null,
            error: null
            //,showBidModal: false
        };
        /*this.handleAdd = this.handleAdd.bind(this);
        this.handleCloseAdd = this.handleCloseAdd.bind(this);*/
    }

    //ComponentDidMount sin async
    /*componentDidMount(){
        this.setState({isLoading:true});
        //Llamada API externa
        getVideos().then(data => {
            this.setState({isLoading:false, videos:data});
        });
        
        
    }*/
      
    async componentDidMount(){
        this.setState({ isLoading: true});

        try{
            const auctions = await getAuctions();
            this.setState({auctions, isLoading: false});
        }catch(error){
            this.setState({error, isLoading: false});
        }
        return true;
    }

    /*handleAdd(e){
        e.preventDefault();
        this.setState({showAdd:true});
    }
    handleCloseAdd(reload){
        return () => {
            if(reload){
                this.setState({
                    isLoading:true, 
                    showAdd: false
                });
                getVideos().then(data => this
                    .setState({videos:data, isLoading:false, showAdd:false}))
                    .catch(error => this.setState({error, isLoading:false, showAdd:false}));
            }else{
                this.setState({showAdd:false});
            }
        }
    }*/

    render(){
        const {auctions, isLoading, error} = this.state;
        if(error){
            return (<div> ERROR </div>);
        }
        if(isLoading) return (<Loading message="Loading..."/>);
        return (<React.Fragment>
            <Header onClickAdd={this.handleAdd} />
            <div className="container">
                <div className="grid-container">
                    {
                        auctions && auctions.map((auction,i) => {
                            return (<Item key={i} data={auction}/>)
                        })
                    }
                </div>
            </div>
        </React.Fragment>);
    }
}

export default List;