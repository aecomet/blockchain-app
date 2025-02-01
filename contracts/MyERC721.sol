// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// スマートコントラクトにRBACを追加
import '@openzeppelin/contracts/access/AccessControl.sol';

// NFT にメタ情報格納先URIをh返却する機能を追加
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

// 所有者ごとの tokenId を返却する機能を追加
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

contract MyERC721 is ERC721URIStorage, ERC721Enumerable, AccessControl {
    uint256 private _tokenIdCounter;

    // @dev このNFTを作成できる権限を表す定数１
    bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

    /**
    @dev 継承した OpenZeppelin ERC721.sol のコンストラクタが呼び出される<br>
    コントラクトをデプロイしたアカウントに MINTER_ROLE を付与

   */
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        // ロール管理者
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _grantRole(MINTER_ROLE, _msgSender());
    }

    /**
    @dev MINTER_ROLE を持つアカウントのみが NFT を作成できる<br>
    作成された NFT は指定されたアドレスに送信される<br>
    作成された NFT は tokenId が返却される<br>
    @param to NFT を送信するアドレス
    @param _tokenURI NFT のメタ情報格納先URI
    @return 作成された NFT の tokenId
 */
    function safeMint(address to, string memory _tokenURI) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 id = _tokenIdCounter;
        _tokenIdCounter = _tokenIdCounter + 1;
        _safeMint(to, id);
        _setTokenURI(id, _tokenURI);
        return id;
    }

    /**
    @dev tokenId に対応する NFT のメタ情報格納先URIを返却する<br>
    @param tokenId メタ情報格納先URIを取得する NFT の tokenId
    @return tokenId に対応する NFT のメタ情報格納先URI
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
    @dev _beforeTokenTransfer をオーバーライドして、トークンの移動前に任意の処理を実行する<br>
    この関数は、ERC721Enumerable と ERC721 の両方でオーバーライドされている<br>
    @param from トークンを移動するアドレス
    @param to トークンを受け取るアドレス
    @param tokenId トークンの tokenId
    @param batchSize トークンのバッチサイズ
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
@dev _burn をオーバーライドして、トークンを燃やす前に任意の処理を実行する<br>
この関数は、ERC721URIStorage と ERC721 の両方でオーバーライドされている<br>
@param tokenId 燃やすトークンの tokenId
 */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
@dev このコントラクトがサポートするインターフェースを返却する<br>
この関数は、ERC721Enumerable、ERC721URIStorage、AccessControl のサポートインターフェースを返却する<br>
@param interfaceId サポートされているか確認するインターフェースID
@return サポートされている場合は true、そうでない場合は false
 */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
