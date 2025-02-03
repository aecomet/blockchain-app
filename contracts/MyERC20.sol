// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MyERC20 is ERC20 {
    constructor() ERC20('MyERC20', 'ME2') {
        // トークンを作成者に1,000,000 渡す
        _mint(msg.sender, 1000000);
    }
}
