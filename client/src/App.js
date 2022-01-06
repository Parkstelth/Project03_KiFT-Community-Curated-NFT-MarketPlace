import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./component/frontpage";
import Posting from "./component/posting";
import SignUp from "./component/signup";
import NotFound from "./component/notfound";
import Nav from "./component/Nav";
import Footer from "./component/Footer";

function App() {
    return (
        <BrowserRouter>
            <Nav />

            <Routes>
                <Route path="/" element={<FrontPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/posting" element={<Posting />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
