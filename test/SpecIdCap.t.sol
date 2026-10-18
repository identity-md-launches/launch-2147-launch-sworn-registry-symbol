// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {stdError} from "forge-std/StdError.sol";
import {Base} from "./Base.t.sol";
import {Spec} from "../src/Types.sol";

/// @notice Audit finding 602ef563 (low): uint16 spec ids run out. Reproduced; left unfixed by the
/// frozen-candidate rule (see ADAPTATION.md). This pins the observed behaviour.
contract SpecIdCapTest is Base {
    address internal alice = address(0xA11CE);
    bytes32 internal constant NEXT_SPEC_ID_SLOT = bytes32(uint256(24)); // offset 0, uint16

    function _setNext(uint16 v) internal {
        uint256 word = uint256(vm.load(address(registry), NEXT_SPEC_ID_SLOT));
        word = (word & ~uint256(0xffff)) | v;
        vm.store(address(registry), NEXT_SPEC_ID_SLOT, bytes32(word));
        assertEq(registry.nextSpecId(), v);
    }

    function _register(string memory name) internal {
        fund(alice, 6.4 ether);
        vm.prank(alice);
        imd.approve(address(registry), 6.4 ether);
        Spec memory s = t1Spec(CURATOR_ADDR, name);
        vm.prank(alice);
        registry.registerSpec(s);
    }

    function test_lastIdBelowCapStillRegisters() public {
        _setNext(65534);
        _register("Community");
        assertEq(registry.nextSpecId(), 65535);
    }

    function test_registerSpecRevertsAtUint16Max() public {
        _setNext(65535);
        fund(alice, 6.4 ether);
        vm.prank(alice);
        imd.approve(address(registry), 6.4 ether);
        Spec memory s = t1Spec(CURATOR_ADDR, "Community");
        vm.prank(alice);
        vm.expectRevert(stdError.arithmeticError);
        registry.registerSpec(s);
    }
}
