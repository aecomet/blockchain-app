// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract MyERC20 is ERC20, Ownable, ERC20Permit, ERC20Votes, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
    constructor() ERC20('MyERC20', 'ME2') ERC20Permit('MyERC20') {
        // トークンを作成者に1,000,000 渡す
        _mint(msg.sender, 1000000);
        Ownable(msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev トークン発行
     */
    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a minter');
        _mint(to, amount);
    }

    /**
     * @dev トークン発行関数
     */
    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

    /**
     * 新たなアドレスに権限割り当て
     */
    function grantMinterRole(address minterAddress) public onlyOwner {
        _grantRole(MINTER_ROLE, minterAddress);
    }
}
