import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./component/frontpage";
import Market from "./component/Market";
import SignIn from "./component/SignIn";
import NotFound from "./component/notfound";
import Nav from "./component/Nav";
import Footer from "./component/Footer";
import { useState,useEffect } from 'react'
import Web3 from 'web3'

function App() {

    const [footer,setFooter] = useState(true)
    const [loginAccount,setLoginAccount] = useState('')
    const [web3,setWeb3] = useState([])

   
    function setfooter(e){
        setFooter(e)
    }
   
    useEffect(async() => {
        if (typeof window.ethereum !== 'undefined') {
          // window.ethereum이 있다면
          try {
              const web = new Web3(window.ethereum);
              await web.eth.getAccounts().then((account)=>{
                  setLoginAccount(account)
              })
              setWeb3(web)
          } catch (err) {
            console.log(err);
          }
        }
        else{
            setLoginAccount('')
            setWeb3([])
        }
      }, []);


      console.log('text',loginAccount)
      console.log('text2',web3)

    return (
        
        <BrowserRouter>
     
            <Nav />
            <Routes>
                <Route exact path="/" element={<FrontPage setfooter={setfooter}/>} />
                <Route path="/market" element={<Market setfooter={setfooter}/>} />
                <Route path="/signin" element={<SignIn setfooter={setfooter} setLoginAccount={setLoginAccount} setWeb3={setWeb3}/>} />
              
            </Routes>
            {
                footer ? <Footer /> : null
            }
         
        </BrowserRouter>
        
    );
}

export default App;
