// ESM Import
// import { getFirstName} from "../utils/validator"

// CommonJS import
const { getFirstName, lengthValidator } = require("../utils/validator");

test("Should returns the first name", () => {
  const firstName = getFirstName("Rachel Green");

  expect(firstName).toBe("Rachel");
});

test("Should return true if password length is greater then 8 characters", () => {
  const isGreaterThan8 = lengthValidator("pwd12345");

  expect(isGreaterThan8).toBeTruthy();
});

test("Should return false if password length is less than 8 characters", () => {
  const isLessThan8 = lengthValidator("pwd123");

  expect(isLessThan8).toBeFalsy();
});
