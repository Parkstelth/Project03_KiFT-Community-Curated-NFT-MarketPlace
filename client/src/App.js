import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./Pages/FrontPage/frontpage";
import Market from "./Pages/MarketPage/Market";
import Curated from "./Pages/CuratedPage/Curated";
import SignIn from "./Pages/SigninPage/SignIn";
import Mypage from "./Pages/MyPage/MyPage";
import About from "./Pages/AboutPage/About";
import Claim from "./Pages/ClaimPage/Claim";
import Search from "./Pages/SearchPage/Search";
import CreateNft from "./Pages/CreateNftPage/CreateNft";
import NotFound from "./Pages/NotFoundPage/notfound";
import Nav from "./Pages/FrontPage/Nav";
import Footer from "./Pages/FrontPage/Footer";
import { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
import Caver from "caver-js";

function App() {
  const [footer, setFooter] = useState(true);
  const [loginAccount, setLoginAccount] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isKaikas, setIsKaikas] = useState(false);

  console.log("now account ===>", loginAccount);
  console.log("now account ===>", isKaikas);
  console.log("now account ===>", isLogin);
  <auto></auto>;
  function setfooter(e) {
    setFooter(e);
  }

  const setAccountListner = (provider) => {
    provider.on("accountsChanged", (_) => (window.location.href = "/"));
  };

  useEffect(() => {
    console.log("이게체크해야할것", window.klaytn.selectedAddress);

    async function fetchData() {
      console.log(isKaikas, "==========================================");
      if (window.klaytn.selectedAddress !== undefined) {
        console.log("아니 근데 이게 먹히긴합니까???????????????????????????????????");
        // //카이카스 지갑 연결이 되어있으면

        // window.klaytn.on("accountsChanged", function () {
        //   window.location.href = "/";
        // });
        const caver = new Caver(window.klaytn);
        caver.klay.getAccounts().then(async (account) => {
          console.log(account, "this is accountasefijaf;liasawef;oialsejf;laisjefl;ajseflasjef;lasej");
          setLoginAccount(account);
          // await window.klaytn.enable();
          // await setLoginAccount(window.klaytn.selectedAddress);
          await setIsLogin(true);
          await setIsKaikas(true);
        });
      } else {
        //카이카스 지갑 연결이 되어있지 않으면

        if (typeof window.ethereum !== "undefined") {
          //여러 wallet 플랫폼중 metaMask로 연결

          if (typeof window.ethereum.providers === "undefined") {
            var metamaskProvider = window.ethereum;
            console.log("메타마스크만 다운되어있는 것 처리===>", metamaskProvider);
          } else {
            var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
            console.log("여러개 지갑 처리 ==>", metamaskProvider);
          }
          console.log("ethereum provider=====>>>>", metamaskProvider);
          // window.ethereum이 있다면 여기서 window.ethereum이란  메타마스크 설치여부
          await setAccountListner(metamaskProvider); //  지갑 감지 변화
          try {
            //메타마스크 지갑 처리
            const web = new Web3(metamaskProvider);
            web.eth.getAccounts().then(async (account) => {
              if (account.length === 0) {
                setLoginAccount("");
                setIsLogin(false);
              } else {
                setLoginAccount(account[0].toLowerCase());
                setIsLogin(true);

                const headers = {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "*/*",
                };
                const params = new URLSearchParams();
                params.append("loginAddress", account[0].toLowerCase());

                await axios.post("http://localhost:3001/sign", params, { headers }).then((res) => {
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
          setIsLogin(false);
        }
      }
    }
    fetchData();
    console.log(isKaikas, "alisjeflaifjailsefjasil;eajsef;ilajse;asifeja;sefilj");
    console.log(loginAccount, "a;skjf;laisejf;laisjeflsiajec;alisejf;ilasejf;lasijef");
  }, []);

  return (
    <BrowserRouter>
      <Nav isLogin={isLogin} isKaikas={isKaikas} />
      <Routes>
        <Route exact path="/" element={<FrontPage setfooter={setfooter} />} />
        <Route path="/market" element={<Market setfooter={setfooter} />} />
        {/* 로그인 시 마켓으로 이동하게 해놨음! 다른 곳으로 원하면 
                바꿔도 됨*/}
        <Route path="/curated" element={<Curated />} />
        <Route
          path="/signin"
          element={
            <SignIn setfooter={setfooter} setIsLogin={setIsLogin} setLoginAccount={setLoginAccount} setIsKaikas={setIsKaikas} isKaikas={isKaikas} />
          }
        />
        <Route path="/mypage" element={<Mypage setIsLogin={setIsLogin} isKaikas={isKaikas} setIsKaikas={setIsKaikas} />} />
        <Route path="mypage/:id" element={<About loginAccount={loginAccount} isKaikas={isKaikas} />} />
        <Route path="/claim" element={<Claim />} />
        <Route path="/create" element={<CreateNft isKaikas={isKaikas} />} />
        <Route path="/search" element={<Search />} />
        <Route path=":id" element={<NotFound />} />
      </Routes>
      {footer ? <Footer /> : null}
    </BrowserRouter>
  );
}

export default App;
