import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('MyERC721', function () {
  async function deployFixture() {
    // @ts-ignore
    const [owner, account1] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory('MyERC721');
    const myERC721 = await contractFactory.deploy('TestNFT', 'MYNEFT');
    return { owner, account1, myERC721 };
  }

  describe('初期流通量とNFT作成のテスト', async function () {
    it('初期流量量は0である', async function () {
      const { myERC721 } = await loadFixture(deployFixture);
      expect(await myERC721.totalSupply()).to.equal(0);
    });

    it('NFTを作成する', async function () {
      const { account1, myERC721 } = await loadFixture(deployFixture);
      // NOTE: Contract に関して明示的な connect メソッドの呼び出しがなければ, ownerアカウントによる Transation発行
      await myERC721.safeMint(account1.address, 'https://example.com/nft1.json');
      // account1 には1つのNFTが発行されている
      expect(await myERC721.balanceOf(account1.address)).to.equal(1);

      // 全体のNFT総量が1増えている
      expect(await myERC721.totalSupply()).to.equal(1);
    });

    it('account1がMyERC721を作成できないこと', async function () {
      const { account1, myERC721 } = await loadFixture(deployFixture);
      await expect(
        myERC721.connect(account1).safeMint(account1.address, 'https://example.com/nft1.json')
      ).to.be.revertedWith(/AccessControl: account .* is missing role .*/);
    });
  });

  describe('MyERC721をtransferするテスト', async function () {
    it('MyERC721がtransferされること', async function () {
      const { owner, account1, myERC721 } = await loadFixture(deployFixture);
      // account1 にNFTを作成
      const transactionResponse = await myERC721.safeMint(account1.address, 'https://example.com/nft1.json');

      const logs = await myERC721.queryFilter(myERC721.filters.Transfer());
      const tokenId = logs.find((log) => log.transactionHash == transactionResponse.hash)!.args[2];

      // account1 から owner にNFTを transfer
      await myERC721.connect(account1).transferFrom(account1.address, owner.address, tokenId);

      // NFT が owner に transfer されていることの確認
      expect(await myERC721.ownerOf(tokenId)).to.equal(owner.address);
    });

    it('account1からowner保有のNFTをtransferできないこと', async function () {
      const { owner, account1, myERC721 } = await loadFixture(deployFixture);
      // owner にNFTを作成
      const transactionResponse = await myERC721.safeMint(owner.address, 'https://example.com/nft1.json');

      const logs = await myERC721.queryFilter(myERC721.filters.Transfer());
      const tokenId = logs.find((log) => log.transactionHash == transactionResponse.hash)!.args[2];

      // account1 から owner にNFTを transfer
      await expect(
        myERC721.connect(account1).transferFrom(owner.address, account1.address, tokenId)
      ).to.be.revertedWith(/ERC721: caller is not token owner or approved/);
    });

    it('NFT保有者がapproveすればaccount1からもowner保有のNFTをtransferできること', async function () {
      const { owner, account1, myERC721 } = await loadFixture(deployFixture);
      // owner にNFTを作成
      const transactionResponse = await myERC721.safeMint(owner.address, 'https://example.com/nft1.json');

      const logs = await myERC721.queryFilter(myERC721.filters.Transfer());
      const tokenId = logs.find((log) => log.transactionHash == transactionResponse.hash)!.args[2];

      // owner 保有のNFT に対する操作権限を account1 に付与
      await myERC721.connect(owner).setApprovalForAll(account1.address, true);

      // account1 から owner にNFTを transfer
      await myERC721.connect(account1).transferFrom(owner.address, account1.address, tokenId);

      // NFT が account1 に transfer されていることの確認
      expect(await myERC721.ownerOf(tokenId)).to.equal(account1.address);
    });
  });
});
