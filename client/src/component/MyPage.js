import "./MyPage.css";
import { useState, useEffect } from "react";
import axios from "axios";

function MyPage({ loginAccount }) {
    const [data, setData] = useState([]);
    //사진 가져오기
    // useEffect(() => {
    //     const fetchNFTs = async () => {
    //         const NFTList = await axios.get(`https://testnets-api.opensea.io/assets?owner=${loginAccount}`).then(
    //             (result) => result.json()

    //             //넣어봐야함
    //             /* console.log(result.data.assets);
    //             result.data.assets.map((item) => {
    //                 console.log(item.image_url); // or image_original_url 이건 원본
    //                 return item.image_url;
    //             }); */
    //         );
    //         // console.log(result.json);
    //     };
    // }, []);

    return (
        <div className="MyPage">
            <div>dfasf</div>
        </div>
    );
}

export default MyPage;
