const KiFTabi_Klaytn = [
  {
    constant: false,
    inputs: [
      {
        name: "itemId",
        type: "uint256",
      },
      {
        name: "price",
        type: "uint256",
      },
    ],
    name: "changeMarketItemPrice",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "nftContract",
        type: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "price",
        type: "uint256",
      },
    ],
    name: "createMarketItem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "nftContract",
        type: "address",
      },
      {
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "createMarketSale",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_price",
        type: "uint256",
      },
    ],
    name: "setListingPrice",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "soldOutMarketItem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: true,
        name: "nftContract",
        type: "address",
      },
      {
        indexed: true,
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        name: "sold",
        type: "bool",
      },
    ],
    name: "MarketItemCreated",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "getListingPrice",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "nftContract",
        type: "address",
      },
      {
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

module.exports = KiFTabi_Klaytn;
