import test from "node:test";
import assert from "node:assert";

import forTesting from "../utils/for_testing.js";
const { reverse } = forTesting;
test("reverse of a", () => {
  const result = reverse("a");

  assert.strictEqual(result, "a");
});

test("reverse of react", () => {
  const result = reverse("react");

  assert.strictEqual(result, "tcaer");
});

test("reverse of saippuakauppias", () => {
  const result = reverse("saippuakauppias");

  assert.strictEqual(result, "saippuakauppias");
});
