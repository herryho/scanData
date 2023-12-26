const axios = require("axios");
const fs = require("fs");

require("dotenv").config();

const auth = process.env.AUTH;
const address = process.env.ADDRESS;

// 有个问题，api是取多只能加载100页
let page = 1; // 初始页码
const rowsPerPage = 100; // 每页行数
let allData = []; // 用于存储所有抓取到的数据

const fetchData = () => {
  const postData = {
    address: address,
    direction: "received",
    order: "desc",
    page: page,
    row: rowsPerPage,
    success: true,
    token_category: ["native"],
  };

  axios
    .post("https://polkadot.api.subscan.io/api/v2/scan/transfers", postData, {
      headers: {
        "User-Agent": "Apidog/1.0.0 (https://apidog.com)",
        "Content-Type": "application/json",
        "x-api-key": auth,
      },
    })
    .then((response) => {
      const data = response.data?.data?.transfers;

      if (data) {
        data.forEach((item) => {
          // console.log(JSON.stringify(item));
          // 将 block_timestamp 转换为 UTC 时间
          item.UTC = new Date(item.block_timestamp * 1000).toUTCString();

          if (
            item.block_timestamp > 1640217600 &&
            item.block_timestamp < 1646956800
          ) {
            // console.log("hello");
            // 数据只留下来from和amount_v2两个字段
            let temp = {};
            temp.from = item.from;
            temp.amount_v2 = item.amount_v2;
            temp.block_num = item.block_num;
            allData.push(temp);
          }
        });
      }
      if (data && data.length === rowsPerPage) {
        // 停半秒，避免请求过于频繁
        setTimeout(() => {
          page++; // 如果当前页面数据达到每页行数，增加页码并继续抓取
          fetchData();
        }, 200);
      } else {
        console.log("page: ", page);
        // 当没有更多数据时，将 allData 写入 JSON 文件
        fs.writeFile(
          "Composable2019desc.json",
          JSON.stringify(allData, null, 2),
          (err) => {
            if (err) throw err;
            console.log("Data saved to data.json");
          }
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

fetchData();
