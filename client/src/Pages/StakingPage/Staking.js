import Web3 from "web3";
import { useState, useEffect } from "react";
import dotenv from "dotenv";
import stakingAbi from "./stakingAbi";
dotenv.config();

function Staking() {
  let KiFTTokenabi = require("./KiFTTokenabi");
  let stakingAbi = require("./stakingAbi");
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [inputData, setInputData] = useState("");
  const [stakingAmounts, setStakingAmounts] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [earnedAmounts, setEarnedAmounts] = useState("");

  const stakingContract = process.env.REACT_APP_KIFT_STAKING_CONTRACT_ADDRESS;
  const KiFTContract = process.env.REACT_APP_KIFT_TOKEN_CONTRACT_ADDRESS;
  console.log(stakingContract, "this is it");
  const Kift_721_Contract_Address = process.env.REACT_APP_KIFT_721_CONTRACT_ADDRESS;
  console.log(Kift_721_Contract_Address);

  const handleChange = (e) => {
    setInputData(e.target.value);
    console.log("result of Input==========>>>>>", e.target.value);
  };

  const getReward = async () => {
    if (typeof window.ethereum.providers === "undefined") {
      var metamaskProvider = window.ethereum;
    } else {
      var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    }
    const web = new Web3(metamaskProvider);

    //본인이 스테이킹 한 양을 체크
    await web.eth.getAccounts().then(async (account) => {
      let stakeContract = new web.eth.Contract(stakingAbi, stakingContract.toLowerCase());
      stakeContract.methods
        .getReward()
        .send({ from: account[0] })
        .then((result) => {
          console.log(result);
        });
    });
  };

  //출금!!!
  const withdrawl = async () => {
    if (typeof window.ethereum.providers === "undefined") {
      var metamaskProvider = window.ethereum;
    } else {
      var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    }
    const web = new Web3(metamaskProvider);

    await web.eth.getAccounts().then(async (account) => {
      console.log(web.utils.toWei(String(inputData), "ether"));

      let stakeContract = new web.eth.Contract(stakingAbi, stakingContract.toLowerCase());
      stakeContract.methods
        .withdraw(web.utils.toWei(String(inputData), "ether"))
        .send({ from: account[0] })
        .then((result) => {
          console.log(result);
        });
    });
  };

  const startStaking = async () => {
    if (typeof window.ethereum.providers === "undefined") {
      var metamaskProvider = window.ethereum;
    } else {
      var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    }
    const web = new Web3(metamaskProvider);

    //수량 체크
    await web.eth.getAccounts().then(async (account) => {
      let kiftContract = new web.eth.Contract(KiFTTokenabi, KiFTContract);
      console.log(kiftContract.methods);

      await kiftContract.methods
        .allowance(account[0], stakingContract.toLowerCase())
        .call({ from: account[0] })
        .then(async (result) => {
          if (result >= inputData + "000000000000000000") {
            //어프루브된 수량과 똑같으면 바로 start Stake **
            // console.log("it's same");
            // console.log(result);
            // console.log(inputData + "000000000000000000");
          } else {
            //어프루브된 수량과 똑같지 않으면 approve again **
            // console.log(result);
            // console.log(inputData + "000000000000000000");
            await kiftContract.methods
              .approve(stakingContract, web.utils.toWei(String(inputData), "ether"))
              .send({ from: account[0] })
              .then(console.log);
          }
          await web.eth.getAccounts().then((account) => {
            let stakeContract = new web.eth.Contract(stakingAbi, stakingContract.toLowerCase());
            console.log(stakingAbi);

            console.log(stakingContract, "this is it");
            console.log(stakeContract, "this is that");
            stakeContract.methods
              .stake(web.utils.toWei(String(inputData), "ether"))
              .send({ from: account[0] })
              .then(console.log);
          });
        });
    });

    /* //스테이킹 전 어프루브 날리기
    await web.eth.getAccounts().then((account) => {
      let kiftContract = new web.eth.Contract(KiFTTokenabi, KiFTContract);
      console.log(kiftContract);
      kiftContract.methods
        .approve(stakingContract, web.utils.toWei(String(inputData), "ether"))
        .send({ from: account[0] })
        .then(console.log);
    }); */
  };

  useEffect(async () => {
    if (typeof window.ethereum.providers === "undefined") {
      var metamaskProvider = window.ethereum;
    } else {
      var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    }
    const web = new Web3(metamaskProvider);

    //키프트 토큰의 발란스 체크
    try {
      const accounts = await metamaskProvider.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0].toLowerCase());

      web.eth.getAccounts().then((account) => {
        let kiftContract = new web.eth.Contract(KiFTTokenabi, KiFTContract);
        kiftContract.methods
          .balanceOf(account[0].toLocaleLowerCase())
          .call()
          .then((amount) => {
            setBalance(web.utils.fromWei(String(amount), "ether"));
          });
      });
    } catch (err) {
      console.log(err);
    }

    try {
      web.eth.getAccounts().then((account) => {
        let stakeContract = new web.eth.Contract(stakingAbi, stakingContract.toLowerCase());
        //본인이 스테이킹 한 양을 체크
        stakeContract.methods
          .stakingValue(account[0].toLowerCase())
          .call()
          .then((result) => {
            console.log(result, "this is waht i wnat /1!!!!!");
            setStakingAmounts(web.utils.fromWei(String(result), "ether"));
          });

        //전체 스테이킹 양 체크!!!!
        stakeContract.methods
          .totalSupply()
          .call()
          .then((result) => {
            console.log(result, "this is waht i wnat /1!!!!!asdfkj;asilfjsd;ifja;df");
            setTotalSupply(web.utils.fromWei(String(result), "ether"));
          });

        //본인의 수익 체크 !!!!
        stakeContract.methods
          .earned(account[0])
          .call()
          .then((result) => {
            console.log(result, "Earned!!!!!!");
            setEarnedAmounts(web.utils.fromWei(String(result), "ether"));
          });
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div>
      <div className="myAccount">myAccount {account}</div>
      <div className="balanceOf">asdfasdf {balance}</div>
      <div className="totalSupply">총스테이킹량 {totalSupply}</div>
      <div className="myValue">내 스테이킹량 {stakingAmounts}</div>
      <div className="nowReward">현재 스테이킹 수익{earnedAmounts}</div>
      <div>
        <input className="stakingValue" onChange={handleChange} />
        <button className="start" onClick={startStaking}>
          스테이킹발사
        </button>
        <button className="start" onClick={getReward}>
          리워드 발급
        </button>
        <button className="start" onClick={withdrawl}>
          스테이킹 회수
        </button>
      </div>
    </div>
  );
}

export default Staking;
