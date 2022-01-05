import styled from "styled-components";
const TopHeader = styled.header`
    position: relative;
    left: 0px;
    width: 100%;
    height: 80px;
`;
const TopHeaderWrap = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    height: 100%;
    max-width: 1000px;
    margin: 0 auto;
`;
const TopHeaderLogo = styled.h1`
    flex: 1 1 auto;
    border: 1px solid black;
`;
const Input = styled.input`
    flex: 1 1 auto;
`;
const TopHeaderNav = styled.div`
    display: flex;
    border: 1px solid black;
    flex: 3 1 auto;
`;
const TopHeaderNavList = styled.div``;
function Nav() {
    return (
        <TopHeader>
            <TopHeaderWrap>
                <TopHeaderLogo>Kift</TopHeaderLogo>
                <Input type="text" placesholder="Search.."></Input>

                <TopHeaderNav>
                    <TopHeaderNavList>Market</TopHeaderNavList>
                    <TopHeaderNavList>Features</TopHeaderNavList>
                    <TopHeaderNavList>sign in</TopHeaderNavList>
                </TopHeaderNav>
            </TopHeaderWrap>
        </TopHeader>
    );
}
export default Nav;
