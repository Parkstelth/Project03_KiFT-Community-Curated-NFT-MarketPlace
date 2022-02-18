import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./Pages/FrontPage/frontpage";
import Market from "./Pages/MarketPage/Market";
import Curated from "./Pages/CuratedPage/Curated";
import SignIn from "./Pages/SigninPage/SignIn";
import Mypage from "./Pages/MyPage/MyPage";
import About from "./Pages/AboutPage/About";
import Claim from "./Pages/ClaimPage/Claim";
import ClaimForKlaytn from "./Pages/ClaimPageForKlaytn/ClaimForKlaytn";
import Search from "./Pages/SearchPage/Search";
import CreateNft from "./Pages/CreateNftPage/CreateNft";
import NotFound from "./Pages/NotFoundPage/notfound";
import Nav from "./Pages/FrontPage/Nav";
import Staking from "./Pages/StakingPage/Staking";
import StakingForKlaytn from "./Pages/StakingForKlaytnPage/StakingForKlaytn";
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
  <auto></auto>;
  function setfooter(e) {
    setFooter(e);
  }

  const setAccountListner = (provider) => {
    //계정 변경 감지 함수
    provider.on("accountsChanged", (_) => (window.location.href = "/"));
  };

  useEffect(() => {
    if (window.klaytn !== undefined && window.ethereum !== undefined) {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas.isApproved().then((result) => {
            if (result === true) {
              setAccountListner(window.klaytn);
              const caver = new Caver(window.klaytn);
              caver.klay.getAccounts().then(async (account) => {
                const headers = {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "*/*",
                };
                const params = new URLSearchParams();
                params.append("address", account[0].toLowerCase());
                await axios
                  .post("http://localhost:3001/klaytn/sign", params, {
                    // 로그인된 상태에서 한번도 Sign 페이지를 통해 로그인 안한 계정으로 변경할 시 app단으로 이동시키는 로직을 통해 db에 계정을 저장시킴
                    headers,
                  })
                  .then((result) => {
                    console.log(result);
                  })
                  .catch((err) => {
                    console.log(err, "is this what you want?");
                  });
                setLoginAccount(account[0].toLowerCase());
                setIsLogin(true);
                setIsKaikas(true);
              });
            } else {
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
                // window.ethereum이 있다면 여기서 window.ethereum이란 메타마스크 설치여부
                setAccountListner(metamaskProvider); //  지갑 감지 변화
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
                      await axios
                        .post("http://localhost:3001/sign", params, {
                          // 로그인된 상태에서 한번도 Sign 페이지를 통해 로그인 안한 계정으로 변경할 시 app단으로 이동시키는 로직을 통해 db에 계정을 저장시킴
                          headers,
                        })
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
                // win.focus();
                setLoginAccount("");
                setIsLogin(false);
              }
            }
          });
        } else {
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
            // window.ethereum이 있다면 여기서 window.ethereum이란 메타마스크 설치여부
            setAccountListner(metamaskProvider); //  지갑 감지 변화
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
            // win.focus();
            setLoginAccount("");
            setIsLogin(false);
          }
        }
      });
    } else if (window.klaytn !== undefined && window.ethereum === undefined) {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas.isApproved().then((result) => {
            if (result === true) {
              window.klaytn.on("accountsChanged", () => {
                window.location.href = "/";
              });
              const caver = new Caver(window.klaytn);
              caver.klay.getAccounts().then(async (account) => {
                const headers = {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "*/*",
                };
                const params = new URLSearchParams();
                params.append("address", account[0].toLowerCase());
                await axios
                  .post("http://localhost:3001/klaytn/sign", params, {
                    headers,
                  })
                  .then((result) => {
                    console.log(result);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                setLoginAccount(account[0].toLowerCase());
                setIsLogin(true);
                setIsKaikas(true);
              });
            } else {
              alert(`Please log in from our "Sign-in"`);
              window.location.href = "/signin";
            }
          });
        }
      });
    } else if (window.klaytn === undefined && window.ethereum !== undefined) {
      if (typeof window.ethereum.providers === "undefined") {
        var metamaskProvider = window.ethereum;
        console.log("메타마스크만 다운되어있는 것 처리===>", metamaskProvider);
      } else {
        var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
        console.log("여러개 지갑 처리 ==>", metamaskProvider);
      }
      console.log("ethereum provider=====>>>>", metamaskProvider);
      // window.ethereum이 있다면 여기서 window.ethereum이란 메타마스크 설치여부
      setAccountListner(metamaskProvider); //  지갑 감지 변화
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
            await axios
              .post("http://localhost:3001/sign", params, {
                headers,
              })
              .then((res) => {
                console.log(res);
              });
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please download Metamask or Kaikas Wallet");
      var win = window.open("https://metamask.io/download.html", "_blank");
      var win = window.open("https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi?hl=ko", "_blank");
      // win.focus();
    }
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
        <Route path="/mypage" element={<Mypage setIsLogin={setIsLogin} isKaikas={isKaikas} />} />
        <Route path="mypage/:id" element={<About loginAccount={loginAccount} isKaikas={isKaikas} />} />
        <Route path="/claim" element={<Claim />} />
        <Route path="/claimforklaytn" element={<ClaimForKlaytn />} />
        <Route path="/staking" element={<Staking />} />
        <Route path="/StakingForKlaytn" element={<StakingForKlaytn />} />
        <Route path="/create" element={<CreateNft setIsKaikas={setIsKaikas} isKaikas={isKaikas} />} />
        <Route path="/search" element={<Search />} />
        <Route path=":id" element={<NotFound />} />
      </Routes>
      {footer ? <Footer /> : null}
    </BrowserRouter>
  );
}

export default App;
