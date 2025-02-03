import { ethers } from 'hardhat';

async function main() {
  console.log(`======================`);
  console.log(`Deploying contracts...`);
  console.log(`======================`);

  const myToken = await ethers.deployContract('MyToken');
  myToken.waitForDeployment();

  // @ts-ignore
  console.log('MyToken deployed to:', myToken.target);

  const myERC20 = await ethers.deployContract('MyERC20');
  myERC20.waitForDeployment();

  // @ts-ignore
  console.log('MyERC20 deployed to:', myERC20.target);

  const myERC721 = await ethers.deployContract('MyERC721', ['MyERC721', 'MYERC721']);
  myERC721.waitForDeployment();

  // @ts-ignore
  console.log('MyERC721 deployed to:', myERC721.target);
  console.log(`======================`);
  console.log(`Deploying complete...`);
  console.log(`======================`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
