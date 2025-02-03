import { ethers } from 'hardhat';

async function main() {
  console.log(`======================`);
  console.log(`Deploying contracts...`);
  console.log(`======================`);

  const myToken = await ethers.deployContract('MyToken');
  myToken.waitForDeployment();
  console.log(`MyToken deployed to: ${myToken.target}`);

  const myERC20 = await ethers.deployContract('MyERC20');
  await myERC20.waitForDeployment();
  console.log(`MyERC20 deployed to: ${myERC20.target}`);

  const myERC721 = await ethers.deployContract('MyERC721', ['MyERC721', 'MYERC721']);
  await myERC721.waitForDeployment();
  console.log(`myERC721 deployed to: ${myERC721.target}`);

  const conduitController = await ethers.deployContract('ConduitController');
  await conduitController.waitForDeployment();
  const conduitControllerAddress = await conduitController.getAddress();

  const seaport = await ethers.deployContract('Seaport', [conduitControllerAddress]);
  await seaport.waitForDeployment();
  console.log(`Seaport deployed to: ${seaport.target}`);

  console.log(`======================`);
  console.log(`Deploying complete...`);
  console.log(`======================`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
