import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./component/frontpage";
import Market from "./component/Market";
import SignIn from "./component/SignIn";
import Mypage from "./component/MyPage";
import About from "./component/About";
import NotFound from "./component/notfound";
import Nav from "./component/Nav";
import Footer from "./component/Footer";
import { useState, useEffect } from "react";
import Web3 from "web3";

function App() {
    const [footer, setFooter] = useState(true);
    const [loginAccount, setLoginAccount] = useState("");
    const [loadWeb3, setWeb3] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const [sellitem, setSellitem] = useState('')
    
    console.log('now account ===>',loginAccount)

    function setfooter(e) {
        setFooter(e);
    }

    useEffect(() => {
        //son: 이거 건든적이 없는데 왜 밑줄 뜰까요? await 해주면 되나
        //만약 signin페이지에서 Web3(url) 을 window.ethereum 으로 안잡으면 밑에 조건문은 무효화?

        if (typeof window.ethereum !== "undefined") {
            //여러 wallet 플랫폼중 metaMask로 연결
   
            const metamaskProvider = window.ethereum.providers.find((provider)=>provider.isMetaMask)
            // window.ethereum이 있다면 여기서 window.ethereum이란 메타마스크 설치여부
            try {
                const web = new Web3(metamaskProvider);
                 web.eth.getAccounts().then((account) => {
                    
                    if(account.length===0){
                        setLoginAccount("");
                        setWeb3([]);
                        setIsLogin(false)
                    }
                    else{
                       setLoginAccount(account);
                       setWeb3(web);
                       setIsLogin(true)
                    }
                });
 
            } catch (err) {
                console.log(err);
            }
        } else {
            setLoginAccount("");
            setWeb3([]);
            setIsLogin(false)
        }
    }, []);

    return (
        <BrowserRouter>
            <Nav isLogin={isLogin} />
            <Routes>
                <Route exact path="/" element={<FrontPage setfooter={setfooter} />} />
                <Route path="/market" element={<Market setfooter={setfooter} />} />
                {/* 로그인 시 마켓으로 이동하게 해놨음! 다른 곳으로 원하면
                바꿔도 됨*/}
                <Route path="/signin" element={<SignIn setfooter={setfooter} setIsLogin={setIsLogin} setLoginAccount={setLoginAccount} setWeb3={setWeb3} />} />
                <Route path="/mypage" element={<Mypage setIsLogin={setIsLogin} setSellitem={setSellitem}/>} />
                <Route path="mypage/:id" element={<About sellitem={sellitem} />} />
                <Route path=":id" element={<NotFound />} />
            </Routes>
            {footer ? <Footer /> : null}
        </BrowserRouter>
    );
}

export default App;
