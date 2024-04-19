// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Reward1 is Ownable {
    IERC20 public token;

    event Claimed(address indexed token, address indexed to, uint256 amount);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function setToken(address _token) external onlyOwner {
        require(_token != address(0), "Reward:Invalid token address");
        token = IERC20(_token);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(
            token.balanceOf(address(this)) >= amount,
            "Reward:Insufficient token balance"
        );
        token.transfer(msg.sender, amount);
    }

    function claimReward(uint256 amount, address to) external onlyOwner {
        require(to != address(0), "Reward:Invalid to address");
        require(
            amount <= token.balanceOf(address(this)),
            "Reward:Insufficient token balance"
        );

        token.transfer(to, amount);

        emit Claimed(address(token), to, amount);
    }
}
