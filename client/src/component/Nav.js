import styled from "styled-components";
const TopHeader = styled.header`
    position: fixed;
    top: 0;
    width: 100%;
    height: 80px;
`;
const TopHeaderWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    max-width: 1400px;
    margin: 0 auto;
`;
const TopHeaderLogo = styled.h1``;
const Input = styled.input``;
const TopHeaderNav = styled.ul`
    /* display: flex; */
`;
const TopHeaderNavList = styled.li``;
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
