import "./SignIn.css";
import { useEffect } from "react";
import axios from "axios";

function SignIn({ setfooter, setLoginAccount, setIsLogin }) {
  useEffect(() => {
    setfooter(false);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum.providers === "undefined") {
      var metamaskProvider = window.ethereum;
      console.log("메타마스크만 다운되어있는 것 처리===>", metamaskProvider);
    } else {
      var metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
      console.log("여러개 지갑 처리 ==>", metamaskProvider);
    }

    try {
      const accounts = await metamaskProvider.request({
        method: "eth_requestAccounts",
      });

      setLoginAccount(accounts[0].toLowerCase());

      setIsLogin(true);
      setfooter(true);

      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
      };

      const params = new URLSearchParams();
      params.append("loginAddress", accounts[0].toLowerCase());

      await axios.post("http://localhost:3001/sign", params, { headers }).then((res) => {
        console.log(res);
      });

      document.location.href = "/market";
    } catch (e) {
      if (typeof window.ethereum === "undefined") {
        var win = window.open("https://metamask.io/download.html", "_blank");
        win.focus();
      } else {
        console.log("error! ", e);
      }
    }
  };

  return (
    <div className="signInPage">
      <h2 className="signInTitle">Sign in with your wallet for connecting KiFT</h2>
      <div>
        <button className="signInButton" onClick={() => connectWallet()}>
          Select a Wallet
        </button>
      </div>
    </div>
  );
}

export default SignIn;
