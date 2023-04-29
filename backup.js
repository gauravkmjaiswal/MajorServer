let web3= require("web3")

global.window.web=web3




//   html



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="../bundle.js"></script>
    <title>Document</title>
</head>
<body>
    <button id="connect-button"> Connect Metamask</button>
    <script>
        console.log("hello g")
  
        document.getElementById('connect-button').addEventListener('click',async (event)=>{

            try{
                let Web3 = window.web;
                const web3 = new Web3(window.ethereum);
                web3.eth.getAccounts((error, accounts) => {
                if (error) {
                    console.error(error);
                } else {
                    const account = accounts[0];
                    // You can use the account variable to transfer tokens
                    const tokenContractAddress = '0xb6ebD3248beC5AAd05902bB5F6cAF648A5765c0c';
                    const tokenContractAbi = [
        {
        "inputs": [
            {
            "internalType": "string",
            "name": "name_",
            "type": "string"
            },
            {
            "internalType": "string",
            "name": "symbol_",
            "type": "string"
            },
            {
            "internalType": "uint8",
            "name": "decimals_",
            "type": "uint8"
            },
            {
            "internalType": "uint256",
            "name": "totalSupply_",
            "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "owner",
            "type": "address"
            },
            {
            "internalType": "address",
            "name": "spender",
            "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "spender",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
            "internalType": "string",
            "name": "",
            "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
            "internalType": "string",
            "name": "",
            "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "from",
            "type": "address"
            },
            {
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
        }
    ];
                    const tokenContract = new web3.eth.Contract(tokenContractAbi, tokenContractAddress);

                    const toAddress = '0x265E850293Bc0f58361df64153E13A6CC232Ae58';
                    const amount = BigInt(10 **18)

                    tokenContract.methods.transfer(toAddress, amount).send({ from: account })
                    .on('transactionHash', (hash) => {
                        console.log(`Transaction hash: ${hash}`);
                    })
                    .on('error', (error) => {
                        console.error(error);
                    })
                    .then((receipt) => {
                        console.log(`Transaction receipt: ${receipt}`);
                    });
                
                }
                });


            }catch(e)
            {
                console.log(e)
            }

            
        })

           
    </script>
</body> 
</html>