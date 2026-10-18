// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {Registry} from "src/Registry.sol";
import {Renderer} from "src/Renderer.sol";
import {Composer} from "src/Composer.sol";

/// Deploys the three launch contracts in one call, as the factory does.
contract ManifestDeployer {
    function deploy(address[8] memory a) external returns (Renderer r, Composer c, Registry reg) {
        r = new Renderer();
        c = new Composer();
        reg = new Registry(a[0], a[1], a[2], a[3], a[4], address(r), address(c), a[7]);
    }

    function deployRaw(address[8] memory a) external returns (Registry) {
        return new Registry(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
    }
}

contract ManifestTest is Test {
    address constant CURATOR = 0xcB0b0531e86A9aC36Fa865cA8e3dbccF047FDA91;
    address constant IDMD = 0x0000eC93127BAA929E58E97dd0095A2BFb38ec1D;
    address constant IMD = 0xD34a99Bc0f67aE1bbd63C660e6d0b0dd03E263B7;
    address constant INTAKE = 0xa43e6F75ee006411F79Ac1C84120606C2330DE82;
    address constant ATTESTER = 0x5598Aa9146215Bc13eb26f2c692Ad1461Fd32982;
    address constant EXECUTOR = 0xe29386719C155B6847aD5a4E97C6674f10ffc750;

    ManifestDeployer d;

    function setUp() public {
        vm.chainId(1);
        d = new ManifestDeployer();
    }

    function _args() internal pure returns (address[8] memory a) {
        a = [CURATOR, IDMD, IMD, INTAKE, ATTESTER, address(0x1001), address(0x1002), EXECUTOR];
    }

    function test_exactManifestDeploysOnEmptyChainInOneCall() public {
        (Renderer r, Composer c, Registry reg) = d.deploy(_args());
        assertEq(reg.symbol(), "SWORN");
        assertEq(reg.name(), "Sworn");
        assertEq(address(reg.curator()), CURATOR);
        assertEq(address(reg.idmd()), IDMD);
        assertEq(address(reg.imd()), IMD);
        assertEq(address(reg.intake()), INTAKE);
        assertEq(reg.attester(), ATTESTER);
        assertEq(address(reg.renderer()), address(r));
        assertEq(address(reg.composer()), address(c));
        assertEq(address(reg.burnExecutor()), EXECUTOR);
        assertGt(address(reg).code.length, 0);
        assertLe(address(reg).code.length, 24576);
        assertLe(address(r).code.length, 24576);
        assertLe(address(c).code.length, 24576);
    }

    /// Every one of the seven required addresses rejects zero; the executor alone may be zero.
    function testFuzz_zeroRequiredArgumentReverts(uint8 slot) public {
        slot = uint8(bound(slot, 0, 7));
        address[8] memory a = _args();
        a[slot] = address(0);
        if (slot == 7) {
            Registry reg = d.deployRaw(a);
            assertEq(address(reg.burnExecutor()), address(0));
        } else {
            vm.expectRevert(Registry.ZeroAddress.selector);
            d.deployRaw(a);
        }
    }

    /// Curator with code but IDMD without leaves the floor and reverts.
    function test_partialFloorChecksDependencies() public {
        vm.etch(CURATOR, hex"00");
        vm.expectRevert(Registry.DependencyHasNoCode.selector);
        d.deployRaw(_args());
    }

    function test_attesterRendererComposerOnlyCheckedForNonzero() public {
        address[8] memory a = _args();
        a[4] = address(0xBEEF1);
        a[5] = address(0xBEEF2);
        a[6] = address(0xBEEF3);
        Registry reg = d.deployRaw(a);
        // Not authenticated: the manifest must carry the exact addresses.
        assertEq(reg.attester(), address(0xBEEF1));
    }
}
