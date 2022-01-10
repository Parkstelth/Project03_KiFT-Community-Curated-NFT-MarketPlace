import "./SignIn.css";
import { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";

function SignIn({ setfooter, setLoginAccount, setWeb3, setIsLogin }) {
    useEffect(() => {
        setfooter(false);
    }, []);

    // const fetchMyNFTs = axios.get(`https://testnets-api.opensea.io/assets?owner=${accounts[0]}`)

    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const rpcURL = "https://rinkeby.infura.io/v3/14e49a40e7ca44f7b4a9afb62e21c945";
            const web3 = await new Web3(rpcURL);
            setLoginAccount(accounts[0]);
            console.log(accounts[0]);
            console.log(web3);
            setWeb3(web3);
            setIsLogin(true);
            setfooter(true);
            //소유한 nft가져오는 법
            /* await axios.get(`https://testnets-api.opensea.io/assets?owner=${accounts[0]}`).then((result) => {
                console.log(result.data.assets);
                result.data.assets.map((item) => {
                    console.log(item.image_url); // or image_original_url 이건 원본
                    return item.image_url;
                });
            }); */

            //서명 요청 이건 잘 안된다 ㅜ 없애도 괜츈
            // await web3.eth.getBalance(accounts[0]).then(console.log);
            // console.log("plus");

            // let from = accounts[0];
            // let params = [from, "This is for signature"];
            // let method = "personal_sign";
            // console.log(from);
            // web3.utils.toChecksumAddress(from);
            // try {
            //     await web3.eth.sign(
            //         {
            //             method,
            //             params,
            //             from,
            //         },
            //         function (err, result) {
            //             if (!err) {
            //                 console.log("sometasdfasd");
            //             } else if (err) {
            //                 console.log(result);
            //             }
            //         }
            //     );
            // } catch (e) {
            //     console.log(e);
            // }
        } catch (e) {
            if (e.code === -32002) {
                console.log("error! ", e);
            } else {
                var win = window.open("https://metamask.io/download.html", "_blank");
                win.focus();
            }
        }
    };

    return (
        <div className="signInPage">
            <div>Sign in with your wallet for connecting KiFT</div>
            <div>
                <button onClick={() => connectWallet()}>login</button>
            </div>
        </div>
    );
}

export default SignIn;
