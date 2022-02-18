import "./MyPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Loading from "../../component/assets/Loading";
import styled from "styled-components";
import Caver from "caver-js";
var erc721abi = require("./erc721abi");
var kip17abi = require("./kip17abi");

function MyPage({ setIsLogin, isKaikas, setIsKaikas }) {
  const [data, setData] = useState([]);
  const [nowAccount, setNowAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [specialColor, setColor] = useState("");
  const [regdate, setRegdate] = useState("");
  const [transTo, setTransTo] = useState("");
  const [message, setMessage] = useState("");
  const [inputbox, setInputbox] = useState(false);
  const [transloading, setTransloading] = useState(false);
  // const [isKaikas, setIsKaikas] = useState(false);

  const ProfileCircle = styled.div`
    background-color: #${specialColor};
    border: 8px solid white;
    height: 7rem;
    width: 7rem;
    border-radius: 43%;
  `;

  async function getKaikas_AllNft(account) {
    //보유 클레이튼 NFT들의 컨트랙트 주소를 받아오기 위해 서버에 크롤링을 요청하는 함수
    let contracts = [];
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    await axios
      .post(
        "http://localhost:3001/klaytn/crolling",
        {
          account: account,
        },
        headers
      )
      .then(async (result) => {
        contracts = result.data;
      });
    return contracts;
  }

  function transferToInput(e) {
    setTransTo(e.target.value);
  }

  async function transferStart(item) {
    //NFT 전송 함수
    setInputbox(true);

    if (transTo !== "" && transTo.slice(0, 2) === "0x" && transTo.length === 42) {
      await setTransloading(true);
      await transferTo(item);
      await setMessage(`Please wait until "Success!"`);
    } else {
      await setMessage("");
    }
  }

  const fetchNFTs = async () => {
    //보유중인 링크비 NFT들을 불러오는 함수
    const web = new Web3(window.ethereum);
    await web.eth
      .getAccounts()
      .then((account) => {
        setIsLogin(true);
        console.log("this is your account=====>", account);
        return account;
      })
      .then(async (account) => {
        await axios.get(`https://testnets-api.opensea.io/assets?owner=${account}`).then(async (result) => {
          //오픈씨 API를 사용한 보유NFT 응답
          setData(result.data.assets);
          setNowAccount(account);
          setLoading(false);
          console.log("opensea retrieve assets", result);
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
          };
          await axios
            .post(
              "http://localhost:3001/findUser", //현재 링크비 Address의 DB를 확인하여 응답
              {
                address: account[0].toLowerCase(),
              },
              headers
            )
            .then(async (user) => {
              const data = user.data.data;
              console.log("just data ---------> ", data);
              setRegdate(data.createdAt.slice(0, 10)); //유저가 웹에서 최초로그인한(등록) 정보를 불러와 State로 저장
              return data; //유저 데이터를 다시 리턴
            })
            .then((data) => {
              result.data.assets.map(async (item) => {
                //오픈씨로 부터 받은 보유NFT들을 DB에 저장하도록 요청
                const headers = {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                };
                await axios
                  .post(
                    "http://localhost:3001/NFT",
                    {
                      owner: data._id,
                      name: item.name,
                      contract_address: item.asset_contract.address,
                      asset_contract_type: item.asset_contract.asset_contract_type,
                      schema_name: item.asset_contract.schema_name,
                      description: item.description,
                      NFT_Token_id: item.token_id,
                      createdAt: item.collection.created_date,
                      image_url: item.image_url,
                      creator_address: item.creator.address,
                      openseaId: item.id,
                      traits: item.traits,
                    },
                    headers
                  )
                  .then((result) => {
                    console.log("this is result from axios/NFT ===>", result);
                    return result;
                  })
                  .catch((err) => {
                    return err;
                  });
              });
            })
            .catch((err) => {
              console.log(err);
              return err;
            });
        });
      });
  };

  async function transferTo(item) {
    await setMessage("");
    await setInputbox(true);

    if (isKaikas === false) {
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

          web.eth
            .getAccounts()
            .then(async (account) => {
              console.log("test", item);
              let contract = await new web.eth.Contract(erc721abi, item.asset_contract.address);
              await contract.methods
                .transferFrom(account[0], transTo, item.token_id) //전송 함수
                .send({
                  from: account[0],
                  gas: 500000,
                  gasPrice: "2450000000",
                })
                .then(async (result) => {
                  await setMessage("Your NFT Item transfer Success!");
                  await transferNFTOnTheMarket(result.from, transTo, item);
                  return result;
                })
                .then(async (result) => {
                  await changeOwner(item);
                })
                .catch((err) => {
                  setTransloading(false);
                  setMessage(err.message);
                });
            })
            .catch((err) => {
              console.log("this is whole error message", err);
              console.log("this is error message----->>>>", err.message);
              setTransloading(false);
              setMessage(err.message);
            });
        } catch (err) {
          setTransloading(false);
          setMessage(err.message);
        }
      }
    } else {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas.isApproved().then(async (result) => {
            if (result === true) {
              try {
                const caver = new Caver(window.klaytn);
                caver.klay
                  .getAccounts()
                  .then(async (account) => {
                    let contract = await new caver.klay.Contract(kip17abi, item.contract_address);
                    var hex = parseInt(item.NFT_Token_id.slice(2), 16);
                    await contract.methods
                      .transferFrom(account[0], transTo, hex)
                      .send({
                        from: account[0],
                        gas: 500000,
                        gasPrice: "25000000000",
                      })
                      .then(async (result) => {
                        await setMessage("Your NFT Item transfer Success!");
                        await transferNFTOnTheMarket(result.from, transTo, item); //해당 아이템 히스토리에 전송기록을 저장시키는 함수 작동
                        return result;
                      })
                      .then(async (result) => {
                        await changeOwner(item); //DB에 저장되어있는 NFT오너주인도 변경
                      })
                      .catch((err) => {
                        setTransloading(false);
                        setMessage(err.message);
                      });
                  })
                  .catch((err) => {
                    console.log("this is whole error message", err);
                    console.log("this is error message----->>>>", err.message);
                    setTransloading(false);
                    setMessage(err.message);
                  });
              } catch (err) {
                setTransloading(false);
                setMessage(err.message);
              }
            } else {
              setMessage("Please re-Log in Kaikas!");
            }
          });
        } else {
          setMessage("Please Log in Kaikas!");
        }
      });
    }
  }

  async function transferNFTOnTheMarket(from, to, item) {
    //해당하는 아이템의 히스토리에 전송기록을 남기기위해 서버에 요청을 보냄
    if (isKaikas === false) {
      //카이카스 상태에 따라 아래에서 처리
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      await axios
        .post(
          "http://localhost:3001/listItemOntransfer", //링크비 NFT에 히스토리 추가
          {
            openseaId: item.id,
            to: to,
            from: from,
          },
          headers
        )
        .then((result) => {
          if (result.status === 200) {
            setMessage("Transfer Success!");
          }
        })
        .catch((e) => {
          //에러를 프론트로 띄워주세요
          setMessage("Your NFT Item transfer log DB failed! You can check error below");
        });
    } else {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      await axios
        .post(
          "http://localhost:3001/klaytn/listItemOntransfer", //클레이튼 NFT에 히스토리 추가
          {
            openseaId: item.openseaId,
            to: to,
            from: from,
          },
          headers
        )
        .then((result) => {
          if (result.status === 200) {
            setMessage("Transfer Success!");
          }
        })
        .catch((e) => {
          //에러를 프론트로 띄워주세요
          setMessage("Your NFT Item transfer log DB failed! You can check error below");
        });
    }
  }

  async function changeOwner(item) {
    //DB에서 NFT주인을 변경한다.
    if (isKaikas === false) {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      await axios
        .post(
          "http://localhost:3001/changeOwnerAndOwnedNFTs",
          {
            address: transTo.toLowerCase(),
            openseaId: item.id,
          },
          headers
        )
        .then((result) => {
          setTransloading(false);
          console.log("After changeownerandownedNFTS ==========================");
          console.log("fetching changeOwnerAndOwnedNFTs API!===>>", result);
          document.location.href = `/mypage`;
        })
        .catch((err) => {
          setTransloading(false);
          console.log("fetching changeOwnerAndOwnedNFTs API FAILED!!!! ===>", err);
        });
    } else {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      await axios
        .post(
          "http://localhost:3001/klaytn/changeOwnerAndOwnedNFTs",
          {
            address: transTo.toLowerCase(),
            openseaId: item.openseaId,
          },
          headers
        )
        .then((result) => {
          setTransloading(false);
          console.log("After changeownerandownedNFTS ==========================");
          console.log("fetching changeOwnerAndOwnedNFTs API!===>>", result);
          document.location.href = `/mypage`;
        })
        .catch((err) => {
          setTransloading(false);
          console.log("fetching changeOwnerAndOwnedNFTs API FAILED!!!! ===>", err);
        });
    }
  }

  useEffect(() => {
    function fetchData() {
      window.klaytn._kaikas.isUnlocked().then(async (result) => {
        if (result === true) {
          await window.klaytn._kaikas.isApproved().then(async (result) => {
            if (result === true) {
              // await setIsKaikas(true);
              const caver = new Caver(window.klaytn);
              caver.klay.getAccounts().then(async (account) => {
                await getKaikas_AllNft(account[0].toLowerCase()).then(async (contracts) => {
                  //카이카스가 로그인 되어 있다면 보유NFT의 컨트랙트주소를 모두 불러오기 위해 서버에 크롤링요청을 보낸다.
                  console.log("?", contracts);
                  if (contracts === false) {
                    const headers = {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    };
                    await axios.post("http://localhost:3001/regdate", { address: account[0].toLowerCase() }, headers).then(async (result) => {
                      //최초 웹에 로그인한 지갑의 DATE를 불러와 state에 담는다.
                      await setRegdate(result.data.createdAt.slice(0, 10));
                      await setData([]);
                    });
                  } else {
                    console.log("test?", contracts);
                    contracts.map(async (contract) => {
                      //받아온 모든 컨트랙트 주소로 아래에서 서버에 컨트랙트주소를 날리며 서버에서 NFT 정보를 하나씩 DB에 저장시키고 총 해당하는 NFT를 반환
                      const headers = {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      };
                      await axios
                        .post("http://localhost:3001/klaytn/fetchNFT", { ownerAddress: account[0].toLowerCase(), thisContract: contract }, headers) //
                        .then(async (result) => {
                          console.log("result??", result);
                          await setRegdate(result.data.result.createdAt.slice(0, 10));
                          await setData(result.data.result.ownedNFTs);
                        });
                    });
                  }
                });

                setNowAccount(account);
                setLoading(false);
              });
            } else {
              fetchNFTs();
            }
          });
        } else {
          fetchNFTs();
        }
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (nowAccount[0] !== undefined) {
      setColor(nowAccount[0].slice(-6));
    }
    console.log("this is special color=====>", specialColor);
  }, [nowAccount]);

  return (
    <div className="MyPage">
      <div>
        <div className="main">
          <div className="main_myimage_box">
            <ProfileCircle></ProfileCircle>
          </div>
        </div>
        <div className="middle">
          <div className="address_box">{String(nowAccount).slice(0, 6) + "..." + String(nowAccount).slice(-4)}</div>
          <div className="createdAt">
            joined {regdate.slice(5, 10)}
            {" , "}
            {regdate.slice(0, 4)}
          </div>
        </div>
        {loading ? (
          <Loading className="loading" />
        ) : (
          <>
            {data.length === 0 ? (
              <div className="noItem_box">
                <img
                  className="noItem"
                  src="https://images-ext-2.discordapp.net/external/trFmW50QKa9FxyNgDh4m400OaIuLnm9XVa0o-fIuXoQ/https/testnftbucketforcucumber.s3.ap-northeast-2.amazonaws.com/image/noItemFound.jpg?width=665&height=499"
                />
              </div>
            ) : (
              <div className="cardGroup">
                {data.map((item) => {
                  return (
                    <div className="card1">
                      <div className="card_img_block">
                        <img className="card_img" variant="top" src={item.image_url} />
                      </div>
                      <div className="card_addoption">
                        <div className="card_body">
                          {isKaikas ? <div className="card_title">KiNFT</div> : <div className="card_title">{item.asset_contract.name}</div>}

                          {isKaikas ? <div className="card_text">{item.name}</div> : <div className="card_text">{item.collection.name}</div>}
                        </div>

                        <div className="card_footer">
                          <Link to={isKaikas ? `/mypage/${item.openseaId}` : `/mypage/${item.id}`} className="button_link">
                            <button className="sell_button addoption2">Sell</button>
                          </Link>
                          <button className="sell_button addoption3" onClick={() => transferStart(item)}>
                            Send
                          </button>
                          {inputbox ? (
                            <>
                              <input className="sendInput" onChange={(e) => transferToInput(e)} placeholder=" To Address" />
                              {transloading ? (
                                <>
                                  <div className="trasnferMessage">
                                    <Spinner animation="border" variant="primary" className="transferSpinner" />
                                    {message}
                                  </div>
                                </>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyPage;
