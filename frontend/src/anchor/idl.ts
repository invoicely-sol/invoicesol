// This file declares what fn, what instructions, what structs and stuff the program has and how to interact + data types
export type InvoiceProgram = {
  "address": "5c2Lu6R3bVrvVpWhMnGWRxcbpVR1vui8gK8hiAGCSj5F",
  "metadata": {
    "name": "invoiceProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createInvoice",
      "discriminator": [
        154,
        170,
        31,
        135,
        134,
        100,
        156,
        146
      ],
      "accounts": [
        {
          "name": "invoice",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "smallBusiness",
          "type": "string"
        },
        {
          "name": "largeBusiness",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "invoiceDate",
          "type": "i64"
        },
        {
          "name": "dueDate",
          "type": "i64"
        }
      ],
      "returns": "pubkey"
    },
    {
      "name": "updateStatus",
      "discriminator": [
        147,
        215,
        74,
        174,
        55,
        191,
        42,
        0
      ],
      "accounts": [
        {
          "name": "invoice",
          "writable": true
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newStatus",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "invoice",
      "discriminator": [
        51,
        194,
        250,
        114,
        6,
        104,
        18,
        164
      ]
    }
  ],
  "types": [
    {
      "name": "invoice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "smallBusiness",
            "type": "string"
          },
          {
            "name": "largeBusiness",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "invoiceDate",
            "type": "i64"
          },
          {
            "name": "dueDate",
            "type": "i64"
          },
          {
            "name": "status",
            "type": "string"
          }
        ]
      }
    }
  ]
};

export const IDL: InvoiceProgram = {
  address: "5c2Lu6R3bVrvVpWhMnGWRxcbpVR1vui8gK8hiAGCSj5F",
  metadata: {
    name: "invoiceProgram",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "createInvoice",
      discriminator: [154, 170, 31, 135, 134, 100, 156, 146],
      accounts: [
        { name: "invoice", writable: true, signer: true },
        { name: "user", writable: true, signer: true },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "smallBusiness", type: "string" },
        { name: "largeBusiness", type: "string" },
        { name: "amount", type: "u64" },
        { name: "invoiceDate", type: "i64" },
        { name: "dueDate", type: "i64" },
      ],
      returns: "pubkey",
    },
    {
      name: "updateStatus",
      discriminator: [147, 215, 74, 174, 55, 191, 42, 0],
      accounts: [
        { name: "invoice", writable: true },
        { name: "user", signer: true },
      ],
      args: [
        { name: "newStatus", type: "string" },
      ],
    },
  ],
  accounts: [
    {
      name: "invoice",
      discriminator: [51, 194, 250, 114, 6, 104, 18, 164],
    },
  ],
  types: [
    {
      name: "invoice",
      type: {
        kind: "struct",
        fields: [
          { name: "smallBusiness", type: "string" },
          { name: "largeBusiness", type: "string" },
          { name: "amount", type: "u64" },
          { name: "invoiceDate", type: "i64" },
          { name: "dueDate", type: "i64" },
          { name: "status", type: "string" },
        ],
      },
    },
  ],
};