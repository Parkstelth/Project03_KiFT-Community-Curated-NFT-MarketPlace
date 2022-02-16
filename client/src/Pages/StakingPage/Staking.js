import Web3 from "web3";
import { useState, useEffect } from "react";
import dotenv from "dotenv";
import stakingAbi from "./stakingAbi";
import NotifyModal from "./Components/NotifyModal";
import "./Staking.css";
dotenv.config();

function Staking() {
  let KiFTTokenabi = require("./KiFTTokenabi");
  let stakingAbi = require("./stakingAbi");
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [inputData, setInputData] = useState("");
  const [stakingInputData, setStakingInputData] = useState("");
  const [stakingAmounts, setStakingAmounts] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [earnedAmounts, setEarnedAmounts] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [closebox, setClosebox] = useState(false);

  const stakingContract = process.env.REACT_APP_KIFT_STAKING_CONTRACT_ADDRESS;
  const KiFTContract = process.env.REACT_APP_KIFT_TOKEN_CONTRACT_ADDRESS;
  console.log(stakingContract, "this is it");
  const Kift_721_Contract_Address = process.env.REACT_APP_KIFT_721_CONTRACT_ADDRESS;
  console.log(Kift_721_Contract_Address);

  const closeModal = () => {
    setShowModal(false);
    setClosebox(false);
  };

  function openlink1() {
    var win = window.open(`https://rinkeby.etherscan.io/address/${KiFTContract}`, "_blank");
    win.focus();
  }

  function openlink2() {
    var win = window.open(`https://rinkeby.etherscan.io/address/${stakingContract}`, "_blank");
    win.focus();
  }

  const WithdrawlHandleChange = (e) => {
    setInputData(e.target.value);
    console.log("result of Input==========>>>>>", e.target.value);
  };
  const StakingHandleChange = (e) => {
    setStakingInputData(e.target.value);
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

  //스테이킹 출발!!
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
          if (result >= stakingInputData + "000000000000000000") {
            //어프루브된 수량과 똑같으면 바로 start Stake **
            // console.log("it's same");
            // console.log(result);
            // console.log(inputData + "000000000000000000");
          } else {
            //어프루브된 수량과 똑같지 않으면 approve again **
            // console.log(result);
            // console.log(inputData + "000000000000000000");
            await kiftContract.methods
              .approve(stakingContract, web.utils.toWei(String(stakingInputData), "ether"))
              .send({ from: account[0] })
              .then(console.log);
          }
          await web.eth.getAccounts().then((account) => {
            let stakeContract = new web.eth.Contract(stakingAbi, stakingContract.toLowerCase());
            console.log(stakingAbi);

            console.log(stakingContract, "this is it");
            console.log(stakeContract, "this is that");
            stakeContract.methods
              .stake(web.utils.toWei(String(stakingInputData), "ether"))
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
      <div className="headup">
        <div className="headup_name">S T A K I N G</div>
      </div>
      <div className="mainPool">
        {showModal && <NotifyModal showModal={showModal} closeModal={closeModal} message={message} closebox={closebox}></NotifyModal>}
        <div className="first_menu">
          <div className="st_logo">
            <img className="st_logoSet" src={"https://media.discordapp.net/attachments/886537798931349554/943063808937689168/92b4aecc6c396510.png"} />
            <div className="st_logoSet2">K</div>
          </div>
          <div className="info">
            <div className="info_name">Manual KFT</div>
            <div className="info_desc">Earn KFT stake KFT</div>
          </div>
          <div className="earned">
            <div className="earned_name">KFT Earned</div>
            <div className="earned_value">{earnedAmounts}</div>
          </div>
          <div className="staked">
            <div className="staked_name">My KFT Staked</div>
            <div className="staked_staked">{stakingAmounts}</div>
          </div>
          <div className="totalStaked">
            <div className="totalStaked_name">Total staked</div>
            <div className="totalStaked_desc">{totalSupply}</div>
          </div>
          <div className="mytoken">
            <div className="mytoken_name">My KFT balance</div>
            <div className="mytoken_desc">{balance}</div>
          </div>
        </div>
        <div className="second_menu">
          <div className="link_tap">
            <div className="tap1" onClick={() => openlink1()}>
              <div className="tap_name">See Token Info</div>
              <span class="material-icons">open_in_new</span>
            </div>
            <div className="tap1" onClick={() => openlink2()}>
              <div className="tap_name">View Contract</div>
              <span class="material-icons">open_in_new</span>
            </div>
            <div className="howto">
              <span class="material-icons setcolor">help_outline</span>
              <div className="howto_name">How to use</div>
            </div>
          </div>
          <div className="reward">
            <div className="reward_name">KFT EARNED</div>
            <div className="reward_value">{earnedAmounts}</div>
            <button className="reward_button" onClick={getReward}>
              Reward
            </button>
          </div>
          <div className="reward">
            <div className="reward_name">WITHDRAW</div>
            <input className="withdraw_value" placeholder="Amount" onChange={WithdrawlHandleChange} />
            <button className="reward_button" onClick={withdrawl}>
              Withdraw
            </button>
          </div>
          <div className="reward">
            <div className="reward_name">START STAKING</div>
            <input className="withdraw_value" placeholder="Amount" onChange={StakingHandleChange} />
            <button className="reward_button" onClick={startStaking}>
              Launch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;
