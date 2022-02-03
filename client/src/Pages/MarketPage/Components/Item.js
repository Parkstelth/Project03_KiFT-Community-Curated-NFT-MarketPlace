import "./Item.css";
import { Link } from "react-router-dom";

function Item({ marketData, userMarketData }) {
  return (
    /* 페이지 넘길 수 있게하거나 혹은 스크롤 밑으로 내리면서 아이템 볼 수 있게 만들어주기! */
    <div className="marketItemContainer">
      {userMarketData.map((item) => (
        <Link to={`/mypage/${item.openseaId}`} className="marketItem" key={item.openseaId}>
          <div className="imgContainer">
            {
              <img
                src={item.image_url === "" ? "https://testnets.opensea.io/static/images/placeholder.png" : item.image_url}
                className="market_image"
                alt=""
              />
            }
          </div>
          <div className="marketItem_infoContainer">
            <div className="marketItem_first-section">{item.name === null ? "unknown" : item.name}</div>
            <div className="marketItem_price-item-container">
              <div className="marketItem_price-item">
                <span>Price</span>
                <p className="marketItem_price-text">{item.price} ETH</p>
              </div>
            </div>

            <div className="marketItem_user">
              <hr className="marketItem_user-divider" />
              <div className="marketItem_user-item">
                <div className="marketItem_user-title">ARTIST</div>

                <div className="marketItem_user">{item.contract_address === null ? "unknown" : item.contract_address}</div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {marketData.map((item) => (
        <div className="marketItem" key={item.id}>
          <div className="imgContainer">
            {
              <img
                src={item.image_url === "" ? "https://testnets.opensea.io/static/images/placeholder.png" : item.image_url}
                className="market_image"
                alt=""
              />
            }
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
