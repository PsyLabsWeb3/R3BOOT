// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReWireContract {
    struct ReWire{
        uint256 amount;
        bool claimed;
        address creator;
    }

    mapping(bytes32 => ReWire) public r3wires;

    event ReWireCreated(bytes32 indexed hash, address indexed creator, uint256 amount);
    event ReWireRedeemed(bytes32 indexed hash, address indexed redeemer);
    event ReWireCanceled(bytes32 indexed hash);

    /// @notice Crea un ReWire bloqueando ETH en el contrato
    /// @param secretHash keccak256(utf8Bytes(secret)) calculado OFF-CHAIN
    function createReWire(bytes32 secretHash) external payable {
        require(msg.value > 0, "Amount must be > 0");
        require(r3wires[secretHash].amount == 0, "Already exists");

        r3wires[secretHash] = ReWire({
            amount: msg.value,
            claimed: false,
            creator: msg.sender
        });

        emit ReWireCreated(secretHash, msg.sender, msg.value);
    }

    /// @notice Reclama el ETH si conoces el secretHash
    function redeemReWire(bytes memory secret, bytes memory salt) external {
        bytes32 secretHash = keccak256(abi.encodePacked(secret, salt));
        ReWire storage v = r3wires[secretHash];
        require(v.amount > 0, "Not found");
        require(!v.claimed,    "Already claimed");

        v.claimed = true;
        payable(msg.sender).transfer(v.amount);

        emit ReWireRedeemed(secretHash, msg.sender);
    }

    /// @notice Permite al creador recuperar sus fondos si nadie lo ha reclamado
    function cancelReWire(bytes32 secretHash) external {
        ReWire storage v = r3wires[secretHash];
        require(v.creator == msg.sender, "Not creator");
        require(!v.claimed,             "Already claimed");

        v.claimed = true;
        payable(msg.sender).transfer(v.amount);

        emit ReWireCanceled(secretHash);
    }
}