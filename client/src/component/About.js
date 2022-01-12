import "./About.css";
import { useState,useEffect } from 'react'
import {Accordion} from 'react-bootstrap'

function About() {


    return(
        <div className="about_main">
            <div className="sell_bar"></div>
            <div className="middle2">
                <div>
                    <div class="nft_name_box">
                    <div className="nft_name">Codestate #1</div>
                     <div className="nft_owned">Owned by <span className="owned_address">you</span></div>

                    </div>
                
                <img className="nft_image" src={'https://lh3.googleusercontent.com/JU-AMbkn2C_PR9jprPK-JEMc2gCEmdiHF02Xvw9kNuyQ9xRllD7JWx0wXQ-krxqOkeCCLrr_xmmaNUocDLwQe7BASe3pk7FQE4x_T3A'} />

                </div>
                <div className="simple_description">
                    <div className="center_description">
                            <div className="description_title">Description
                            <div className="price_input_box">
                            <input className="price" placeholder="Amount" />
                            <button className="sell_button">Sell</button>
                            </div>
                            </div>
                            <div className="description2">created by <span className="description_address">0x78d0...7d05</span></div>
                    </div> 
                    <div className="center_properties">
                            <div className="properties_title">Properties</div>
                            <div className="properties">
                                <div className="props">
                                    <div className="props_1">power</div>
                                    <div className="props_2">max</div>
                                    <div className="props_3">100% have this trait</div>
                                </div>
                            </div>
                    </div> 

                    <div className="center_details">
                            <div className="details_title">Details</div>
                            <div className="details">
                                <div className="detail_menu"><span>contract Address</span><span className="right_end">0x55555</span></div>
                                <div className="detail_menu"><span>token id</span><span className="right_end">1</span></div>
                                <div className="detail_menu"><span>token standard</span><span className="right_end">erc-721</span></div>
                                <div className="detail_menu"><span>blockchain</span><span className="right_end">rikny</span></div>
                            </div>
                    </div> 
                </div>
            </div>
            <Accordion defaultActiveKey="0">
                <Accordion.Item className="acc_item" eventKey="0">
                    <Accordion.Header className="acc_header">Price History</Accordion.Header>
                    <Accordion.Body>
                    NOT UPDATING..
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>

    )
}


export default About;


