// ESM Import
// import { getFirstName} from "../utils/validator"

// CommonJS import
const { getFirstName } = require("../utils/validator");

test("Should returns the first name", () => {
  const firstName = getFirstName("Rachel Green");

  expect(firstName).toBe("Rachel");
});
