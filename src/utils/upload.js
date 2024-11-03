/**
 * 文件上传模块
 **/
import { ossSTSTokenApi } from "../api/index";
import OSS from "ali-oss";
import {getFormDataParams} from './ossConfig.js';

export async function getOssToken(bizType) {
  const res = await ossSTSTokenApi({
    domain: "iot.file.360lingqian.com",
    forceUpdate: true,
    bizType,
  });
  return {
    ...res.data,
    stsToken: res.data.securityToken,
  };
}

export function uploadToOss({ file, bizType }) {
  return new Promise(async (resolve, reject) => {
      const res = await getOssToken(bizType);
      const client = new OSS({
        region: "oss-cn-beijing",
        ...res,
        refreshSTSToken: getOssToken,
        bucket: "globalpay-iotcard",
      });
      const fileName = res.dir + file.uuid + "." + file.extname;
      const formData = await getFormDataParams(res);
      const uploadResult = await uni.uploadFile({
        url: 'https://iot.file.360lingqian.com',
        filePath: file.path,
        name: 'file',
        formData: {
          key: fileName.startsWith('/') ? fileName.substring(1) : fileName,
          ...formData
        }
      });
      if (uploadResult.statusCode === 204) {
        resolve({
          url: fileName
        });
      } else {
        reject('上传失败');
      }
  });
}
