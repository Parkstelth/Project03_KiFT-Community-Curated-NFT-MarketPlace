import Web3 from "web3";
import dotenv from "dotenv";
dotenv.config();
var KiFTTokenabi = require("./KiFTTokenabi");

function Claim() {
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
          let contract = await new web.eth.Contract(KiFTTokenabi, process.env.REACT_APP_KIFT_TOKEN_CONTRACT_ADDRESS);
          await contract.methods
            .mintToken(account[0], "1000000000000000000")
            .send({
              from: account[0],
              gas: 100000,
              gasPrice: "10000000000",
            })
            .then((receipt) => {
              console.log(receipt);
            })
            .catch((err) => {
              console.log("2", err);
            });
        });
      } catch (err) {
        console.log("1", err);
      }
    }
  }

  return (
    <div>
      <button onClick={claimKiFTToken}>클레임</button>
    </div>
  );
}

export default Claim;
