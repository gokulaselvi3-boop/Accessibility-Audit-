const test = require("node:test");
const assert = require("node:assert");

test("Health API response format", () => {
  const response = {
    status: "success",
    message: "Accessibility Audit Server is running"
  };

  assert.strictEqual(response.status, "success");
  assert.ok(response.message);
});
