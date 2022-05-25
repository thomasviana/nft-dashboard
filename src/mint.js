const serverUrl = "https://z0eylmd86wfz.usemoralis.com:2053/server";
const appId = "9IOqrkI5rO4CMkVDdYvdC7CKFn7bpmD23ot8Lhne";
const CONTRACT_ADDRESS = "0xF5fE6B60a6C8e868219850C11000E03bdc708d73";
Moralis.start({ serverUrl, appId });
let web3;

async function init() {
  try {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
      window.location.pathname = " /index.html";
    } else {
    }
  } catch (error) {
    console.log(error);
  }

  await Moralis.enableWeb3();
  web3 = new Web3(Moralis.provider);

  let accounts = await web3.eth.getAccounts();
  console.log(accounts);

  const urlParams = new URLSearchParams(window.location.search);
  const nftId = urlParams.get("nftId");
  document.getElementById("token_id_input").value = nftId;
  document.getElementById("address_input").value = accounts[0];
}

async function mint() {
  let tokenId = parseInt(document.getElementById("token_id_input").value);
  let address = document.getElementById("address_input").value;
  let amount = parseInt(document.getElementById("amount_input").value);
  const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
  const accounts = await web3.eth.getAccounts();
  contract.methods
    .mint(address, tokenId, amount)
    .send({
      from: accounts[0],
      value: 0,
    })
    .on("receipt", function (receipt) {
      alert("Mint done");
    });
}

document.getElementById("submit_mint").onclick = mint;

init();
