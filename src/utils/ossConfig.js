import crypto from "crypto-js";
import { Base64 } from "js-base64";

// 计算签名。
function computeSignature(accessKeySecret, canonicalString) {
  return crypto.enc.Base64.stringify(
    crypto.HmacSHA1(canonicalString, accessKeySecret)
  );
}

const date = new Date();
date.setHours(date.getHours() + 1);
const policyText = {
  expiration: date.toISOString(), // 设置policy过期时间。
  conditions: [
    // 限制上传大小。
    ["content-length-range", 0, 1024 * 1024 * 1024],
  ],
};

export async function getFormDataParams(data) {
  const policy = Base64.encode(JSON.stringify(policyText)); // policy必须为base64的string。
  const signature = computeSignature(data.accessKeySecret, policy);
  const formData = {
    OSSAccessKeyId: data.accessKeyId,
    signature,
    policy,
    "x-oss-security-token": data.securityToken,
  };
  return formData;
}
