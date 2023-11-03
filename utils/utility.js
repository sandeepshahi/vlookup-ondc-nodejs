const sodium = require("sodium-native");
const crypto = require("crypto");
const axios = require("axios");
const constants = require("../constants/constants");

const participantType = (action) => {
  if (action.startsWith("on_")) {
    return "sellerApp";
  } else {
    return "buyerApp";
  }
};
const createSigningString = (data) => {
  const { country, domain, type, city, subscriberId } = data;

  return [country, domain, type, city, subscriberId].join("|");
};

const getEnvDetails = (env) => {
  let envLink = "";
  if (env === "preprod") {
    envLink = constants.PREPROD_REGISTRY;
  } else if (env === "prod") {
    envLink = constants.PROD_REGISTRY;
  } else if (env === "staging") {
    envLink = constants.STAGE_REGISTRY;
  }

  return envLink;
};

const fetchRegistryResponse = async (
  requestId,
  timestamp,
  signature,
  searchParameters,
  senderSubscriberId,
  envLink
) => {
  try {
    const response = await axios.post(envLink, {
      sender_subscriber_id: senderSubscriberId,
      request_id: requestId,
      timestamp,
      search_parameters: searchParameters,
      signature,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const getVLookUpData = async (signature, data) => {
  try {
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const { country, domain, type, city, subscriberId } = data;
    const searchParameters = {
      country,
      domain,
      type,
      city,
      subscriber_id: subscriberId,
    };
    const senderSubscriberId = data.senderSubscriberId;

    const envLink = getEnvDetails(data.env);

    const res = await fetchRegistryResponse(
      requestId,
      timestamp,
      signature,
      searchParameters,
      senderSubscriberId,
      envLink
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const signData = (message, privateKey) => {
  const signature = new Uint8Array(sodium.crypto_sign_BYTES);
  sodium.crypto_sign_detached(signature, message, privateKey);
  return signature;
};

const sign = (signingString, privateKey) => {
  let privateKeyBytes = Buffer.from(privateKey, "base64");
  const message = Buffer.from(signingString);

  if (privateKeyBytes.length !== sodium.crypto_sign_SECRETKEYBYTES) {
    console.error("Invalid private key length");
    return;
  }
  privateKey = new Uint8Array(privateKeyBytes);

  const signature = signData(message, privateKey);

  signatureBase64 = Buffer.from(signature).toString("base64");

  return signatureBase64;
};

module.exports.vLookUp = async (data) => {
  try {
    const signingString = createSigningString(data);
    const signature = sign(signingString, data.privateKey);
    let res = await getVLookUpData(signature, data);
    res = JSON.stringify(res.data);
    return res;
  } catch (error) {
    if (error.response) {
      console.error("HTTP error code:", error.response.status);
      console.error("Error:", error.message);
    } else {
      console.error("Error:", error.message);
    }
  }
};
