import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./component/frontpage";
import Market from "./component/Market";
import SignIn from "./component/SignIn";
import NotFound from "./component/notfound";
import Nav from "./component/Nav";
import Footer from "./component/Footer";
import { useState, useEffect } from "react";
import Web3 from "web3";

function App() {
    const [footer, setFooter] = useState(true);
    const [loginAccount, setLoginAccount] = useState("");
    const [web3, setWeb3] = useState([]);
    const [isLogin, setIsLogin] = useState(false);

    function setfooter(e) {
        setFooter(e);
    }

    useEffect(async () => {
        if (typeof window.ethereum !== "undefined") {
            // window.ethereum이 있다면
            try {
                const web = new Web3(window.ethereum);
                await web.eth.getAccounts().then((account) => {
                    setLoginAccount(account);
                });
                setWeb3(web);
            } catch (err) {
                console.log(err);
            }
        } else {
            setLoginAccount("");
            setWeb3([]);
        }
    }, []);

    console.log("text", loginAccount);
    console.log("text2", web3);

    return (
        <BrowserRouter>
            <Nav isLogin={isLogin} />
            <Routes>
                <Route exact path="/" element={<FrontPage setfooter={setfooter} />} />
                <Route path="/market" element={<Market setfooter={setfooter} />} />
                {/* 로그인 시 마켓으로 이동하게 해놨음! 다른 곳으로 원하면
                바꿔도 됨*/}
                {!isLogin ? (
                    <Route path="/signin" element={<SignIn setfooter={setfooter} setIsLogin={setIsLogin} setLoginAccount={setLoginAccount} setWeb3={setWeb3} />} />
                ) : (
                    <Route path="/market" element={<Market setfooter={setfooter} />} />
                )}
            </Routes>
            {footer ? <Footer /> : null}
        </BrowserRouter>
    );
}

export default App;
