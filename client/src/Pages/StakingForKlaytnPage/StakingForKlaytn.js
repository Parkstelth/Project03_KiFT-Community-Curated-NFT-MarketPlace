//KIP-7 KFT 토큰 스테이킹

import { useState, useEffect } from "react";
import dotenv from "dotenv";
import NotifyModal from "./Components/NotifyModal";
import "./Staking.css";
import Caver from "caver-js";
dotenv.config();

function StakingForKlaytn() {
  let KiFTTokenabi = require("./KiFTTokenForKlaytnAbi");
  let stakingAbi = require("./stakingForKlaytnAbi");
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

  const stakingContract = process.env.REACT_APP_KIFT_Staking_FOR_KLAYTN_CONTRACT_ADDRESS;
  const KiFTContract = process.env.REACT_APP_KIFT_TOKEN_FOR_KLAYTN_CONTRACT_ADDRESS;

  const closeModal = () => {
    setShowModal(false);
    setClosebox(false);
  };

  function openlink1() {
    var win = window.open(`https://baobab.scope.klaytn.com/account/${KiFTContract}`, "_blank");
    win.focus();
  }

  function openlink2() {
    var win = window.open(`https://baobab.scope.klaytn.com/account/${stakingContract}`, "_blank");
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

  const reLoadEarned = async () => {
    //현재 스테이킹 관련 정보를 새로고침하는 함수
    if (window.klaytn) {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas.isApproved().then(async (result) => {
            if (result === true) {
              const caver = new Caver(window.klaytn);
              try {
                await window.klaytn.enable();

                caver.klay.getAccounts().then(async (account) => {
                  console.log(account);
                  let contract = new caver.klay.Contract(KiFTTokenabi, KiFTContract);
                  contract.methods
                    .balanceOf(account[0]) //현재KFT토큰의 보유량 새로고침
                    .call()
                    .then((amount) => {
                      setBalance(caver.utils.fromWei(String(amount), "ether"));
                    });
                });
              } catch (err) {
                console.log(err);
              }

              try {
                const caver = new Caver(window.klaytn);

                caver.klay.getAccounts().then(async (account) => {
                  let stakeContract = new caver.klay.Contract(stakingAbi, stakingContract);
                  console.log(stakingContract, "this is contract we want");
                  stakeContract.methods
                    .stakingValue(account[0]) //내 스테이킹중인 양 새로고침
                    .call()
                    .then((result) => {
                      setStakingAmounts(caver.utils.fromWei(String(result), "ether"));
                    });
                  stakeContract.methods
                    .totalSupply() //총 스테이킹 중인양 새로고침
                    .call()
                    .then((result) => {
                      setTotalSupply(caver.utils.fromWei(String(result), "ether"));
                    });

                  stakeContract.methods
                    .earned(account[0]) //현재 이자수익 새로고침
                    .call()
                    .then((result) => {
                      setEarnedAmounts(caver.utils.fromWei(String(result), "ether"));
                    });
                });
              } catch (err) {
                console.log(err);
              }
            }
          });
        }
      });
    } else {
      alert("there's no Kaikas");
      setShowModal(false);
    }
  };

  const getReward = async () => {
    //이자를 출금하는 함수
    setShowModal(true);
    setMessage(`Please sign the Wallet and wait until "Success!"`);
    if (window.klaytn) {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas.isApproved().then(async (result) => {
            if (result === true) {
              const caver = new Caver(window.klaytn);

              if (Number(earnedAmounts) > 0) {
                await caver.klay
                  .getAccounts()
                  .then(async (account) => {
                    let stakeContract = new caver.klay.Contract(stakingAbi, stakingContract);

                    stakeContract.methods
                      .getReward() //이자출금함수
                      .send({ from: account[0], gasPrice: 25000000000, gas: 210000 })
                      .then(() => {
                        setMessage("Compensate on KFT Success!");
                        document.location.href = `/stakingForKlaytn`;
                      })
                      .catch((err) => {
                        setClosebox(true);
                        setMessage(err.message);
                      });
                  })
                  .catch((err) => {
                    setClosebox(true);
                    setMessage(err.message);
                  });
              } else {
                setClosebox(true);
                setMessage("There is no KFT to be compensated!");
              }
            }
          });
        }
      });
    } else {
      alert("there's no Kaikas");
      setShowModal(false);
    }
  };

  //출금!!!
  const withdrawl = async () => {
    setShowModal(true);
    setMessage(`Please sign the Wallet and wait until "Success!"`);
    if (window.klaytn) {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas.isApproved().then(async (result) => {
            if (result === true) {
              const caver = new Caver(window.klaytn);

              await caver.klay
                .getAccounts()
                .then(async (account) => {
                  let stakeContract = new caver.klay.Contract(stakingAbi, stakingContract);
                  stakeContract.methods
                    .withdraw(caver.utils.toWei(String(inputData), "ether")) //출금함수
                    .send({ from: account[0], gasPrice: 25000000000, gas: 210000 })
                    .then(() => {
                      setMessage("Withdraw on KFT Success!");
                      document.location.href = `/stakingForKlaytn`;
                    })
                    .catch((err) => {
                      setClosebox(true);
                      setMessage(err.message);
                    });
                })
                .catch((err) => {
                  setClosebox(true);
                  setMessage(err.message);
                });
            }
          });
        }
      });
    } else {
      alert("there's no kaikas");
      setShowModal(false);
    }
  };

  //스테이킹 출발!!
  const startStaking = async () => {
    setShowModal(true);
    setMessage(`Please sign the Wallet and wait until "Next Sign"`);
    if (window.klaytn) {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas
            .isApproved()
            .then(async (result) => {
              if (result === true) {
                const caver = new Caver(window.klaytn);
                //수량 체크
                await caver.klay.getAccounts().then(async (account) => {
                  let kiftContract = new caver.klay.Contract(KiFTTokenabi, KiFTContract);
                  await kiftContract.methods
                    .allowance(account[0], stakingContract) //어프로브된 양 확인
                    .call({ from: account[0], gasPrice: 25000000000, gas: 210000 })
                    .then(async (result) => {
                      if (result >= caver.utils.toWei(String(stakingInputData), "ether")) {
                        //어프로브된 양확인하여 보내려는양과 비교하여 다시어프로브하여 가스비낭비 방지
                        let stakeContract = new caver.klay.Contract(stakingAbi, stakingContract);
                        stakeContract.methods
                          .stake(caver.utils.toWei(String(stakingInputData), "ether")) //스테이킹
                          .send({ from: account[0], gasPrice: 25000000000, gas: 210000 })
                          .then(() => {
                            setMessage("Stake on KiFT Success!");
                            document.location.href = `/stakingForKlaytn`;
                          })
                          .catch((err) => {
                            setClosebox(true);
                            setMessage(err.message);
                          });
                      } else {
                        await kiftContract.methods
                          .approve(stakingContract, caver.utils.toWei(String(stakingInputData), "ether")) //어프로브가 부족하여 어프로브작동
                          .send({ from: account[0], gasPrice: 25000000000, gas: 210000 })
                          .then(async () => {
                            setMessage(`Please Next sign the Wallet and wait until "Success!"`);
                            let stakeContract = new caver.klay.Contract(stakingAbi, stakingContract);
                            await stakeContract.methods
                              .stake(caver.utils.toWei(String(stakingInputData), "ether")) //스테이킹
                              .send({ from: account[0], gasPrice: 25000000000, gas: 210000 })
                              .then(() => {
                                setMessage("Stake on KFT Successed!");
                                document.location.href = `/stakingForKlaytn`;
                              })
                              .catch((err) => {
                                setClosebox(true);
                                setMessage(err.message);
                              });
                          })
                          .catch((err) => {
                            setClosebox(true);
                            setMessage(err.message);
                          });
                      }
                    });
                });
              }
            })
            .catch((err) => {
              setClosebox(true);
              setMessage(err.message);
            });
        }
      });
    } else {
      alert("there's no Kaikas!!!!");
      setShowModal(false);
    }
  };

  useEffect(async () => {
    if (window.klaytn) {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas.isApproved().then(async (result) => {
            if (result === true) {
              const caver = new Caver(window.klaytn);
              try {
                await window.klaytn.enable();

                caver.klay.getAccounts().then(async (account) => {
                  console.log(account);
                  let contract = new caver.klay.Contract(KiFTTokenabi, KiFTContract);
                  contract.methods
                    .balanceOf(account[0])
                    .call()
                    .then((amount) => {
                      setBalance(caver.utils.fromWei(String(amount), "ether"));
                    });
                });
              } catch (err) {
                console.log(err);
              }

              try {
                const caver = new Caver(window.klaytn);

                caver.klay.getAccounts().then(async (account) => {
                  let stakeContract = new caver.klay.Contract(stakingAbi, stakingContract);
                  console.log(stakingContract, "this is contract we want");
                  stakeContract.methods
                    .stakingValue(account[0])
                    .call()
                    .then((result) => {
                      setStakingAmounts(caver.utils.fromWei(String(result), "ether"));
                    });
                  stakeContract.methods
                    .totalSupply()
                    .call()
                    .then((result) => {
                      setTotalSupply(caver.utils.fromWei(String(result), "ether"));
                    });

                  stakeContract.methods
                    .earned(account[0])
                    .call()
                    .then((result) => {
                      setEarnedAmounts(caver.utils.fromWei(String(result), "ether"));
                    });
                });
              } catch (err) {
                console.log(err);
              }
            }
          });
        }
      });
    } else {
      alert("there's no Kaikas");
      setShowModal(false);
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
              <span className="material-icons">open_in_new</span>
            </div>
            <div className="tap1" onClick={() => openlink2()}>
              <div className="tap_name">View Contract</div>
              <span className="material-icons">open_in_new</span>
            </div>
            <div className="howto">
              <span className="material-icons setcolor">refresh</span>
              <div className="howto_name" onClick={reLoadEarned}>
                Refresh All
              </div>
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

export default StakingForKlaytn;
