import "./MyPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import { Link } from "react-router-dom";
import {Card,CardGroup} from 'react-bootstrap'



function MyPage({setIsLogin}) {

    const [data, setData] = useState([]);
    const [nowAccount, setNowAccount] = useState('')
  
    const fetchNFTs = async () => {
        const web = new Web3(window.ethereum);
        await web.eth.getAccounts().then((account) => {
            setIsLogin(true)
            return account
            
        }).then(async(account)=>{
            await axios.get(`https://testnets-api.opensea.io/assets?owner=${account}`).then(
                (result) => {
                    setData(result.data.assets)
                    setNowAccount(account)
                }
            );
        })
    };
   


    useEffect(()=>{
        fetchNFTs();
    },[])

  

    return (
        <div className="MyPage">
            {
                data.length===0
                ? <div> 
                        <div className="main">
                            <div className="main_myimage_box">
                                <img className="main_myimage" src='https://cdn.pixabay.com/photo/2012/04/01/18/40/button-23946_960_720.png' />
                            </div>
                            
                        </div>

                        <div className="middle">
                            <div className="address_box">{String(nowAccount).slice(0,6)+'...'+String(nowAccount).slice(-4,)}</div>
                            <div className="createdAt">joined November 2021</div>
                        </div>
                        없음

                </div>
                :  <div>
                        <div className="main">
                            <div className="main_myimage_box">
                                <img className="main_myimage" src='https://cdn.pixabay.com/photo/2012/04/01/18/40/button-23946_960_720.png' />
                            </div>
                            
                        </div>

                        <div className="middle">
                            <div className="address_box">{String(nowAccount).slice(0,6)+'...'+String(nowAccount).slice(-4,)}</div>
                            <div className="createdAt">joined November 2021</div>
                        </div>

                        <CardGroup className="cardGroup">
                    
                        {
                            data.map((item)=>{
                             
                                return (
                                    <Card key={item.id} className="card1">
                                    <Card.Img className="card_img" variant="top" src={item.image_url}/>
                                    <Card.Body className="card_body">
                                      <Card.Title className="card_title">{item.asset_contract.name}</Card.Title>
                                      <Card.Text className="card_text">
                                        {item.collection.name}
                                  </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="card_footer">
                                      <small className="text-muted">{item.collection.created_date.slice(0,10)}{' / '}{item.collection.created_date.slice(11,16)}</small>
                                    
                                    </Card.Footer>
                                    <Link to={`/mypage/${item.id}`} className="button_link">
                                    <button className="sell_button">
                                       Sell
                                    </button>
                                    </Link>
                                  </Card>
                                )
                            })
                        } 
                        </CardGroup>
                    </div>
            }
        </div>
    );
}

export default MyPage;
