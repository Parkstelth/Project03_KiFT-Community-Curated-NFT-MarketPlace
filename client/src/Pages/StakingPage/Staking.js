function Staking() {
  return (
    <div>
      <div className="totalSupply">총스테이킹량</div>
      <div className="myValue">내 스테이킹량</div>
      <div className="nowReward">현재 스테이킹 수익</div>
      <div>
        <input className="stakingValue" />
        <button className="start">스테이킹발사</button>
      </div>
    </div>
  );
}

export default Staking;
