//ERC-20 KFT 토큰 클레임
import Web3 from "web3";
import dotenv from "dotenv";
import axios from "axios";
import { useState, useEffect } from "react";
import "./Claim.css";
import styled from "styled-components";
import claimMountain from "./background2.jpeg";
dotenv.config();

var KiFTTokenabi = require("./KiFTTokenabi");
var tokenAddress = process.env.REACT_APP_KIFT_TOKEN_CONTRACT_ADDRESS;

const ClaimContainer = styled.div`
  ::after {
    background: url(${claimMountain});
    background-repeat: no-repeat;
    background-size: 100%;
    /* background-position: 0px -260px; */
    opacity: 45% !important;
    top: 35px;
    left: 0px;
    position: absolute;
    z-index: -1;
    content: "";
    width: 100%;
    height: 111%;
    /* object-fit: contain; */
  }
`;

function Claim(isLogin) {
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState("");
  const [token, setToken] = useState(0);
  const [current, setCurrent] = useState(0);

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  useEffect(() => {
    async function logincall() {
      console.log(window.ethereum);
      if (window.ethereum === undefined) {
        setStatus("Please download and Login Metamask!");
      } else {
        if (typeof window.ethereum.providers === "undefined") {
          var metamaskProvider = window.ethereum;
        } else {
          var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
        }
        const web = new Web3(metamaskProvider);

        try {
          const accounts = await metamaskProvider.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0].toLowerCase());
          web.eth.getAccounts().then(async (account) => {
            await axios
              .post("http://localhost:3001/findUser", {
                //지갑의 Account와 동일한 DB속 유저의 기여포인트를 가져옵니다.
                address: account[0].toLowerCase(),
              })
              .then((result) => {
                var token = parseInt(result.data.data.points) * 7;
                setToken(parseInt(result.data.data.points));
                setStatus("Wallet Connected: You are eligible for " + token + " tokens");
              });
          });
        } catch (err) {
          console.log("Error: ", err);
        }

        try {
          const accounts = await metamaskProvider.request({
            method: "eth_requestAccounts",
          });
          const acc = accounts[0].toLowerCase();

          let contract = new web.eth.Contract(KiFTTokenabi, tokenAddress); //보유중인 KFT토큰 발란스를 가져옵니다.
          contract.methods
            .balanceOf(acc)
            .call()
            .then(function (bal) {
              const final = web.utils.toWei(String(bal), "ether");
              setCurrent(final);
            });
        } catch (err) {
          console.log("2nd try error: ", err);
        }
      }
    }
    logincall();
  }, []);

  function claimKiFTToken() {
    if (typeof window.ethereum !== "undefined") {
      //여러 wallet 플랫폼중 metaMask로 연결

      if (typeof window.ethereum.providers === "undefined") {
        var metamaskProvider = window.ethereum;
        console.log("메타마스크만 다운되어있는 것 처리===>", metamaskProvider);
      } else {
        var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
        console.log("여러개 지갑 처리 ==>", metamaskProvider);
      }

      try {
        const web = new Web3(metamaskProvider);
        web.eth.getAccounts().then(async (account) => {
          //계정 조회후 포인트 받아옴
          await axios
            .post("http://localhost:3001/findUser", {
              //DB속 기여도를 가져와서 기여도만큼 아래 수치계산을 하여 mintToken으로 토큰을 민팅해줍니다.
              address: account[0].toLowerCase(),
            })
            .then((result) => {
              console.log("how many got token======>>>>", result.data.data.points);
              return result.data.data.points;
            })
            .then(async (point) => {
              //포인트 있으면 민트 가능!!
              if (point > 0) {
                let numbersUserCanClaim = point * 7; // 기여도에 수치계산
                let contract = await new web.eth.Contract(KiFTTokenabi, process.env.REACT_APP_KIFT_TOKEN_CONTRACT_ADDRESS);
                await contract.methods
                  .mintToken(account[0], web.utils.toWei(String(numbersUserCanClaim), "ether")) //토큰 민팅
                  .send({
                    from: account[0],
                    gas: 100000,
                    gasPrice: "10000000000",
                  })
                  .then(async (receipt) => {
                    console.log(receipt);
                    if (receipt.blockHash) {
                      //민트 성공하면 디비 초기화 !!
                      await axios
                        .post("http://localhost:3001/initializePoints", {
                          address: account[0].toLowerCase(),
                        })
                        .then((result) => {
                          console.log("requesting initialize points to zero successed!!!! =====>>", result);
                          document.location.href = `/claim`;
                        });
                    } else {
                      //민트 실패
                      console.log("there's no points you got, it failed to claim Tokens");
                    }
                  })
                  .catch((err) => {
                    console.log("Error occured when minting Tokens!!!!!======>>", err);
                  });
              }
            })
            .catch((err) => {
              console.log("Error occured when sending request about POINTS!! ====>>", err);
            });
        });
      } catch (err) {
        console.log("Claim Token failed!!!!!", err);
      }
    }
  }
  console.log(current);
  return (
    <ClaimContainer className="claimPageContainer">
      {isLogin ? <div className="current">{current} KFT</div> : null}

      <div className="title_box">
        <div className="claimTitle"> Claim Your KiFT Tokens</div>

        {isLogin ? <div className="account">{"Your Address: \n" + account}</div> : null}
        <div className="amount">{status}</div>
        {token > 0 ? (
          <button className="claim" onClick={claimKiFTToken}>
            Claim Tokens
          </button>
        ) : (
          <button className="claim" disabled>
            {" "}
            No Claimable Tokens{" "}
          </button>
        )}
      </div>
    </ClaimContainer>
  );
}

export default Claim;
