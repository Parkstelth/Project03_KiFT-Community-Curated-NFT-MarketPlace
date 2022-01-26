import "./CreateNft.css";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { create } from "ipfs-http-client";
import NotifyModal from "./Components/NotifyModal.js";
import React, { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";
import { MdOutlineImage } from "react-icons/md";
import Web3 from "web3";
import dotenv from "dotenv";
import DetailList from "./DetailList";
import { Button } from "antd";
dotenv.config();
const Kift_721_Contract_Address =
  process.env.REACT_APP_KIFT_721_CONTRACT_ADDRESS;

var KiFT721abi = require("./KiFT721abi");

const InputImage = styled.input`
  display: none;
`;
const InputTemp = styled.div`
  border-radius: 10px;
  border: 2px dashed rgb(204, 204, 204);
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  height: 257px;
  width: 346px;
  :hover {
    background-color: rgb(226, 224, 224);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  :hover {
    background-color: transparent;
  }
`;
const PreviewImageCloseButton = styled.button`
  color: rgb(204, 204, 204);
  outline: none;
  border: none;
  position: absolute;
  top: 3px;
  right: 3px;
  background: none;
  cursor: pointer;
  font-size: 20px;
  border: 1px solid;
  border-radius: 10px;
  :hover {
    color: rgb(127, 117, 117);
  }
`;

const CreateListDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 1px solid rgb(229, 232, 235);
  border-radius: 7px;
`;

function CreateNft() {
  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const [countList, setCountList] = useState([0]);
  const [name, setName] = useState("");
  const [collection, setCollection] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [message, setMessage] = useState("");
  const [closebox, setClosebox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [totalTrait, setTotalTrait] = useState({});
  const [trait1, setTrait1] = useState("");
  const [trait2, setTrait2] = useState("");
  const [resultTraits, setResultTraits] = useState([]);

  const closeModal = () => {
    setShowModal(false);
    setClosebox(false);
  };

  function changeName(e) {
    setName(e.target.value);
  }

  function changeCollection(e) {
    setCollection(e.target.value);
  }

  function changeDescription(e) {
    setDescription(e.target.value);
  }

  const onClickXButton = () => {
    setImgSrc("");
  };

  const onHandleChange = (event) => {
    event.preventDefault();
    setFiles(event.target.files[0]);
    let fileReader = new FileReader();
    let file = event.target.files[0];
    if (file !== undefined) {
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        setImgSrc(e.target.result);
      };
    } else {
      setFiles("");
    }
  };

  const onAddDetailDiv = () => {
    let totalTrait = {};

    let countArr = [...countList];
    let counter = countArr.slice(-1)[0];
    counter += 1;
    countArr.push(counter); // index 사용 X
    // countArr[counter] = counter	// index 사용 시 윗줄 대신 사용
    setCountList(countArr);
    if (trait1 !== "" && trait2 !== "") {
      totalTrait.trait_type = trait1;
      totalTrait.value = trait2;

      resultTraits.push(totalTrait);
      setTrait1("");
      setTrait2("");
      setResultTraits(resultTraits);
    }
    console.log("tt", resultTraits);
  };

  const createItem = async () => {
    setMessage(`Please wait until "Success!"`);
    setShowModal(true);
    if (typeof window.ethereum !== "undefined") {
      //여러 wallet 플랫폼중 metaMask로 연결
      if (typeof window.ethereum.providers === "undefined") {
        var metamaskProvider = window.ethereum;
        console.log("메타마스크만 다운되어있는 것 처리===>", metamaskProvider);
      } else {
        var metamaskProvider = window.ethereum.providers.find(
          (provider) => provider.isMetaMask
        );
        console.log("여러개 지갑 처리 ==>", metamaskProvider);
      }
      try {
        const web = new Web3(metamaskProvider);
        web.eth.getAccounts().then(async (account) => {
          if (account.length === 0) {
            setClosebox(true);
            setMessage("Please log in to MetaMask");
          } else {
            const imgURI = await ipfs.add(files);
            const metadata = {
              name: name,
              collection: collection,
              description: description,
              image: `https://ipfs.io/ipfs/${imgURI.path}`,
              attributes: resultTraits,
            };
            const tokenUri = await ipfs.add(JSON.stringify(metadata));
            const newTokenURI = `https://ipfs.io/ipfs/${tokenUri.path}`;
            console.log("test", newTokenURI);
            let contract = await new web.eth.Contract(
              KiFT721abi,
              Kift_721_Contract_Address
            );

            await contract.methods
              .mintNFT(newTokenURI)
              .send({
                from: account[0],
                gas: 500000,
                gasPrice: "2450000000",
              })
              .then(async () => {
                await setMessage("Create your NFT Success!");
                document.location.href = `/create`;
              })
              .catch((err) => {
                console.log("this is whole error message", err);
                console.log("this is error message----->>>>", err.message);
                setClosebox(true);
                setMessage(err.message);
              });
          }
        });
      } catch (err) {
        setClosebox(true);
        setMessage("Unknown error!");
      }
    }
  };

  return (
    <div className="mainset">
      {showModal && (
        <NotifyModal
          showModal={showModal}
          closeModal={closeModal}
          message={message}
          closebox={closebox}
        ></NotifyModal>
      )}
      <div className="maintitle">Make Your NFT</div>
      <div className="imagebox">
        <div>
          <div className="content_start">
            File types supported: JPEG, JPG, PNG, GIF
          </div>
          <div className="content_start addoption2">Max size: 100 MB</div>

          <div className="imageset">
            <InputImage
              id="fileUpload"
              type="file"
              name="fileUpload"
              onChange={onHandleChange}
            />
            <label htmlFor="fileUpload">
              <InputTemp>
                <ImageContainer>
                  {imgSrc ? (
                    <>
                      <PreviewImage src={imgSrc} />
                      <PreviewImageCloseButton onClick={onClickXButton}>
                        X
                      </PreviewImageCloseButton>
                    </>
                  ) : (
                    <IconContext.Provider
                      value={{ color: "rgb(204, 204, 204) ", outline: "none" }}
                    >
                      <div>
                        <MdOutlineImage size={70} />
                      </div>
                    </IconContext.Provider>
                  )}
                </ImageContainer>
              </InputTemp>
            </label>
          </div>
        </div>

        <div className="middleline"></div>
        <div className="contentbox">
          <div className="content_name">
            <div className="content_start">Name</div>
            <input
              className="input_name"
              placeholder="Item name"
              onChange={(e) => changeName(e)}
            />
            <div className="content_start">Collection</div>
            <input
              className="input_name"
              placeholder="Select collection"
              onChange={(e) => changeCollection(e)}
            />
            <div className="content_start">Description</div>
            <textarea
              className="input_name addoption"
              placeholder="Provide a detailed description of your item."
              onChange={(e) => changeDescription(e)}
            />
            <div className="content_start addoption">
              Properties
              <div className="content_trait">
                Textual traits that show up as rectangles
              </div>
              <CreateListDiv>
                <DetailList
                  countList={countList}
                  setTrait1={setTrait1}
                  setTrait2={setTrait2}
                />
                <Button
                  className="sell_button addoption2"
                  onClick={onAddDetailDiv}
                >
                  Add more
                </Button>
              </CreateListDiv>
            </div>
            <div className="content2_start">Supply</div>
            <div className="content_under">
              Quantities above one coming soon.
            </div>
            <input disabled className="input_name" placeholder=" 1" />
            <div className="content2_start">Blockchain</div>
            <DropdownButton
              id="dropdown-basic-button2"
              className="dropdown addoption"
              title=" Rinkeby"
            >
              <Dropdown.Item id="blockchain_set" href="">
                Rinkeby
              </Dropdown.Item>
            </DropdownButton>
          </div>
          {name !== "" && files !== "" ? (
            <button className="sell_button addoption2" onClick={createItem}>
              Create
            </button>
          ) : (
            <>
              <button disabled onClick={createItem}>
                Create
              </button>
              <div className="warning">Please Fill in the File, Name! </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateNft;
