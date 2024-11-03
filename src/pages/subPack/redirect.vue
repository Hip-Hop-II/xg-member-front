<template>
  <view class="container">
    <image src="/static/images/success.png" class="status-icon"
      v-if="cardInfo?.certificationInfo?.isCertification === 1" />
    <image src="/static/images/fail.png" class="status-icon" v-else />
    <view class="status-text">{{ cardInfo?.certificationInfo?.isCertification === 1 ? '激活成功' : '未激活' }}</view>
    <view class="title">温馨提示</view>
    <template v-if="!cardInfo?.certificationInfo?.isCertification">
      <view class="status-text">应工信部要求您的卡需要实名认证才能正常使用</view>
      <view class="btn-primary marginTop20" @click="redirect">实名认证</view>
    </template>
    <template v-else>
      <view class="status-text">添加白名单后可与好友通话</view>
      <view class="btn-primary marginTop20" @click="redirect">添加白名单</view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, shallowRef, toRaw } from 'vue';

interface CardInfo {
  certificationInfo: CertificationInfo;
  iccid: string;
  expireDate: string;
  msisdn: string;
  operator: string; //运营商 -1.未知  1.移动 2.联通 3.电信 4.广电
  remainFee: number;
  remainFlow: number;
  packageInfo: OrderPackageInfo[];
  whiteListInfo: WhiteListInfo;
}
interface CertificationInfo {
  isCertification: number;
  isNeedCertification: number;
}
interface OrderPackageInfo {
  expireDate: string;
  startDate: string;
  packageId: string;
  packageName: string;
}
interface WhiteListInfo {
  isNeedWhiteList: number;
  whiteList: Contact[];
}
interface Contact {
  contactName: string;
  contactPhone: string;
}

const cardInfo = shallowRef<CardInfo>();
const queryInfo = reactive<{
  iccid: string;
  deviceId: string;
  merchantNum: string;
  saasMerchantNum: string;
}>({
  iccid: '',
  deviceId: '',
  merchantNum: '',
  saasMerchantNum: ''
});

const redirect = () => {
  uni.navigateToMiniProgram({
    appId: cardInfo.value?.operator === '1' ? 'wx3ba2e298a5b24077' : 'wxa5b3db0cd2c5a1ed',
    path: cardInfo.value?.operator === '1' ? 'pages/index/index' : `pages/login/index?iccid=${cardInfo.value?.iccid}`,
  });
}

const query = () => {
  const envPath = (import.meta as any).env.PROD ? '/globalpay/web' : '/iotMall/api';
  uni.request({
    url: (import.meta as any).env.VITE_API_HOST + envPath + '/device/v1/detail',
    method: 'POST',
    data: toRaw(queryInfo),
    success(res) {
      cardInfo.value = (res.data as any).data;
      if (!cardInfo.value?.certificationInfo?.isCertification || !cardInfo.value?.whiteListInfo?.whiteList?.length) {
        redirect();
      }
    }
  });
}

onLoad(({ iccid, deviceId, merchantNum, saasMerchantNum }: any) => {
  queryInfo.deviceId = deviceId;
  queryInfo.iccid = iccid;
  queryInfo.merchantNum = merchantNum;
  queryInfo.saasMerchantNum = saasMerchantNum;
});

onShow(() => {
  query();
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background: #fff;
  text-align: center;
  padding: 0 60rpx;
}

.status {
  &-icon {
    width: 120rpx;
    height: 120rpx;
    margin-top: 100rpx;
  }

  &-text {
    color: #1A1A1A;
    font-size: 40rpx;
    margin-top: 30rpx;
  }
}

.title {
  margin-top: 120rpx;
  color: #ff3333;
  font-size: 60rpx;
  font-weight: 500;
}
</style>