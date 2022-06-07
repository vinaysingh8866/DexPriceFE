import { Token } from "@uniswap/sdk-core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Pool } from "@uniswap/v3-sdk";
interface Immutables {
  factory: string;
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: ethers.BigNumber;
}

interface State {
  liquidity: ethers.BigNumber;
  sqrtPriceX96: ethers.BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}
const UniswapTokenPrice = (props: any) => {
  const [token1Price, setToken1Price] = useState("");
  const [token2Price, setToken2Price] = useState("");
  const poolContract = new ethers.Contract(
    props.poolInfo.poolAdd,
    IUniswapV3PoolABI,
    props.provider
  );
  async function getPoolImmutables() {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
      await Promise.all([
        poolContract.factory(),
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.maxLiquidityPerTick(),
      ]);

    const immutables: Immutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    };
    return immutables;
  }

  async function getPoolState() {
    const [liquidity, slot] = await Promise.all([
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    const PoolState: State = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    };

    return PoolState;
  }

  useEffect(() => {
    async function main() {
      const { chainId } = await props.provider.getNetwork();

      const [immutables, state] = await Promise.all([
        getPoolImmutables(),
        getPoolState(),
      ]);
      const TokenA = new Token(
        chainId,
        immutables.token0,
        16,
        props.poolInfo.token1,
        props.poolInfo.token1
      );

      const TokenB = new Token(
        chainId,
        immutables.token1,
        6,
        props.poolInfo.token2,
        props.poolInfo.token2
      );

      const poolExample = new Pool(
        TokenA,
        TokenB,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
      );

      console.log(poolExample.token0Price.toSignificant());
      const k = Number(state.sqrtPriceX96) ** 2 / 2 ** 192;
      const kk = 2 ** 192 / Number(state.sqrtPriceX96) ** 2;
      setToken1Price(k.toString());
      setToken2Price(kk.toString());
      console.log(k, kk);
    }
    main();
  });

  return (
    <div className="flex flex-column">
      <div>
        {props.poolInfo.token1} {token2Price}
      </div>
      <div>
        {props.poolInfo.token2} {token1Price}
      </div>
    </div>
  );
};

export default UniswapTokenPrice;
