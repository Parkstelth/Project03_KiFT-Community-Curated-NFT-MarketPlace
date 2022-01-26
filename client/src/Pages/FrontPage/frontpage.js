import { useRef } from "react";
import "./frontpage.scss";
import { useEffect } from "react";
import React from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cube from "./cube.mp4";
import FrontpagePic from "./FrontpagePic.jpeg";
import nft from "./nft.jpeg";
import nft2 from "./nft2.png";

const FrontStart = styled.div`
  margin-top: 10px;
`;

const FrontStartWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const LeftSource = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 3vw;
  width: 28rem;
`;

const RightSource = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* max-width: 412px;
  max-height: 517px; */
  padding: 35px 1em 0px 4%;
`;

function FrontPage({ setfooter }) {
  //creating the ref

  useEffect(() => {
    setfooter(true);
  }, []);

  const customeSlider = useRef();

  // setting slider configurations
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
  };

  const previous = () => {
    customeSlider.current.slickNext();
  };

  const next = () => {
    customeSlider.current.slickPrev();
  };

  return (
    <FrontStart>
      <div>
        {/* <button class="buttonLeft" onClick={next}>
          Next
        </button>
        <button onClick={previous}>Previous</button> */}
        <Slider {...settings} ref={customeSlider}>
          <div className="SliderImgContainer">
            <img src="https://media.discordapp.net/attachments/886537798931349554/935341218370584586/1__GNQ_V6HjUfWFCKDKaZrgw2x.jpeg" alt="" />
          </div>
          <div className="SliderImgContainer">
            <img src="https://media.discordapp.net/attachments/886537798931349554/928140644709437460/74038_12624_2915.jpeg" alt="" />
          </div>
          <div className="SliderImgContainer">
            <img
              src="https://media.discordapp.net/attachments/886537798931349554/935340818422714488/chirsties-x-open-sea-online-auction-mdj-forever-mslp-hero-1892x500.jpg"
              alt=""
            />
          </div>
        </Slider>
      </div>
      <FrontStartWrap>
        <LeftSource>
          <div className="title">CURATED ART</div>
          <div className="LeftSourceCard">
            <video className="video2" autoPlay muted loop>
              <source src={cube} type="video/mp4" />
            </video>
            <div className="LeftSourceCard-description">
              <div className="LeftSourceCard-description-left">
                <div>Pak</div>
                <div className="LeftSourceCard-description-left-snsID">@muratpak</div>
              </div>
              <div className="LeftSourceCard-description-right">
                <div>Release Date</div>
                <div className="LeftSourceCard-description-right-date">22 Feb </div>
              </div>
            </div>
            {/* <div className="description">
              <div className="artist">
                <div>ARTIST</div>
                <div className="artist_data">{"@park-son"}</div>
              </div>
              <div className="release_date">
                <div className="date_title">RELEASE DATE</div>
                <div className="date"> {"Dec22,2021,12pm"}</div>
              </div>
            </div> */}
          </div>
        </LeftSource>
        <RightSource>
          <div className="mainstart">
            <div className="h1">Collect</div>
            <div className="h1">Digital Art</div>
            <p className="h2">Buy and sell NFTs from the</p>
            <p className="h2">world's top artists</p>
            <a href="/market">
              <button className="startbutton">Start Collecting</button>
            </a>
          </div>
        </RightSource>
      </FrontStartWrap>

      <div className="NeverMissADrop-Box">
        <div className="NeverMissADrop-Container">
          <div className="NeverMissADrop-Contents">
            <h2 className="NeverMissADrop-Title">Never miss a drop!</h2>
            <div className="NeverMissADrop-Secondary">Subscribe to our exclusive drop list and be the first to know about upcoming KiFT drops.</div>
            <div className="NeverMissADrop-EmailBox">
              <div className="NeverMissADrop-EmailBoxLeft">
                <div className="NeverMissADrop-EmailBoxLeftInside">
                  <div className="NeverMissADrop-EmailBoxLeftInside2">
                    <input type="text" className="NeverMissADrop-EmailBoxLeftInside2Input" placeholder="Email Address" />
                    {/* <fieldset className="NeverMissADrop-EmailBoxLeftInside2Fieldset"></fieldset> */}
                  </div>
                </div>
                {/* <input type="text" />
                <fieldset className="NeverMissADropEmailFieldset">asdfafasdf</fieldset> */}
              </div>
              <div className="NeverMissADrop-Email-subButtonDiv">
                <button className="NeverMissADrop-Email-subButton">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="MuiBox-root">
        <div className="MuiContainer-maxWidth">
          <div className="MuiContainer">
            <div className="MuiContainer-item">
              <div className="MuiContainer-item-content">
                <h2 className="MuiContainer-item-content-h2">The Premier Marketplace for NFTs</h2>
                <div className="MuiContainer-item-content-div">
                  <p className="MuiContainer-item-content-typography">
                    KiFT is the premier marketplace for KiFTerian, which are digital <br /> items you can truly own. Digital Items have existed for a
                    long time, <br />
                    but never like this.
                  </p>
                </div>
                <a href="" className="MuiContainer-item-content-button">
                  Learn More
                </a>
              </div>
            </div>
            <div className="MuiContainer-item">
              <img src={FrontpagePic} alt="" className="FrontpagePic" />
            </div>
          </div>
        </div>
        <div className="MuiContainer-maxWidth">
          <div className="MuiContainer">
            <div className="MuiContainer-item">
              <div className="MuiContainer-item-second-left">
                <div className="MuiContainer-item-second-left-firstBlock img-left">
                  <div className="MuiContainer-item-second-left-first-ImgCard">
                    <div className="MuiContainer-item-second-left-first-ImgContainer">
                      <img src={nft} alt="" className="MuiContainer-item-second-left-first-ImgCard-image" />
                    </div>

                    <div className="MuiContainer-item-second-left-first-ImgCard-cardName">
                      <div className="MuiContainer-item-second-left-first-ImgCard-cardName-name">RUDCEF</div>
                      <div className="MuiContainer-item-second-left-first-ImgCard-cardName-snsId">@rud_cef</div>
                    </div>
                  </div>
                </div>
                <div className="MuiContainer-item-second-left-firstBlock img-right">
                  <div className="MuiContainer-item-second-left-first-ImgCard">
                    <div className="MuiContainer-item-second-left-first-ImgContainer">
                      <img src={nft2} alt="" className="MuiContainer-item-second-left-first-ImgCard-image" />
                    </div>

                    <div className="MuiContainer-item-second-left-first-ImgCard-cardName">
                      <div className="MuiContainer-item-second-left-first-ImgCard-cardName-name">Clone X</div>
                      <div className="MuiContainer-item-second-left-first-ImgCard-cardName-snsId">@rtfktstudios</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="MuiContainer-item">
              <div className="MuiContainer-second-item-content">
                <h2 className="MuiContainer-item-content-h2">List your NFTs on KiFT</h2>
                <div className="MuiContainer-item-content-div">
                  <p className="MuiContainer-item-content-typography">
                    Are you an artist or NFT project creator? Get in touch <br /> with us to get your content on KiFT!
                  </p>
                </div>
                <a href="" className="MuiContainer-item-content-button">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="MuiContainer-maxWidth">
          <div className="MuiContainer-lastBlock">
            <div className="MuiContainer-lastBlock-container">
              <div className="MuiContainer-lastBlock-container-firstLogo">
                <a href="/market" className="MuiContainer-lastBlock-container-firstLogo-AnchorKIFT">
                  <div className="MuiContainer-lastBlock-container-firstLogo-KIFT">KiFT</div>
                </a>
                <div className="MuiContainer-lastBlock-container-firstLogo-KIFT">+</div>
                <div className="MuiContainer-lastBlock-container-secondLogo">
                  <a href="https://findvectorlogo.com/klaytn-vector-logo-svg/" target="_blank">
                    <img
                      src="https://findvectorlogo.com/wp-content/uploads/2019/10/klaytn-vector-logo.png"
                      className="MuiContainer-lastBlock-container-secondLogo-Klaytn"
                    />
                  </a>
                </div>
              </div>
              <div className="MuiContainer-lastBlock-container-middleH2">KiFT is part of Klaytn</div>
              <p className="MuiContainer-lastBlock-container-lastP">
                This means you can count on their world leading security technology to keep your NFTs safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FrontStart>
  );
}

export default FrontPage;
