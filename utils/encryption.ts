import CryptoJS from "crypto-js";

export const encryptAES = (text: string): string => {
  console.log(process.env.NEXT_PUBLIC_AUTH_SECRET_KEY);
  return CryptoJS.AES.encrypt(
    text,
    process.env.NEXT_PUBLIC_AUTH_SECRET_KEY || "default-key"
  ).toString();
};

export const decryptAES = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    process.env.NEXT_PUBLIC_AUTH_SECRET_KEY || "default-key"
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};
