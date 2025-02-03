// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract MyToken {
    string public name = 'MyToken';
    string public symbol = 'MYT';
    uint256 public totalSupply = 1000000;
    address public owner;
    mapping(address => uint256) balances;

    event Trasfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool success) {
        require(balances[msg.sender] >= amount, 'Not enough tokens');

        console.log('Transferring from %s to %s %s tokens', msg.sender, to, amount);

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Trasfer(msg.sender, to, amount);
        return true;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}
