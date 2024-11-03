<template>
  <view class="enterpriseInfo">
    <view class="list-item">
      <view class="flex borderBottom">
        <view class="width120">姓名</view>
        <view>张三</view>
      </view>
      <view class="flex borderBottom">
        <view class="width120">身份证号</view>
        <input v-model="userInfo.name" class="input" type="text" placeholder="请输入身份证号"/>
      </view>
      <view class="flex borderBottom">
        <view class="width120">银行卡号</view>
        <input v-model="userInfo.mobile" class="input" type="text" placeholder="请输入银行卡号"/>
      </view>
      <view class="flex borderBottom">
        <view class="width120">银行预留手机号</view>
        <input v-model="userInfo.email" class="input" type="text" placeholder="请输入银行预留手机号"/>
      </view>
    </view>
    <view class="btn-primary marginLeft20 marginRight20">下一步</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
let userInfo = ref({
  name: '',
  mobile: '',
  email: ''
})

const validatePhone = (e) => {
  let value = e.detail.value;
  const phoneRegex = /^1[3-9]\d{9}$/;
  if(value && !phoneRegex.test(value)){
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    userInfo.value.mobile = ''
  }
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>
