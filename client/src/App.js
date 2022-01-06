import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./component/frontpage";
import Market from "./component/Market";
import SignIn from "./component/SignIn";
import NotFound from "./component/notfound";
import Nav from "./component/Nav";
import Footer from "./component/Footer";

function App() {
    return (
        <BrowserRouter>
            <Nav />

            <Routes>
                <Route exact path="/" element={<FrontPage />} />
                <Route path="/market" element={<Market />} />
                <Route path="/signin" element={<SignIn />} />
                {/* <Route path="/*" element={<NotFound />} /> */}
      
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
