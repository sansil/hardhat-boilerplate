const { ethers } = require('hardhat')
const { assert, expect } = require('chai')

describe('SimpleStorage', function () {
  let simpleStorageFactory, simpleStorage
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it('Should start with a fav number of 0', async function () {
    const currentValue = await simpleStorage.retrieve()
    const exepectedValue = '0'
    assert.equal(currentValue.toString(), exepectedValue)
  })

  it('Should update fav num', async function () {
    const exepectedValue = '7'
    const tx = await simpleStorage.store(7)
    await tx.wait(1)
    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), exepectedValue)
  })
})
