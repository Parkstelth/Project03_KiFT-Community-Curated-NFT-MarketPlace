import "./Market.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Item from "./Item";

function Market({ setfooter }) {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setfooter(true);
    }, []);

    useEffect(() => {
        const dataLoad = async () => {

            await axios
                .get(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=21`)
                .then((result) => {
                    console.log(result.data.assets);
                    setMarketData(result.data.assets);
                    
                })
                .catch((err) => console.log(err));
        };
        dataLoad();
    }, []);

    return (
        <div>
            <div className="container">
                <h1 className="marketTitle">Market</h1>
                <div className="row">
                    <hr className="divider" />
                </div>

                <Item marketData={marketData}></Item>
            </div>
        </div>
    );
}

export default Market;
