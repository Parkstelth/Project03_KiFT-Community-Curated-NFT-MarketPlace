import { Link } from "react-router-dom";
import styled from "styled-components";
import "./frontpage.css";
import { useEffect } from 'react';

const FrontStart = styled.div`
    margin-top: 80px;
`;

const FrontStartWrap = styled.div`
    display: flex;
    justify-content: center;
`;

const LeftSource = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 11vw;
`;

const RightSource = styled.div`
    display: flex;
    flex-direction: column;
    max-width:412px;
    max-height:517px;
    padding:35px 1em 0px 4%;
    
`;





function FrontPage() {
    
    return (
        <FrontStart >
            <FrontStartWrap>
            <LeftSource >
            <div className="title">CURATOR ART</div>
            <img className="introImg" src="https://ipfs.pixura.io/ipfs/QmPVXTbzi83fDYHU6MNcHTJC3aYnkME5AZBvBDjeCUNnEg/Somber.jpg"></img>
            <div className="description">
             
                    <div className="artist">
                        <div>ARTIST</div>
                        <div className="artist_data">{'@park-son'}</div>
                    </div>
                    <div className="release_date">
                        <div className="date_title">RELEASE DATE</div>
                        <div className="date"> {'Dec22,2021,12pm'}</div>
                    </div>
            </div>
            </LeftSource>
            <RightSource>
                <div className="mainstart">
            <div className="h1">collet</div>
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
