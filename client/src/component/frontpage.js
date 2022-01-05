import { Link } from "react-router-dom";

function FrontPage() {
    return (
        <div>
            <div> </div>
            <Link to="posting">
                <button></button>
            </Link>
            <Link to="signup">
                <button></button>
            </Link>
        </div>
    );
}

export default FrontPage;
