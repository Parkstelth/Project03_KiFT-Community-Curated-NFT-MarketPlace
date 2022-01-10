import "./Nav.css";
import { Link } from "react-router-dom";

function Nav({ isLogin }) {
    return (
        <div className="NavBar">
            <div className="NavBarInisde">
                <div className="NavBarInisdeContainer">
                    <Link to="/" className="homeNav">
                        KiFT
                    </Link>
                    <Link to="/market" className="nav">
                        Market
                    </Link>
                    <div className="nav">Curated</div>
                    <div className="nav">Community</div> {/* 드롭다운 메뉴 만들어야함 */}
                    <div className="nav">Search</div>
                    {!isLogin ? (
                        <Link to="/signin" className="nav">
                            Sign in
                        </Link>
                    ) : (
                        <Link to="/market" className="nav">
                            put icon {/* son: 제가 아이콘 구해서 넣을게요! */}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Nav;
