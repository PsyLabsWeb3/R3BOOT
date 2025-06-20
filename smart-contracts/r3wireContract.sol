// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract R3wireContract {
    struct R3wire{
        uint256 amount;
        bool claimed;
        address creator;
    }

    mapping(bytes32 => R3wire) public r3wires;

    event R3wireCreated(bytes32 indexed hash, address indexed creator, uint256 amount);
    event R3wireRedeemed(bytes32 indexed hash, address indexed redeemer);
    event R3wireCanceled(bytes32 indexed hash);

    /// @notice Creates a R3wire, blocking ETH in the contract
    /// @param secretHash keccak256 calculated offchain
    function createR3wire(bytes32 secretHash) external payable {
        require(msg.value > 0, "Amount must be > 0");
        require(r3wires[secretHash].amount == 0, "Already exists");

        r3wires[secretHash] = R3wire({
            amount: msg.value,
            claimed: false,
            creator: msg.sender
        });

        emit R3wireCreated(secretHash, msg.sender, msg.value);
    }

    /// @notice Reclaims the funds of a R3wire using the secret and salt
    function redeemR3wire(bytes memory secret, bytes memory salt) external {
        bytes32 secretHash = keccak256(abi.encodePacked(secret, salt));
        R3wire storage v = r3wires[secretHash];
        require(v.amount > 0, "Not found");
        require(!v.claimed, "Already claimed");

        v.claimed = true;
        payable(msg.sender).transfer(v.amount);

        emit R3wireRedeemed(secretHash, msg.sender);
    }

    /// @notice Allows the creator to cancel a R3wire and reclaim the funds
    function cancelR3wire(bytes32 secretHash) external {
        R3wire storage v = r3wires[secretHash];
        require(v.creator == msg.sender, "Not creator");
        require(!v.claimed, "Already claimed");

        v.claimed = true;
        payable(msg.sender).transfer(v.amount);

        emit R3wireCanceled(secretHash);
    }
}