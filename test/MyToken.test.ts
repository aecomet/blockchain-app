import { expect } from "chai";
import { ethers } from "hardhat";

describe ('MyToken contract',  () => {
  it('Deployment should assign the total supply of tokens to the owner', async () => {
    // @ts-ignore
    const [owner] = await ethers.getSigners();

    const myToken = await ethers.deployContract('MyToken');

    const ownerBlance = await myToken.balanceOf(owner.address);
  
    expect(await myToken.totalSupply()).to.equal(ownerBlance);
  });
})