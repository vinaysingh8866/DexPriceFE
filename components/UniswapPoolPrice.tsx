import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { Pool } from "@uniswap/v3-sdk";
import {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as IUniswapV3FactoryABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json";
import UniswapTokenPrice from "./UniswapTokenPrice";

const abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

function UniswapPoolPrice(props: any) {
  const [got, setGot] = useState(false);
  const [poolInfo, setPoolInfo] = useState({
    poolAdd: "",
    token1: "",
    token1Dec: "",
    token2: "",
    token2Dec: "",
  });
  useEffect(() => {
    async function getPoolAddresses() {
      try {
        const factoryContractAddress =
          "0x1F98431c8aD98523631AE4a59f267346ea31F984";
        const contractInstance = new Contract(
          factoryContractAddress,
          IUniswapV3FactoryABI,
          props.provider
        );
        const owner = await contractInstance.owner();
        const poolAddress: string = await contractInstance.getPool(
          props.token1,
          props.token2,
          3000
        );
        const poolContract = new Contract(
          poolAddress,
          IUniswapV3PoolABI,
          props.provider
        );
        const token0 = await poolContract.token0();
        const token1 = await poolContract.token1();
        const tok1C = new ethers.Contract(token0, abi, props.provider);
        const tokSym1: string = await tok1C.symbol();
        const tok2C = new ethers.Contract(token1, abi, props.provider);
        const tokSym2: string = await tok2C.symbol();
        const tok1Dec: string = await tok1C.decimals();
        const tok2Dec: string = await tok2C.decimals();
        setPoolInfo({
          poolAdd: poolAddress,
          token1: tokSym1,
          token1Dec: tok1Dec,
          token2: tokSym2,
          token2Dec: tok2Dec,
        });
        setGot(true);
      } catch {}
    }
    if (!got) {
      getPoolAddresses();
    }
  }, [got, props.provider, props.token1, props.token2]);
  return (
    <div>
      {got ? (
        <div>
          <UniswapTokenPrice
            poolInfo={poolInfo}
            provider={props.provider}
          ></UniswapTokenPrice>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default UniswapPoolPrice;
