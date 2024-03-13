const getFirstName = (fullName) => fullName.split(" ")[0];

const lengthValidator = (password) => password.length >= 8;

// CommonJS Patter
module.exports = {
  getFirstName,
  lengthValidator,
};

// export {getFirstName}        // ESM Module Pattern
