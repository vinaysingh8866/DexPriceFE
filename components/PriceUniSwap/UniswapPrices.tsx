import React from "react";
import UniswapPoolPrice from "./UniswapPool";

const UniswapPrices = (props: any) => {
  const address: { [key: string]: String } = {
    weth: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    wbtc: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    dai: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    aave: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    bal: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
    ghst: "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7",
    link: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
    sushi: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
    wmatic: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  };

  return (
    <div>
      <div className="flex flex-row text-white bg-black">
        <div className="mx-auto">Token0</div>
        <div className="mx-auto">Token1</div>
      </div>
      {Object.keys(address).map((x, y) => {
        return Object.keys(address).map((m, n) => {
          return (
            <UniswapPoolPrice
              key={n}
              token1={address[x]}
              token2={address[m]}
              provider={props.provider}
            ></UniswapPoolPrice>
          );
        });
      })}
    </div>
  );
};

export default UniswapPrices;
