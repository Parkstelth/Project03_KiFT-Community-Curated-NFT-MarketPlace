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
                    <div className="nav">Community</div>
                    <div className="nav">Search</div>
                    {!isLogin ? (
                        <Link to="/signin" className="nav">
                            Sign in
                        </Link>
                    ) : (
                        <Link to="/signin" className="nav">
                            put icon
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Nav;
