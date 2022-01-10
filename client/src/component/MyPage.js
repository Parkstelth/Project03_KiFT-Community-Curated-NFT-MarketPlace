import "./MyPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import { Link } from "react-router-dom";

function MyPage() {
    const [data, setData] = useState([]);
    console.log(data)
    const fetchNFTs = async () => {
        const web = new Web3(window.ethereum);
        await web.eth.getAccounts().then(async(account) => {
            await axios.get(`https://testnets-api.opensea.io/assets?owner=${account}`).then(
                (result) => setData(result.data.assets)
            );
        })
    };


    useEffect(() => {
        fetchNFTs();
    }, []);

    return (
        <div className="MyPage">
            {
                data.length===0
                ? <div> 가지고 있는 NFT가 없습니다.</div>
                :   data.map((item)=>{
                    return (
                        <Link to={`/mypage/${item.id}`}>
                        <div key={item.id}>
                            <div>토큰id : {item.token_id}</div>
                            <img src={item.image_url} />
                            </div>
                        </Link>
                    )
                })

            }
        </div>
    );
}

export default MyPage;
