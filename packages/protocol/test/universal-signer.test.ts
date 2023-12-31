import { ethers } from "ethers";
import { UniversalSigner } from "../src";

const PRIVATE_KEY_FOR_TESTS =
  "0x1111111111111111111111111111111111111111111111111111111111111111";

describe("UniversalSigner", () => {
  const stringifiableData = [
    { hehe: 123, haha: 234 },
    { hehe: 123, haha: 234 },
    { hehe: 42, haha: 234 },
    { hehe: 123, haha: 42, hoho: 3498363.344 },
  ];

  test("Should correctly calculate digest for data", () => {
    const digest = UniversalSigner.getDigestForData(stringifiableData);
    expect(digest).toBe(
      "0x230a650f45bd2fb93390f0e372a77022536e6d9da6408aa3f1b2f28e04fb2011"
    );
  });

  test("Should properly sign and verify stringifiable data", () => {
    const signature = UniversalSigner.signStringifiableData(
      stringifiableData,
      PRIVATE_KEY_FOR_TESTS
    );
    const recoveredSigner = UniversalSigner.recoverSigner(
      stringifiableData,
      signature
    );
    expect(recoveredSigner).toBe(
      new ethers.Wallet(PRIVATE_KEY_FOR_TESTS).address
    );
  });

  test("Should not verify incorrectly signed data", () => {
    const signature = UniversalSigner.signStringifiableData(
      stringifiableData,
      PRIVATE_KEY_FOR_TESTS
    );
    const recoveredSigner = UniversalSigner.recoverSigner(
      [...stringifiableData, { hoho: 100 }],
      signature
    );
    expect(recoveredSigner).not.toBe(
      new ethers.Wallet(PRIVATE_KEY_FOR_TESTS).address
    );
  });

  test("Should sign with Ethereum Hash Message", async () => {
    const wallet = new ethers.Wallet(PRIVATE_KEY_FOR_TESTS);
    const testMessage = "test-message";
    const signature = await UniversalSigner.signWithEthereumHashMessage(
      wallet,
      testMessage
    );
    const expectedSignature =
      "0x13a3b3930428252cd84869dda483619bf2167011afbf3a32d0dc69b559848f0c007c55e25cb7a3f0a17f59986b106dca0ebf44f14dcb55f94fe035c40dabba731b";
    expect(signature).toBe(expectedSignature);
  });

  test("Should verify Ethereum Hash Message", () => {
    const testMessage = "test-message";
    const signature =
      "0x13a3b3930428252cd84869dda483619bf2167011afbf3a32d0dc69b559848f0c007c55e25cb7a3f0a17f59986b106dca0ebf44f14dcb55f94fe035c40dabba731b";
    const recoveredAddress =
      UniversalSigner.recoverAddressFromEthereumHashMessage(
        testMessage,
        signature
      );
    expect(recoveredAddress).toBe(
      new ethers.Wallet(PRIVATE_KEY_FOR_TESTS).address
    );
  });
});
