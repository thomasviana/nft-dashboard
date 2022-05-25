const serverUrl = "https://z0eylmd86wfz.usemoralis.com:2053/server";
const appId = "9IOqrkI5rO4CMkVDdYvdC7CKFn7bpmD23ot8Lhne";
const CONTRACT_ADDRESS = "0xF5fE6B60a6C8e868219850C11000E03bdc708d73";
Moralis.start({ serverUrl, appId });

let currentUser;

function fetchNFTMetadata(NFTs) {
  let promises = [];
  for (let i = 0; i < NFTs.length; i++) {
    let nft = NFTs[i];
    let id = nft.token_id;
    //Call Moralis Cloud function => Static JSON file
    promises.push(
      fetch(
        `https://z0eylmd86wfz.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=${appId}&nftId=${id}`
      )
        .then((res) => res.json())
        .then((res) => JSON.parse(res.result))

        .then((res) => {
          nft.metadata = res;
        })
        .then(() => {
          return nft;
        })

      // Depend on Moralis request limits

      // .then(() => {
      //   const options = {
      //     address: CONTRACT_ADDRESS,
      //     token_id: id,
      //     chain: "rinkeby",
      //   };
      //   return Moralis.Web3API.token.getTokenIdOwners(options);
      // })
      // .then((res) => {
      //   nft.owners = [];
      //   console.log(res);
      //   res.result.forEach((element) => {
      //     nft.owners.push(element.ownerOf);
      //   });
      //   return nft;
      // })
    );
  }
  return Promise.all(promises);
}

function renderInventory(NFTs, ownerData) {
  const parent = document.getElementById("app");
  for (let i = 0; i < NFTs.length; i++) {
    const nft = NFTs[i];
    let htmlString = `
    <div class="card" >
      <img class="card-img-top" src=${nft.metadata.image} alt="NFT">
      <div class="card-body">
        <h5 class="card-title">${nft.metadata.name}</h5>
        <p class="card-text">ID: ${nft.token_id}</p>
        <p class="card-text">${nft.metadata.description}</p>
        <p class="card-text">Tokens in circulation: ${nft.amount}</p>
        <p class="card-text">Number of owners: -</p>
        <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
        <a href="/src/mint.html?nftId=${
          nft.token_id
        }" class="btn btn-primary">Mint</a>
        <a href="/src/transfer.html?nftId=${
          nft.token_id
        }" class="btn btn-primary">Transfer</a>
      </div>
    </div>
    `;
    let col = document.createElement("div");
    col.className = "col col-md-3";
    col.innerHTML = htmlString;
    parent.appendChild(col);
  }
}

async function getOwnerData() {
  await Moralis.enableWeb3();
  currentUser = Moralis.User.current();

  let accounts = currentUser.get("accounts");
  const options = {
    chain: "rinkeby",
    address: accounts[0],
    token_address: CONTRACT_ADDRESS,
  };
  return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
    let result = data.result.reduce((object, currentElement) => {
      object[currentElement.token_id] = currentElement.amount;
      return object;
    }, {});
    console.log(result);
    return result;
  });
}

async function login() {
  try {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
      currentUser = await Moralis.Web3.authenticate();
    } else {
    }
  } catch (error) {
    console.log(error);
  }

  const options = {
    address: CONTRACT_ADDRESS,
    chain: "rinkeby",
  };
  const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
  // console.log(NFTs.result);
  let nftWithMetadata = await fetchNFTMetadata(NFTs.result);
  // console.log(nftWithMetadata);
  let ownerData = await getOwnerData();
  renderInventory(nftWithMetadata, ownerData);
}

login();
