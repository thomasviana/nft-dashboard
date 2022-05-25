// Use this cloud function in Moralis

Moralis.Cloud.define("getNFT", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  let NFTId = request.params.nftId;
  let hexId = parseInt(NFTId).toString(16);
  let paddedHex = (
    "0000000000000000000000000000000000000000000000000000000000000000" + hexId
  ).slice(-64);
  logger.info(paddedHex);
  return Moralis.Cloud.httpRequest({
    url: "https://z0eylmd86wfz.usemoralis.com/" + paddedHex + ".json",
  }).then(function (httpResponse) {
    return httpResponse.text;
  });
});
