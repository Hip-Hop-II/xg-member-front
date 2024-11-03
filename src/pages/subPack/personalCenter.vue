<template>
  <view class="personalCenter padding20 backColorFFFFFF">
    <view class="flex spaceBetween marginBottom20 fontSize18">
      <view>编号</view>
      <view class="text-align-right marginRight20">{{myInfo.merchantNum}}</view>
    </view>
    <view class="flex spaceBetween marginBottom20 fontSize18 marginTop20">
      <view>姓名</view>
      <view class="text-align-right marginRight20">{{myInfo.name}}</view>
    </view>
    <view class="flex spaceBetween marginBottom20 fontSize18 arrow_bg marginTop20"
          @click="jumpPath('changePhoneNumber')">
      <view>手机号</view>
      <view class="text-align-right marginRight20">{{myInfo.otherInfo.phone}}</view>
    </view>
    <view class="flex spaceBetween marginBottom20 fontSize18 arrow_bg marginTop20"
          @click="jumpPath('changePassword')">
      <view>登录密码</view>
      <view class="text-align-right marginRight20">{{myInfo.password}}</view>
    </view>
    <view class="flex spaceBetween marginBottom20 fontSize18 marginTop20">
      <view>邮箱</view>
      <view class="text-align-right marginRight20">{{myInfo.email}}</view>
    </view>
<!--    <view class="flex spaceBetween marginBottom20 fontSize18 arrow_bg marginTop20"-->
<!--          @click="jumpPath('verificationCode')">-->
<!--    <view class="flex spaceBetween marginBottom20 fontSize18 arrow_bg marginTop20"-->
<!--          @click="jumpPath('addBankCard')">-->
      <view class="flex spaceBetween marginBottom20 fontSize18 arrow_bg marginTop20">
      <view>证件材料</view>
    </view>
    <view class="flex spaceBetween marginTop20 fontSize18">
      <view>状态</view>
      <view v-if="myInfo.statusCode === 'success'" class="text-align-right marginRight20">
        {{myInfo.statusMsg}}
      </view>
      <view v-else class="text-align-right marginRight20 colorFF3333">
        {{myInfo.statusMsg}}
      </view>
    </view>
    <view v-if="myInfo.statusCode !== 'success'" class="backColorF7F7F7 padding20 fontSize16 borderRadius colorFF3333 marginTop10 text-align-center"
          v-html="'因存在异常提现记录，平台数据核实中！<br>风控规则：临时关闭提现、转账等资金操作'"/>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {loginInfoApi} from '../../api/index'

const myInfo = ref({})
const getAccountInfo = async () => {
  const res = await loginInfoApi({});
  if(res.data){
    myInfo.value = res.data
    myInfo.value.memberName = uni.getStorageSync('userInfo').memberName
    myInfo.value.statusCode = uni.getStorageSync('userInfo').statusCode
    myInfo.value.statusMsg = uni.getStorageSync('userInfo').statusMsg
  }
}
getAccountInfo()

const jumpPath = (path) => {
  uni.navigateTo({
    url: `/pages/subPack/${path}`
  })
}
</script>

