import {ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS} from "@solana/actions"
import {clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction} from "@solana/web3.js"

export async function GET(request: Request) {
  const responseBody: ActionGetResponse = {
    icon: "https://red-chilly-carp-862.mypinata.cloud/ipfs/QmddChpeKGwpUDP8b5DNBRJ7W4irBJJxHamwU1xEomeNVe",
    description: "My first Blink",
    title: "BBBBLINK!",
    label: "Click me",

    links: {
      actions: [
        {
          type: "transaction",
          href: request.url+"",
          label: "same action"
        },
        {
          type: "transaction",
          href: request.url+"?action=another",
          label: "another action"
        },
        {
          type: "transaction",
          href: request.url+"?action=nickname&param={nameParam}",
          label: "action with param",
          parameters: [
            {
              name: "nameParam",
              label: "nickname",
              required: true
            },
            // {
            //   name: "amountParam",
            //   label: "amount",
            //   required: true
            // }
          ]
        }
      ]
    }
  }

  const response =  Response.json(responseBody, {headers: ACTIONS_CORS_HEADERS});
  return response;
}

export async function POST(request: Request) {
  const postRequest: ActionPostRequest = await request.json();
  const userPublicKey = postRequest.account;
  console.log(`User public key: ${userPublicKey}`);

  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const param = url.searchParams.get("action");


  const user = new PublicKey(userPublicKey);

  const connection = new Connection(clusterApiUrl("devnet"))
  const ix = SystemProgram.transfer({
    fromPubkey: user,
    toPubkey: new PublicKey("2nuW7MWYsGdLmsSf5mHrjgn6NqyrS5USai6fdisnUQc4"),
    lamports: 1
  });
  const tx = new Transaction();

  if (action === "another") {
    tx.add(ix);
  } else if (action === "nickname") {
    name = param!;
  }

  tx.feePayer = new PublicKey(userPublicKey);
  const blockHash = tx.recentBlockhash = (await connection.getLatestBlockhash({commitment: "finalized"})).blockhash;
  console.log(`Block hash: ${blockHash}`);

  const serialTransaction = tx.serialize({requireAllSignatures: false, verifySignatures: false}).toString("base64");
  
  const response: ActionPostResponse = {
    message: "not implemented yet",
    type: "transaction",
    transaction: serialTransaction
  };

  return Response.json(response, {headers: ACTIONS_CORS_HEADERS});
}

export async function OPTIONS(request: Request) {
  return Response.json({}, {headers: ACTIONS_CORS_HEADERS});
}