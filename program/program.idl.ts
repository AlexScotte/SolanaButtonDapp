import * as anchor from "@coral-xyz/anchor";
import idl from './idl.json';

export const SOLANA_BUTTON_PROGRAM_ID = new anchor.web3.PublicKey(idl.address);

export function getSolanaButtonProgram(provider: anchor.AnchorProvider): anchor.Program<ProgramType> {
  
  return new anchor.Program<ProgramType>(idl as ProgramType, provider);
};

export type ProgramType = {
    "address": "EGMzXToSqdq8PfSDergoQNEphopAF4EVsBzSapKU9JLi",
    "metadata": {
      "name": "solanaButton",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "claimReward",
        "discriminator": [
          149,
          95,
          181,
          242,
          94,
          90,
          158,
          162
        ],
        "accounts": [
          {
            "name": "gameState",
            "writable": true
          },
          {
            "name": "vault",
            "writable": true
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
        "args": []
      },
      {
        "name": "clickButton",
        "discriminator": [
          50,
          74,
          85,
          148,
          119,
          56,
          246,
          125
        ],
        "accounts": [
          {
            "name": "globalState",
            "writable": true
          },
          {
            "name": "gameState",
            "writable": true
          },
          {
            "name": "vault",
            "writable": true
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
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createNewGame",
        "discriminator": [
          125,
          123,
          146,
          199,
          15,
          252,
          11,
          68
        ],
        "accounts": [
          {
            "name": "globalState",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    103,
                    108,
                    111,
                    98,
                    97,
                    108
                  ]
                }
              ]
            }
          },
          {
            "name": "gameState",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    103,
                    97,
                    109,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "global_state.next_game_id",
                  "account": "globalState"
                }
              ]
            }
          },
          {
            "name": "vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "global_state.next_game_id",
                  "account": "globalState"
                }
              ]
            }
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
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "gameTimeSec",
            "type": "i64"
          }
        ]
      },
      {
        "name": "initializeGlobalState",
        "discriminator": [
          232,
          254,
          209,
          244,
          123,
          89,
          154,
          207
        ],
        "accounts": [
          {
            "name": "globalState",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    103,
                    108,
                    111,
                    98,
                    97,
                    108
                  ]
                }
              ]
            }
          },
          {
            "name": "authority",
            "writable": true,
            "signer": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "verifyGameState",
        "discriminator": [
          246,
          86,
          135,
          195,
          12,
          39,
          128,
          55
        ],
        "accounts": [
          {
            "name": "gameState",
            "writable": true
          },
          {
            "name": "globalState",
            "writable": true
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "gameState",
        "discriminator": [
          144,
          94,
          208,
          172,
          248,
          99,
          134,
          120
        ]
      },
      {
        "name": "globalState",
        "discriminator": [
          163,
          46,
          74,
          168,
          216,
          123,
          133,
          98
        ]
      },
      {
        "name": "vault",
        "discriminator": [
          211,
          8,
          232,
          43,
          2,
          152,
          117,
          119
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "incorrectDepositAmount",
        "msg": "Incorrect deposit amount"
      },
      {
        "code": 6001,
        "name": "insufficientFunds",
        "msg": "Insufficient funds in user account"
      },
      {
        "code": 6002,
        "name": "gameNotActive",
        "msg": "Game not active"
      },
      {
        "code": 6003,
        "name": "alreadyLastClicker",
        "msg": "Already the last clicker"
      },
      {
        "code": 6004,
        "name": "gameEnded",
        "msg": "Game has ended"
      }
    ],
    "types": [
      {
        "name": "gameState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "lastClicker",
              "type": "pubkey"
            },
            {
              "name": "gameId",
              "type": "u64"
            },
            {
              "name": "clickNumber",
              "type": "u64"
            },
            {
              "name": "isActive",
              "type": "bool"
            },
            {
              "name": "hasEnded",
              "type": "bool"
            },
            {
              "name": "lastClickTimestamp",
              "type": {
                "option": "i64"
              }
            },
            {
              "name": "gameTimeSec",
              "type": "i64"
            }
          ]
        }
      },
      {
        "name": "globalState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "pubkey"
            },
            {
              "name": "nextGameId",
              "type": "u64"
            },
            {
              "name": "activeGameId",
              "type": {
                "option": "u64"
              }
            }
          ]
        }
      },
      {
        "name": "vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "gameId",
              "type": "u64"
            },
            {
              "name": "balance",
              "type": "u64"
            },
            {
              "name": "depositAmount",
              "type": "u64"
            }
          ]
        }
      }
    ]
  };
  