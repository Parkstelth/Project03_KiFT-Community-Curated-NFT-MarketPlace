import "./SearchedItems.css";

function Item({ searchedItems }) {
  console.log("this is searchedItems=========>>>>>", searchedItems[0]);
  return (
    /* 페이지 넘길 수 있게하거나 혹은 스크롤 밑으로 내리면서 아이템 볼 수 있게 만들어주기! */
    <div>
      {searchedItems[0] === undefined ? (
        <div className="wrongResult">
          Result is empty
          <div>Please put the right word</div>
        </div>
      ) : (
        <div className="searchedItemsContainer">
          {searchedItems.map((item) => (
            <a href={`/mypage/${item.openseaId}`} key={item.openseaId}>
              <div className="marketItem" key={item.id}>
                <div className="imgContainer searchedMarket_image">
                  {
                    <img
                      src={
                        item.image_url === ""
                          ? "https://testnets.opensea.io/static/images/placeholder.png"
                          : item.image_url
                      }
                      className="market_image_2 searchedMarket_image"
                      alt=""
                    />
                  }
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Item;
