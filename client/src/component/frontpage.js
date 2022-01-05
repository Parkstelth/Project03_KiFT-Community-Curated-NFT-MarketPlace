import { Link } from 'react-router-dom';
import styled from "styled-components";

const FrontStart = styled.div`
    margin-top:80px;
`;

const FrontStartWrap = styled.div`
    display:flex;
`;

const LeftSource = styled.div`
    display:flex
    .mainart{
        width:200px;
    }
`;

const RightSource = styled.div`
    display:flex
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
            <div>collet</div>
            <div>digital art</div>
            </RightSource>

            </FrontStartWrap>
        </FrontStart>
    );
}

export default FrontPage;