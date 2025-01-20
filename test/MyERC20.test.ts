import { expect } from "chai";
import { ethers } from "hardhat";

describe ('MyERC20 contract',  () => {
  it('Deployment should assign the total supply of tokens to the owner', async () => {
    // @ts-ignore
    const [owner] = await ethers.getSigners();

    const myERC20 = await ethers.deployContract('MyERC20');

    const ownerBlance = await myERC20.balanceOf(owner.address);
  
    expect(await myERC20.totalSupply()).to.equal(ownerBlance);
  });
})