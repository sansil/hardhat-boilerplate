
const { ethers, run, network } = require('hardhat')
require("@nomiclabs/hardhat-etherscan")

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log('Deploying contract...')
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()
  console.log(`Deployed contract to: ${simpleStorage.address}`)
  //console.log(network.config)
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    // await 6 blocks to give etherscan time to index the address
    await simpleStorage.deployTransaction.wait(8)
    await verify(simpleStorage.address, [])
  }

  const currentValue = await simpleStorage.retrieve()
  console.log(`Current value is: ${currentValue}`)

  //update transaction
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    })
  }
  catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }

}

main().then(() => {
  process.exit(0).catch((error) => {
    console.log(error)
    process.exit(1)
  })
})
