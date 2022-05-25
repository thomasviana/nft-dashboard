

moralis-admin-cli deploy

enter api key
enter api secret
select server

copy url and enter it on opensea_nft.sol contract like

constructor() ERC1155("https://sslxb0eibubf.usemoralis.com/{id}.json") {
        _mint(msg.sender,ARTWORK, 1, "");
        _mint(msg.sender,PHOTO, 2, "");
    }

deploy contract and get contract address to paste it on testnet.opensea.io/get-listed