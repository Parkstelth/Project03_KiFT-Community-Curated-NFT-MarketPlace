import "./Item.css";
import { useState, useEffect } from "react";

function Item({ marketData }) {
    return (
        <div className="marketItemContainer">
            {marketData.map((item) => (
                <div className="marketItem" key={item.id}>
                    {/* <img src={item.image_url} alt="" /> */}
                    <div className="imgContainer">
                        {<img src={item.image_url === "" ? "https://testnets.opensea.io/static/images/placeholder.png" : item.image_url} className="market_image" alt="" />}
                    </div>
                    <div className="marketItem_infoContainer">
                        <div className="marketItem_first-section">{item.name === null ? "unknown" : item.name}</div>
                        <div className="marketItem_price-item-container">
                            <div className="marketItem_price-item">
                                <span>Not listed yet</span>
                                <p className="marketItem_price-text">List price</p>
                            </div>
                        </div>

                        <div className="marketItem_user">
                            <hr className="marketItem_user-divider" />
                            <div className="marketItem_user-item">
                                <div className="marketItem_user-title">ARTIST</div>
                                <div className="marketItem_user">{item.creator === null ? "unknown" : item.creator.address}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Item;
