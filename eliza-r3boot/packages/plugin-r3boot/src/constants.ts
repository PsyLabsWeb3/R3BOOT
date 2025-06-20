export const erc20Abi = [
    "function balanceOf(address) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
];

export const tokenIconMap: Record<string, string> = {
  MNT:  "https://assets.coingecko.com/coins/images/30980/large/token-logo.png",
  ETH:  "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  WETH: "https://assets.coingecko.com/coins/images/2518/large/weth.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
  USDT: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
};

export const rewireABI = [{
  "inputs": [
    {
      "internalType": "string",
      "name": "secret",
      "type": "string"
    }
  ],
  "name": "cancelReWire",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "secret",
      "type": "string"
    }
  ],
  "name": "createReWire",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "secret",
      "type": "string"
    }
  ],
  "name": "redeemReWire",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "bytes32",
      "name": "secretHash",
      "type": "bytes32"
    }
  ],
  "name": "ReWireCanceled",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "bytes32",
      "name": "secretHash",
      "type": "bytes32"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "creator",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "ReWireCreated",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "bytes32",
      "name": "secretHash",
      "type": "bytes32"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "redeemer",
      "type": "address"
    }
  ],
  "name": "ReWireRedeemed",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ],
  "name": "reWires",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "internalType": "bytes32",
      "name": "secretHash",
      "type": "bytes32"
    },
    {
      "internalType": "bool",
      "name": "redeemed",
      "type": "bool"
    },
    {
      "internalType": "address",
      "name": "creator",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}
];