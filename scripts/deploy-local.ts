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

  // @ts-ignore
  const [owner] = await ethers.getSigners();

  const myTimelockController = await ethers.deployContract('MyTimelockController', [
    60 * 2 /* 2 minutes */,
    [owner.getAddress()],
    [owner.getAddress()],
    owner.getAddress()
  ]);
  await myTimelockController.waitForDeployment();

  console.log(`TimelockController deployed to: ${myTimelockController.target}`);
  const myGovernor = await ethers.deployContract('MyGovernor', [myERC20.target, myTimelockController.target]);
  await myGovernor.waitForDeployment();

  console.log(`MyGovernor deployed to: ${myGovernor.target}`);
  const proposerRole = await myTimelockController.PROPOSER_ROLE();
  const executorRole = await myTimelockController.EXECUTOR_ROLE();
  const adminRole = await myTimelockController.TIMELOCK_ADMIN_ROLE();

  await myTimelockController.grantRole(proposerRole, myGovernor.target);
  await myTimelockController.grantRole(executorRole, myGovernor.target);

  console.log(`MyGovernor granted to PROPOSER_ROLE and EXECUTER_ROLE`);

  await myERC20.grantMinterRole(myTimelockController.target);

  console.log(`MyTimelockController granted to MINTER_ROLE`);

  console.log(`======================`);
  console.log(`Deploying complete...`);
  console.log(`======================`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
