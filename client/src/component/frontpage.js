import { Link } from 'react-router-dom';
import styled from "styled-components";
import "./frontpage.css";

const FrontStart = styled.div`
    margin-top:80px;
`;

const FrontStartWrap = styled.div`
    display:flex;
    justify-content: center;
`;

const LeftSource = styled.div`
    display:flex;
    flex-direction: column;
    padding-left:11vw;

`;

const RightSource = styled.div`
    display:flex;
    flex-direction: column;
    max-width:412px;
    max-height:517px;
    padding:0px 11em 0px 4%;
    
`;



function FrontPage() {
    return (
        <FrontStart>
            <FrontStartWrap>
            <LeftSource>
            <div>CURATOR ART</div>
            <img className="mainart" src="https://ipfs.pixura.io/ipfs/QmPVXTbzi83fDYHU6MNcHTJC3aYnkME5AZBvBDjeCUNnEg/Somber.jpg"></img>
            </LeftSource>
            <RightSource>
                <div className="mainstart">
            <div className="h1">collet</div>
            <div className="h1">digital art</div>
                </div>

            </RightSource>

            </FrontStartWrap>
        </FrontStart>
    );
}

export default FrontPage;