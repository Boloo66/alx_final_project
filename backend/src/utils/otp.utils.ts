export const generateRandomCode = ({
  stringOnly = false,
  length = 6,
}: { stringOnly?: boolean; length?: number } = {}) => {
  let ref = "";
  const pool = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz${
    stringOnly ? "" : "0123456789"
  }`;
  for (let i = 0; i < length; i++) {
    ref += pool.charAt(Math.floor(Math.random() * pool.length));
  }

  return ref;
};

export const generateReference = (length = 7, appendPlatform = false) => {
  const prefix = appendPlatform ? "ECOMM-" : "";
  const randomCode = generateRandomCode({ length, stringOnly: false });
  const ref = `${prefix}${randomCode}`;

  return ref;
};
