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