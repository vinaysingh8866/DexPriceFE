import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import UniswapPrices from "../components/PriceUniSwap/UniswapPrices";

const Home: NextPage = () => {
  var url = "https://polygon-rpc.com";
  var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
  const [provider, setProvider] = useState(customHttpProvider);
  const [userConnected, setConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [chainid, setChainId] = useState("");

  async function connect() {
    const provider: Web3Provider = new ethers.providers.Web3Provider(
      window.ethereum
    );
    await provider.send("eth_requestAccounts", []);
    const chainId = (await provider.getNetwork()).chainId;
    setProvider(provider);
    setChainId(chainId.toString());
    setConnected(true);
  }

  useEffect(() => {
    if (!loaded) {
      connect();
      setLoaded(true);
    }
  }, [loaded]);

  return (
    <div className={styles.container}>
      <Head>
        <title>DexPrices</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black">
        {userConnected ? (
          <div>
            <UniswapPrices provider={provider} />
          </div>
        ) : (
          <div></div>
        )}
        {chainid}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
