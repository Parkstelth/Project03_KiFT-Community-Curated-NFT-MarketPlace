import "./About.css";
import { Accordion } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import NotifyModal from "./Components/NotifyModal.js";
import Web3 from "web3";
var KiFTabi = require("./KiFTabi");
var erc721abi = require("./erc721abi");

function About() {
  const [sellitem, setSellitem] = useState([]);
  const [priceSellerPut, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [traits, setTraits] = useState([]);
  const [message, setMessage] = useState("");
  const [approve, setApprove] = useState(false);
  const URLparam = document.location.href.split("mypage/")[1];

  const closeModal = () => {
    setShowModal(false);
  };

  const onChange = (e) => {
    setPrice(e.target.value);
  };

  async function ListItem() {
    setMessage("");
    setShowModal(true);
    setApprovalAll();
  }

  async function changePrice() {
    setMessage("");
    setShowModal(true);
    //가격변경 함수가 추가된 솔리디티 함수 작동
    // 솔리디티 내 가격 변화 함수 작성
    // vscode abi 변경
    // setapprovalall 함수 복제
    // 복제 낸 내부속 가격변화함수 새로 작성후 주입
  }

  useEffect(() => {
    loadSellItem();
  }, []);

  function runEtherscan(e) {
    var win = window.open(
      `https://rinkeby.etherscan.io/address/${e.target.outerText}`,
      "_blank"
    );
    win.focus();
  }

  async function loadSellItem() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    // const params = new URLSearchParams();
    await axios
      .post(
        "http://localhost:3001/searchNFT",
        {
          openseaId: URLparam,
        },
        headers
      )
      .then((result) => {
        setSellitem(result.data);
        setTraits(result.data.traits);
      });
  }

  async function listNFTOnTheMarket() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    await axios
      .post(
        "http://localhost:3001/listItem",
        {
          openseaId: URLparam,
          price: priceSellerPut,
          isSale: true,
        },
        headers
      )
      .then((result) => {
        if (result.status === 200) {
          setMessage("Upload your NFT Success!");
          return result;
        }
      })
      .catch((e) => {
        //에러를 프론트로 띄워주세요
        setMessage("listItem request failed! you can check error below");
      });
  }

  async function setApprovalAll() {
    if (typeof window.ethereum !== "undefined") {
      //여러 wallet 플랫폼중 metaMask로 연결

      const metamaskProvider = await window.ethereum.providers.find(
        (provider) => provider.isMetaMask
      );
      try {
        const web = new Web3(metamaskProvider);
        web.eth.getAccounts().then(async (account) => {
          let contract = await new web.eth.Contract(
            KiFTabi,
            "0x2F5b9e3c11aFB60A582777dde9D1D4F5B921Fe7a"
          );
          await contract.methods
            .isApprovedForAll(
              sellitem.contract_address,
              "0x2F5b9e3c11aFB60A582777dde9D1D4F5B921Fe7a"
            )
            .call({
              from: account[0],
            })
            .then(async (result) => {
              console.log("now approve", result);
              if (result) {
                //어프로브 금지
                await createItem();
              } else {
                //어프로브 시작
                let contract = await new web.eth.Contract(
                  erc721abi,
                  sellitem.contract_address
                );
                await contract.methods
                  .setApprovalForAll(
                    "0x2F5b9e3c11aFB60A582777dde9D1D4F5B921Fe7a", //setapproval 받을 kift.sol 배포 주소
                    true
                  )
                  .send({
                    from: account[0],
                    gas: 100000,
                    gasPrice: "10000000000",
                  })
                  .then((result) => {
                    setMessage("Approve to KiFT Success!", result.blockHash);
                    console.log("This is success result--->>>", result);
                    console.log("This is Hash ", result.blockHash);
                    return result;
                  })
                  .then(async (result) => {
                    if (result) {
                      await createItem();
                    }
                  })
                  .catch((err) => {
                    console.log("this is whole error message", err);
                    console.log("this is error message----->>>>", err.message);
                    setMessage(err.message);
                  });
              }
            });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function createItem() {
    if (typeof window.ethereum !== "undefined") {
      //여러 wallet 플랫폼중 metaMask로 연결

      const metamaskProvider = await window.ethereum.providers.find(
        (provider) => provider.isMetaMask
      );
      // window.ethereum이 있다면 여기서 window.ethereum이란 메타마스크 설치여부
      try {
        const web = new Web3(metamaskProvider);

        web.eth.getAccounts().then(async (account) => {
          let contract = await new web.eth.Contract(
            KiFTabi,
            "0x2F5b9e3c11aFB60A582777dde9D1D4F5B921Fe7a"
          );
          await contract.methods
            .createMarketItem(
              sellitem.contract_address,
              sellitem.NFT_Token_id,
              web.utils.toWei(String(priceSellerPut), "ether")
            )
            .send({
              from: account[0],
              gas: 500000,
              gasPrice: "2450000000",
            })
            .then(async (result) => {
              console.log(
                "itemId",
                result.events.MarketItemCreated.returnValues.itemId
              );
              await setMessage("upload blockChain to KiFT Success!");
              await listNFTOnTheMarket();
            });
        });
      } catch (err) {
        setMessage("upload blockChain to KiFT Fail!");
      }
    }
  }

  return (
    <div className="about_main">
      {showModal && (
        <NotifyModal
          showModal={showModal}
          closeModal={closeModal}
          message={message}
        ></NotifyModal>
      )}

      <div className="sell_bar"></div>
      <div className="middle2">
        <div>
          <div className="nft_name_box">
            <div className="nft_name">{sellitem.name}</div>
            <div className="nft_owned">
              Owned by <span className="owned_address">you</span>
            </div>
          </div>

          <img className="nft_image" src={sellitem.image_url} />
        </div>
        <div className="simple_description">
          <div className="center_description">
            <div className="description_title">
              Description
              <div className="price_input_box">
                {sellitem.isSale ? (
                  <>
                    {" "}
                    <input
                      className="price"
                      placeholder={`Now : ${sellitem.price} ETH`}
                      value={priceSellerPut}
                      onChange={onChange}
                    />
                    <button className="sell_button" onClick={changePrice}>
                      Change Price
                    </button>
                  </>
                ) : (
                  <>
                    {" "}
                    <input
                      className="price"
                      placeholder="Amount"
                      value={priceSellerPut}
                      onChange={onChange}
                    />
                    <button className="sell_button" onClick={ListItem}>
                      Sell
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="description2">
              created by{" "}
              <span
                onClick={(e) => runEtherscan(e)}
                className="description_address"
              >
                {"패치중"}
              </span>
            </div>
          </div>
          <div className="center_properties">
            <div className="properties_title">Properties</div>
            <div className="properties">
              {traits.map((prop, index) => {
                return (
                  <div className="props" key={index}>
                    <div className="props_1">{prop.trait_type}</div>
                    <div className="props_2">{prop.value}</div>
                    <div className="props_3">100% have this trait</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="center_details">
            <div className="details_title">Details</div>
            <div className="details">
              <div className="detail_menu">
                <span>contract Address</span>
                <span
                  className="right_end addoption"
                  onClick={(e) => runEtherscan(e)}
                >
                  {sellitem.contract_address}
                </span>
              </div>
              <div className="detail_menu">
                <span>token id</span>
                <span className="right_end">{sellitem.NFT_Token_id}</span>
              </div>
              <div className="detail_menu">
                <span>token standard</span>
                <span className="right_end">{sellitem.schema_name}</span>
              </div>
              <div className="detail_menu">
                <span>blockchain</span>
                <span className="right_end">Rinkeby</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item className="acc_item" eventKey="0">
          <Accordion.Header className="acc_header">
            Price History
          </Accordion.Header>
          <Accordion.Body>NOT UPDATING..</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default About;
