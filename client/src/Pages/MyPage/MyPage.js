import "./MyPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import Loading from "../../component/assets/Loading";
import styled from "styled-components";

function MyPage({ setIsLogin }) {
  const [data, setData] = useState([]);
  const [nowAccount, setNowAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [specialColor, setColor] = useState("");

  const ProfileCircle = styled.div`
    background-color: #${specialColor};
    border: 8px solid white;
    height: 7rem;
    width: 7rem;
    border-radius: 43%;
  `;

  const fetchNFTs = async () => {
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
              "http://localhost:3001/findUser",
              {
                address: account[0].toLowerCase(),
              },
              headers
            )
            .then(async (user) => {
              await console.log("this is your user's data ====>", user.data.data);
              const data = user.data.data;
              console.log("just data ---------> ", data);
              return data;
            })
            .then((data) => {
              result.data.assets.map(async (item) => {
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
                      history: item.collection.created_date,
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
                    console.log("errrrrrr ", err);
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

  useEffect(() => {
    fetchNFTs();
  }, []);

  useEffect(() => {
    if (nowAccount !== "") {
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
          <div className="createdAt">joined November 2021</div>
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
              <CardGroup className="cardGroup">
                {data.map((item) => {
                  return (
                    <Card key={item.id} className="card1">
                      <Card.Img className="card_img" variant="top" src={item.image_url} />
                      <Card.Body className="card_body">
                        <Card.Title className="card_title">{item.asset_contract.name}</Card.Title>
                        <Card.Text className="card_text">{item.collection.name}</Card.Text>
                      </Card.Body>
                      <Card.Footer className="card_footer">
                        <small className="text-muted">
                          {item.collection.created_date.slice(0, 10)}
                          {" / "}
                          {item.collection.created_date.slice(11, 16)}
                        </small>
                      </Card.Footer>
                      <Link to={`/mypage/${item.id}`} className="button_link">
                        <button className="sell_button addoption2">Sell</button>
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
