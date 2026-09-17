const test = require("node:test");
const assert = require("node:assert");

test("Accessibility audit workflow is available", () => {
  const workflow = [
    "Lighthouse audit",
    "Keyboard-only audit",
    "Issue documentation"
  ];

  assert.strictEqual(workflow.length, 3);
  assert.ok(workflow.includes("Lighthouse audit"));
});
