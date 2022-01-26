import React, { useState } from "react";
import { Input } from "antd";
import styled from "styled-components";
import "./DetailList.css";

const DetailDiv = styled.div`
  div {
    margin-bottom: 0.7rem;
    width: 320px;
  }
`;

const Inputbox = styled.div`
  display: flex;
`;

const { TextArea } = Input;

const DetailList = (props) => {
  function settrait1(e) {
    props.setTrait1(e.target.value);
  }
  function settrait2(e) {
    props.setTrait2(e.target.value);
  }

  return (
    <DetailDiv>
      <span className="type_f">Type</span>
      <span className="name_f">Name</span>
      {props.countList &&
        props.countList.map((item, i) => (
          <div key={i}>
            <div>
              {i === props.countList.length - 1 ? (
                <Inputbox>
                  <input className="trait1" onChange={(e) => settrait1(e)} placeholder="Character" />
                  <input className="trait2" onChange={(e) => settrait2(e)} placeholder="Male" />
                </Inputbox>
              ) : (
                <Inputbox>
                  <input disabled className="trait1" onChange={(e) => settrait1(e)} placeholder="Character" />
                  <input disabled className="trait2" onChange={(e) => settrait2(e)} placeholder="Male" />
                </Inputbox>
              )}
            </div>
          </div>
        ))}
    </DetailDiv>
  );
};

export default DetailList;
