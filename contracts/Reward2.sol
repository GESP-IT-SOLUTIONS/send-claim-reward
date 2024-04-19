// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Reward2 is Ownable, ReentrancyGuard {
    bytes32 private constant DOMAIN_NAME = keccak256("ILMT");
    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );
    bytes32 public constant CLAIM_TYPEHASH =
        keccak256(
            abi.encodePacked(
                "Claim(address token,address to,uint256 amount,uint256 nonce)"
            )
        );

    bytes32 public DOMAIN_SEPARATOR;

    IERC20 public token;
    mapping(address => uint256) public nonces;
    mapping(bytes32 => bool) used;

    event Claimed(address indexed token, address indexed to, uint256 amount);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);

        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                DOMAIN_NAME,
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    function claimReward(
        address to,
        uint256 amount,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        require(
            token.balanceOf(address(this)) >= amount,
            "Reward:Insufficient token balance"
        );
        uint256 nonce = nonces[msg.sender];

        bytes32 digest = buildClaimSeparator(amount, to, nonce);
        require(!used[digest], "Reward:Invalid Digest");
        used[digest] = true;
        nonces[msg.sender] += 1;

        address signer = ecrecover(digest, v, r, s);
        require(signer == owner(), "Reward:Invalid signatures");
        token.transfer(to, amount);

        emit Claimed(address(token), to, amount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(
            token.balanceOf(address(this)) >= amount,
            "Reward:Insufficient token balance"
        );
        token.transfer(msg.sender, amount);
    }

    function buildClaimSeparator(
        uint256 amount,
        address to,
        uint256 nonce
    ) public view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR,
                    keccak256(
                        abi.encode(
                            CLAIM_TYPEHASH,
                            address(token),
                            to,
                            amount,
                            nonce
                        )
                    )
                )
            );
    }
}
