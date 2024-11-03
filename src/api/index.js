import request from "../utils/request.js";

export function openIdApi(data) {
  return request.post("/mp/auth/v1/openId", data);
}

export function loginApi(data) {
  return request.post("/mp/auth/v1/login", data);
}

export function loginInfoApi(data) {
  return request.post("/mp/auth/v1/info", data);
}

export function logoutApi(data) {
  return request.post("/mp/auth/v1/logout", data);
}

export function getMemberInfoApi(data) {
  return request.post("/mp/memberInfo/v1/detail", data);
}

export function companyInfoFirstApi(data) {
  return request.post("/mp/memberInfo/v1/companyInfo/first", data);
}

export function companyInfoSecondApi(data) {
  return request.post("/mp/memberInfo/v1/companyInfo/second", data);
}

export function personInfoApi(data) {
  return request.post("/mp/memberInfo/v1/personInfo", data);
}

export function saveFileApi(data) {
  return request.post("/mp/memberInfo/v1/saveFile", data);
}

export function delFileApi(data) {
  return request.post("/mp/memberInfo/v1/delFile", data);
}

export function getAreaCodeApi(data) {
  return request.post("/mp/common/v1/provinceCityCodePageList", data);
}

export function getBankListApi(data) {
  return request.post("/mp/common/v1/bankList", data);
}

export function ossSTSTokenApi(data) {
  return request.post("/mp/common/v1/ossSTSToken", data);
}

export function enterpriseCommitApi(data) {
  return request.post("/mp/memberInfo/v1/commit", data);
}

export function accountInfoApi(data) {
  return request.post("/mp/accountInfo/v1/detail", data);
}

export function getBankSubListApi(data) {
  return request.post("/mp/common/v1/bankSub", data);
}

export function getCommonMccApi(data) {
  return request.post("/mp/common/v1/mcc", data);
}

export function fundWithdrawPageListApi(data) {
  return request.post("/mp/accountInfo/v1/fundWithdrawPageList", data);
}

export function fundWithdrawDetailApi(data) {
  return request.post("/mp/accountInfo/v1/fundWithdrawDetail", data);
}

export function fundSettlementPageListApi(data) {
  return request.post("/mp/accountInfo/v1/fundSettlementPageList", data);
}

export function fundSettlementDetailApi(data) {
  return request.post("/mp/accountInfo/v1/fundSettlementDetail", data);
}

export function orderPageListApi(data) {
  return request.post("/mp/accountInfo/v1/orderPageList", data);
}

export function orderDetailApi(data) {
  return request.post("/mp/accountInfo/v1/orderDetail", data);
}

export function fundWithdrawbankListApi(data) {
  return request.post("/mp/accountInfo/v1/bankList", data);
}

export function fundWithdrawSmsCodeApi(data) {
  return request.post("/mp/sms/v1/fundWithdrawSmsCode", data);
}

export function fundWithdrawAddApi(data) {
  return request.post("/mp/accountInfo/v1/fundWithdrawAdd", data);
}

export function fundSettlementAddApi(data) {
  return request.post("/mp/accountInfo/v1/fundSettlementAdd", data);
}

export function merchantClassifyListApi(data) {
  return request.post("/mp/common/v1/merchantClassifyPageList", data);
}

export function updatePhoneApi(data) {
  return request.post("/mp/auth/v1/updatePhone", data);
}

export function smsCodeApi(data) {
  return request.post("/mp/sms/v1/smsCode", data);
}

export function updatePwdApi(data) {
  return request.post("/mp/auth/v1/updatePwd", data);
}

export function idAuthSmsCodeApi(data) {
  return request.post("/mp/sms/v1/idAuthSmsCode", data);
}

export function registerInfoApi(data) {
  return request.post("/mp/memberInfo/v1/registerInfo", data);
}

export function postAccountInfoApi(data) {
  return request.post("/mp/memberInfo/v1/accountInfo", data);
}

export function companyBaseInfoApi(data) {
  return request.post("/mp/memberInfo/v1/companyBaseInfo", data);
}
