import Web3 from "web3";
import Loading from "../../component/assets/Loading";
import NotifyModal from "./Components/NotifyModal";
import dotenv from "dotenv";
import { useState, useEffect } from "react";
import "./Staking.css";
dotenv.config();

var KiFTTokenabi = require("./KiFTTokenabi");
var stakingAbi = require("./stakingAbi");
var tokenAddress = process.env.REACT_APP_KIFT_TOKEN_CONTRACT_ADDRESS;
var stakingAddress = process.env.REACT_APP_KIFT_STAKING_CONTRACT_ADDRESS;

function Staking() {
  const [value, SetValue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [closebox, setClosebox] = useState(false);

  const closeModal = () => {
    setShowModal(false);
    setClosebox(false);
  };

  const onChange = (e) => {
    SetValue(e.target.value);
  };

  function openlink1() {
    var win = window.open(`https://rinkeby.etherscan.io/address/${tokenAddress}`, "_blank");
    win.focus();
  }

  function openlink2() {
    var win = window.open(`https://rinkeby.etherscan.io/address/${stakingAddress}`, "_blank");
    win.focus();
  }

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
            <div className="earned_value">0</div>
          </div>
          <div className="staked">
            <div className="staked_name">KFT Staked</div>
            <div className="staked_staked">0</div>
          </div>
          <div className="totalStaked">
            <div className="totalStaked_name">Total staked</div>
            <div className="totalStaked_desc">0</div>
          </div>
          <div className="mytoken">
            <div className="mytoken_name">My KFT balance</div>
            <div className="mytoken_desc">0</div>
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
            <div className="reward_value">0</div>
            <button className="reward_button">Reward</button>
          </div>
          <div className="reward">
            <div className="reward_name">WITHDRAW</div>
            <input className="withdraw_value" />
            <button className="reward_button">Withdraw</button>
          </div>
          <div className="reward">
            <div className="reward_name">START STAKING</div>
            <input className="withdraw_value" />
            <button className="reward_button">Launch</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;
