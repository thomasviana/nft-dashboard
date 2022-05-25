const serverUrl = "https://z0eylmd86wfz.usemoralis.com:2053/server";
const appId = "9IOqrkI5rO4CMkVDdYvdC7CKFn7bpmD23ot8Lhne";
const CONTRACT_ADDRESS = "0xF5fE6B60a6C8e868219850C11000E03bdc708d73";
Moralis.start({ serverUrl, appId });

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

  const urlParams = new URLSearchParams(window.location.search);
  const nftId = urlParams.get("nftId");
  document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
  let tokenId = parseInt(document.getElementById("token_id_input").value);
  let address = document.getElementById("address_input").value;
  let amount = parseInt(document.getElementById("amount_input").value);
  console.log(tokenId);
  await Moralis.enableWeb3();

  const options = {
    type: "erc1155",
    receiver: address,
    contractAddress: CONTRACT_ADDRESS,
    tokenId: tokenId,
    amount: amount,
  };
  let transaction = await Moralis.transfer(options);
  console.log(transaction);
}

document.getElementById("submit_transfer").onclick = transfer;

init();
