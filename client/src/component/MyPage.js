import "./MyPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import Loading from "./assets/Loading";

function MyPage({ setIsLogin, setSellitem }) {
  const [data, setData] = useState([]);
  const [nowAccount, setNowAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [regDate, setRegDate] = useState("");

  const fetchNFTs = async () => {
    const metamaskProvider = window.ethereum.providers.find(
      (provider) => provider.isMetaMask
    );
    const web = new Web3(metamaskProvider);
    await web.eth
      .getAccounts()
      .then(async (account) => {
        setIsLogin(true);
        setNowAccount(account);
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
        };
        const params = new URLSearchParams();
        params.append("address", account[0].toLowerCase());

        await axios
          .post("http://localhost:3001/regdate", params, { headers })
          .then((result) => {
            if (result.data !== "not address") {
              setRegDate(result.data.createdAt);
            } else {
              setRegDate("");
            }
          });
        return account;
      })
      .then(async (account) => {
        await axios
          .get(`https://testnets-api.opensea.io/assets?owner=${account}`)
          .then(async (result) => {
            setData(result.data.assets);
            setLoading(false);

            result.data.assets.map(async (item) => {
              const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
              };
              // const params = new URLSearchParams();
              await axios.post(
                "http://localhost:3001/NFT",
                {
                  isSale: false,
                  name: item.name,
                  contract_address: item.asset_contract.address,
                  asset_contract_type: item.asset_contract.asset_contract_type,
                  schema_name: item.asset_contract.schema_name,
                  description: item.description,
                  NFT_id: item.token_id,
                  createdAt: item.collection.created_date,
                  image_url: item.image_url,
                  history: item.collection.created_date,
                },
                headers
              );
            });
          });
      });
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="MyPage">
      <div>
        <div className="main">
          <div className="main_myimage_box">
            <img
              className="main_myimage"
              src="https://cdn.pixabay.com/photo/2012/04/01/18/40/button-23946_960_720.png"
            />
          </div>
        </div>
        <div className="middle">
          <div className="address_box">
            {String(nowAccount).slice(0, 6) +
              "..." +
              String(nowAccount).slice(-4)}
          </div>
          <div className="createdAt">
            {regDate === "" ? (
              "..."
            ) : (
              <>
                {"Joined "}
                {regDate.slice(5, 7)}
                {"-"}
                {regDate.slice(0, 4)}
              </>
            )}
          </div>
        </div>
        {loading ? (
          <Loading className="loading" />
        ) : (
          <>
            {data.length === 0 ? (
              <div>없음</div>
            ) : (
              <CardGroup className="cardGroup">
                {data.map((item) => {
                  return (
                    <Card key={item.id} className="card1">
                      <Card.Img
                        className="card_img"
                        variant="top"
                        src={item.image_url}
                      />
                      <Card.Body className="card_body">
                        <Card.Title className="card_title">
                          {item.asset_contract.name}
                        </Card.Title>
                        <Card.Text className="card_text">
                          {item.collection.name}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="card_footer">
                        <small className="text-muted">
                          {item.collection.created_date.slice(0, 10)}
                          {" / "}
                          {item.collection.created_date.slice(11, 16)}
                        </small>
                      </Card.Footer>
                      <Link to={`/mypage/${item.id}`} className="button_link">
                        <button
                          className="sell_button"
                          onClick={() => {
                            setSellitem(item);
                          }}
                        >
                          Sell
                        </button>
                      </Link>
                    </Card>
                  );
                })}
              </CardGroup>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyPage;
