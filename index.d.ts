export interface payload {
  senderSubscriberId: string; //subscriber_id of sender
  privateKey: string; //private key of sender in base64 encoding

  //search parameters of the NP whose details need to be fetched from registry
  domain: string;
  subscriberId: string;
  country: string;
  type: string; //buyerApp, sellerApp, gateway
  city: string;
  env: string; //staging,preprod,prod
}

export interface ONDCSubscriber {
  subscriber_id: string;
  city: string[];
  country: string;
  valid_from: string; // ISO 8601 date string
  valid_until: string; // ISO 8601 date string
  signing_public_key: string;
  encr_public_key: string;
  created: string; // ISO 8601 date string
  updated: string; // ISO 8601 date string
  unique_key_id: string;
  network_participant: NetworkParticipant[];
}

export interface NetworkParticipant {
  subscriber_url: string;
  domain: string;
  type: string;
  msn: boolean;
  city_code: string[];
  seller_on_record: string[];
}

type vlookupOutput = ONDCSubscriber[];

export declare async function vLookUp(data: payload): vlookupOutput;
