import { useRef } from "react";
import "./frontpage.css";
import { useEffect } from "react";
import React from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cube from "./cube.mp4";

const FrontStart = styled.div`
  margin-top: 10px;
`;

const FrontStartWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const LeftSource = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 11vw;
  width: 28rem;
`;

const RightSource = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 412px;
  max-height: 517px;
  padding: 35px 1em 0px 4%;
`;
// const settings = {
//   dots: true,
//   infinite: true,
//   arrows: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
// };

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
          <div>
            <img src="https://media.discordapp.net/attachments/886537798931349554/935341218370584586/1__GNQ_V6HjUfWFCKDKaZrgw2x.jpeg" alt="" />
          </div>
          <div>
            <img src="https://media.discordapp.net/attachments/886537798931349554/928140644709437460/74038_12624_2915.jpeg" alt="" />
          </div>
          <div>
            <img
              src="https://media.discordapp.net/attachments/886537798931349554/935340818422714488/chirsties-x-open-sea-online-auction-mdj-forever-mslp-hero-1892x500.jpg"
              alt=""
            />
          </div>
        </Slider>
      </div>
      <FrontStartWrap>
        <LeftSource>
          <div className="title">CURATOR ART</div>
          <video className="video" autoPlay muted loop>
            <source src={cube} type="video/mp4" />
          </video>
          <div className="description">
            <div className="artist">
              <div>ARTIST</div>
              <div className="artist_data">{"@park-son"}</div>
            </div>
            <div className="release_date">
              <div className="date_title">RELEASE DATE</div>
              <div className="date"> {"Dec22,2021,12pm"}</div>
            </div>
          </div>
        </LeftSource>
        <RightSource>
          <div className="mainstart">
            <div className="h1">collect</div>
            <div className="h1">digital art</div>
            <p className="h2">Buy and sell NFTs from the</p>
            <p className="h2">world's top artists</p>
            <button className="startbutton">START COLLECTING</button>
          </div>
        </RightSource>
      </FrontStartWrap>
    </FrontStart>
  );
}

export default FrontPage;
