// 你的阿里云地址最后面跟上一个 /
// 在你当前小程序的后台的 uploadFile 合法域名也要配上这个域名
var fileHost = "https://iot.file.360lingqian.com/";
var config = {
  // aliyun OSS config
  uploadImageUrl: `${fileHost}`, // 默认存在根目录，可根据需求改
  AccessKeySecret: "XXXXXXX", // AccessKeySecret 去你的阿里云上控制台上找
  OSSAccessKeyId: "XXXXXXX", // AccessKeyId 去你的阿里云上控制台上找
  timeout: 87600, // 这个是上传文件时 Policy 的失效时间
};
export default config;
