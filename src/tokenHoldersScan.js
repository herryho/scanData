const axios = require("axios");
const fs = require("fs");
const { ApiPromise, WsProvider } = require("@polkadot/api");

require("dotenv").config();

// polkadot系
const bifrostPolkadot20230101 =
  "0x6f8b77d13600c74805e8fe1d832988c2d20cb33fdfe57f91fdb5c5c379184ded";
const bifrostPolkadotEndpoint = process.env.BIFROST_POLKADOT_ENDPOINT;
const vdot = JSON.stringify({ VToken2: "0" });
const vglmr = JSON.stringify({ VToken2: "1" });
const vastr = JSON.stringify({ Vtoken2: "3" });
const vfil = JSON.stringify({ Vtoken2: "4" });
let vdotCount = 0;
let vglmrCount = 0;
let vastrCount = 0;
let vfilCount = 0;

// kusama系
const bifrostKusama20230101 =
  "0xe12519c8e529c7276a1230bd02d3b8f8ee02ce4658f76a699468a1269986e971"; // 2023年1月1日的区块hash
const bifrostKusamaEndpoint = process.env.BIFROST_KUSAMA_ENDPOINT;
const vbnc = JSON.stringify({ VToken: "BNC" });
const vksm = JSON.stringify({ VToken: "KSM" });
const vmovr = JSON.stringify({ VToken: "MOVR" });
let vbncCount = 0;
let vksmCount = 0;
let vmovrCount = 0;
// const veth = { Vtoken: "VETH" };

// 获取在某个区块时tokens模块accounts方法里边的token持币用户数量
const getAccounts = async (api, blockHash) => {
  api = await api.at(blockHash);
  const result = await api.query.tokens.accounts.entries();

  result.forEach(([key, exposure]) => {
    // console.log(
    //   "key arguments:",
    //   key.args.map((k) => k.toHuman())
    // );
    // console.log("     exposure:", exposure.toHuman());

    // 如果持币不为0，那么就是持币用户
    if (
      exposure.toHuman().free != "0" ||
      exposure.toHuman().reserved != "0" ||
      exposure.toHuman().frozen != "0"
    ) {
      let tokenType = JSON.stringify(key.args[1].toHuman());
      if (tokenType == vdot) {
        vdotCount++;
      } else if (tokenType == vglmr) {
        vglmrCount++;
      } else if (tokenType == vastr) {
        vastrCount++;
      } else if (tokenType == vfil) {
        vfilCount++;
      } else if (tokenType == vbnc) {
        vbncCount++;
      } else if (tokenType == vksm) {
        vksmCount++;
      } else if (tokenType == vmovr) {
        vmovrCount++;
      }
    }
  });

  console.log("vdotCount:", vdotCount);
  console.log("vglmrCount:", vglmrCount);
  console.log("vastrCount:", vastrCount);
  console.log("vfilCount:", vfilCount);
  console.log("vbncCount:", vbncCount);
  console.log("vksmCount:", vksmCount);
  console.log("vmovrCount:", vmovrCount);
};

async function main() {
  const wsProvider = new WsProvider(bifrostPolkadotEndpoint);
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;
  const vdot = { token2: 0 };

  await getAccounts(api, bifrostPolkadot20230101);
}

main();
