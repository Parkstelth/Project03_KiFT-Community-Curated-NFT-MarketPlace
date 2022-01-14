import "./About.css";
import { Accordion } from "react-bootstrap";

function About({ sellitem }) {
  function runEtherscan(e) {
    var win = window.open(
      `https://rinkeby.etherscan.io/address/${e.target.outerText}`,
      "_blank"
    );
    win.focus();
  }
  return (
    <div className="about_main">
      <div className="sell_bar"></div>
      <div className="middle2">
        <div>
          <div className="nft_name_box">
            <div className="nft_name">{sellitem.name}</div>
            <div className="nft_owned">
              Owned by <span className="owned_address">you</span>
            </div>
          </div>

          <img className="nft_image" src={sellitem.image_url} />
        </div>
        <div className="simple_description">
          <div className="center_description">
            <div className="description_title">
              Description
              <div className="price_input_box">
                <input className="price" placeholder="Amount" />
                <button className="sell_button">Sell</button>
              </div>
            </div>
            <div className="description2">
              created by{" "}
              <span
                onClick={(e) => runEtherscan(e)}
                className="description_address"
              >
                {sellitem.creator.address}
              </span>
            </div>
          </div>
          <div className="center_properties">
            <div className="properties_title">Properties</div>
            <div className="properties">
              {sellitem.traits.map((prop, index) => {
                console.log("t", prop);
                return (
                  <div className="props" key={index}>
                    <div className="props_1">{prop.trait_type}</div>
                    <div className="props_2">{prop.value}</div>
                    <div className="props_3">100% have this trait</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="center_details">
            <div className="details_title">Details</div>
            <div className="details">
              <div className="detail_menu">
                <span>contract Address</span>
                <span
                  className="right_end addoption"
                  onClick={(e) => runEtherscan(e)}
                >
                  {sellitem.asset_contract.address}
                </span>
              </div>
              <div className="detail_menu">
                <span>token id</span>
                <span className="right_end">{sellitem.token_id}</span>
              </div>
              <div className="detail_menu">
                <span>token standard</span>
                <span className="right_end">
                  {sellitem.asset_contract.schema_name}
                </span>
              </div>
              <div className="detail_menu">
                <span>blockchain</span>
                <span className="right_end">Rinkeby</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item className="acc_item" eventKey="0">
          <Accordion.Header className="acc_header">
            Price History
          </Accordion.Header>
          <Accordion.Body>NOT UPDATING..</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default About;
