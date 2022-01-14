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
        const metamaskProvider = window.ethereum.providers.find((provider)=>provider.isMetaMask)
        try {
            const accounts = await metamaskProvider.request({
                method: "eth_requestAccounts",
            });
            //아래 두 줄은 서명 요청 하려고 테스트하던 것 지워도 괜춘
            // const rpcURL = "https://rinkeby.infura.io/v3/14e49a40e7ca44f7b4a9afb62e21c945";
            // const web3 = await new Web3(rpcURL);

            //db로그인 저장
            const web3 = await new Web3(metamaskProvider);
            setLoginAccount(accounts[0]);
            setWeb3(web3);
            setIsLogin(true);
            setfooter(true);

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*'
            }
            const params = new URLSearchParams();
            params.append('loginAddress',accounts[0]);

            await axios.post('http://localhost:3001/sign',params,{headers}).then((res)=>{
            console.log(res)
        })
        
            document.location.href = "/market";

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
            if (typeof window.ethereum === "undefined") {
                var win = window.open("https://metamask.io/download.html", "_blank");
                win.focus();
            } else {
                console.log("error! ", e);
            }
        }
    };

    return (
        <div className="signInPage">
            <h2 className="signInTitle">Sign in with your wallet for connecting KiFT</h2>
            <div>
                <button className="signInButton" onClick={() => connectWallet()}>
                    Select a Wallet
                </button>
            </div>
        </div>
    );
}

export default SignIn;
