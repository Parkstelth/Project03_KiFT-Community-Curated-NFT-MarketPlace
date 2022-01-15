import "./Footer.css";


function Footer() {
    return (
            <footer className="footerBlock">
            <div className="footerContainer">
                <div className="ContainerUpperSide">
                    <div className="up1">
                        <div className="up1-1">Please contact us if you have any specific idea or request.</div>
                        <div className="up1-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="email">
                                <path d="M3.25 6v12.5h17.5V6H3.25zm15.5 10.5H5.25v-5.04L12 14.99l6.75-3.53v5.04zm0-7.29L12 12.73 5.25 9.21V8h13.5v1.21z" fill="currentColor"></path>
                            </svg>
                            <div>3076270s@gmail.com</div>
                        </div>
                    </div>
                    <div className="up2">
                        <div className="up2-1">About</div>
                        <div className="up2-1">Blog</div>
                        <div className="up2-1">Press</div>
                        <div className="up2-1">Careers</div>
                        <div className="up2-1">Help</div>
                    </div>
                </div>
                <div className="ContainerDownSide">
                    <div className="down1">
                        <div className="down1-1">KiFT</div>
                        <div className="down1-2">Terms of Service</div>
                        <div className="down1-2">Privacy</div>
                    </div>
                    <div className="down2">
                        <div className="down2-1">instagram</div>
                        <div className="down2-2">twitter</div>
                    </div>
                </div>
            </div>
        </footer>
        

    );

    
   
    
}
export default Footer;
