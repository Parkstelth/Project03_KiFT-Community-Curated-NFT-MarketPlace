import "./TrendingItems.css";

function Item({ trendingItems }) {
  return (
    /* 페이지 넘길 수 있게하거나 혹은 스크롤 밑으로 내리면서 아이템 볼 수 있게 만들어주기! */
    <div className="trendingItemsContainer">
      {trendingItems.map((item) => (
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
        </div>
      ))}
    </div>
  );
}

export default Item;
