import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./component/frontpage";
import Market from "./component/Market";
import SignIn from "./component/SignIn";
import NotFound from "./component/notfound";
import Nav from "./component/Nav";
import Footer from "./component/Footer";
import { useState,useEffect } from 'react'

function App() {

    const [footer,setFooter] = useState(true)

    function setfooter(e){
        setFooter(e)
    }

    return (
        
        <BrowserRouter>
     
            <Nav />
            <Routes>
                <Route exact path="/" element={<FrontPage setfooter={setfooter}/>} />
                <Route path="/market" element={<Market setfooter={setfooter}/>} />
                <Route path="/signin" element={<SignIn setfooter={setfooter}/>} />
              
            </Routes>
            {
                footer ? <Footer /> : null
            }
         
        </BrowserRouter>
        
    );
}

export default App;
