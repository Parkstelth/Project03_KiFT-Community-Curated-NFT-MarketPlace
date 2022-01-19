import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./Pages/FrontPage/frontpage";
import Market from "./Pages/MarketPage/Market";
import SignIn from "./Pages/SigninPage/SignIn";
import Mypage from "./Pages/MyPage/MyPage";
import About from "./Pages/AboutPage/About";
import NotFound from "./Pages/NotFoundPage/notfound";
import Nav from "./Pages/FrontPage/Nav";
import Footer from "./Pages/FrontPage/Footer";
import { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";

function App() {
  const [footer, setFooter] = useState(true);
  const [loginAccount, setLoginAccount] = useState("");
  const [loadWeb3, setWeb3] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [sellitem, setSellitem] = useState("");

  console.log("now account ===>", loginAccount);
  <auto></auto>;
  function setfooter(e) {
    setFooter(e);
  }
  //메타마스크 계정 변경 감지
  // useEffect(() => {
  //     async function listenMMAccount() {
  //         window.ethereum.on("accountsChanged", async function () {
  //             // Time to reload your interface with accounts[0]!
  //             const metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
  //             const web = new Web3(metamaskProvider);
  //             const accounts = await web.eth.getAccounts();
  //             // accounts = await web3.eth.getAccounts();
  //             console.log(accounts);
  //         });
  //     }
  //     listenMMAccount();
  // }, []);
  useEffect(() => {
    //son: 이거 건든적이 없는데 왜 밑줄 뜰까요? await 해주면 되나
    //만약 signin페이지에서 Web3(url) 을 window.ethereum 으로 안잡으면 밑에 조건문은 무효화?

    if (typeof window.ethereum !== "undefined") {
      //여러 wallet 플랫폼중 metaMask로 연결

      const metamaskProvider = window.ethereum.providers.find(
        (provider) => provider.isMetaMask
      );
      console.log("terr", metamaskProvider);
      // window.ethereum이 있다면 여기서 window.ethereum이란 메타마스크 설치여부
      try {
        const web = new Web3(metamaskProvider);
        web.eth.getAccounts().then(async (account) => {
          if (account.length === 0) {
            setLoginAccount("");
            setWeb3([]);
            setIsLogin(false);
          } else {
            setLoginAccount(account[0].toLowerCase());
            setWeb3(web);
            setIsLogin(true);

            const headers = {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "*/*",
            };
            const params = new URLSearchParams();
            params.append("loginAddress", account[0].toLowerCase());

            await axios
              .post("http://localhost:3001/sign", params, { headers })
              .then((res) => {
                console.log(res);
              });
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      var win = window.open("https://metamask.io/download.html", "_blank");
      win.focus();

      setLoginAccount("");
      setWeb3([]);
      setIsLogin(false);
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
        <Route
          path="/signin"
          element={
            <SignIn
              setfooter={setfooter}
              setIsLogin={setIsLogin}
              setLoginAccount={setLoginAccount}
              setWeb3={setWeb3}
            />
          }
        />
        <Route
          path="/mypage"
          element={<Mypage setIsLogin={setIsLogin} setSellitem={setSellitem} />}
        />
        <Route path="mypage/:id" element={<About />} />
        <Route path=":id" element={<NotFound />} />
      </Routes>
      {footer ? <Footer /> : null}
    </BrowserRouter>
  );
}

export default App;
