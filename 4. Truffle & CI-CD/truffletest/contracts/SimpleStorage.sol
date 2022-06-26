// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

//version avec constructeur pour deployScript

contract SimpleStorage {
    uint256 storageData;
    event Uset(uint256 number);

    constructor(uint256 _n) payable {
        set(_n);
    }

    function get() public view returns (uint256) {
        return storageData;
    }

    function set(uint256 n) public {
        require(n != 12, "12 is fordbidden");
        storageData = n;
        emit Uset(n);
    }
}
