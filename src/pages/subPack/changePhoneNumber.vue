<template>
  <view class="login padding20">
    <view class="flex marginTop10 fontSize16 spaceBetween">
      <view>当前手机号</view>
      <view>{{telephone}}</view>
    </view>
    <view class="inputItem marginTop20">
      <view class="text">新手机号</view>
      <view class="gray marginTop10 padding020">
        <input v-model="userInfo.newPhone" @blur="validatePhone($event)" model:value="{{userInfo.newPhone}}"
               maxlength="11" type="number" placeholder="请输入手机号"/>
      </view>
    </view>
    <view class="inputItem marginTop20">
      <view class="text">验证码</view>
      <view class="gray marginTop10 padding020">
        <input v-model="userInfo.smsCode" maxlength="6" type="number" placeholder="请输入验证码"/>
        <text class="btn_text" @click="sendCode">{{text}}</text>
      </view>
    </view>
    <view class="btn-primary" @click="updatePhoneClick">确定修改</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {loginInfoApi, updatePhoneApi, smsCodeApi} from '../../api/index'

const telephone = ref()
const getLoginInfo = async () => {
  const res = await loginInfoApi({});
  telephone.value = res.data.otherInfo.phone
}
getLoginInfo()

const text = ref('发送')
const isSending = ref(false)
const countdown = ref(60)
const timer = ref(null)
const sendCode = () => {
  if (isSending.value) return;
  smsCodeApi({phone: userInfo.value.newPhone}).then(res => {
    if(res.data){
      userInfo.value.smsCode = res.data
    }
  })
  startCountdown()
}
const startCountdown = () => {
  isSending.value = true;
  timer.value = setInterval(() => {
    if (countdown.value <= 0) {
      clearInterval(timer.value);
      isSending.value = false;
      countdown.value = 60;
      text.value = '重新发送'
    } else {
      countdown.value--;
      text.value = countdown.value + 's';
    }
  }, 1000)
}
const userInfo = ref({
  merchantNum: uni.getStorageSync('userInfo').merchantNum,
  newPhone: '',
  smsCode: ''
})
const updatePhoneClick = () => {
  updatePhoneApi(userInfo.value).then(res => {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  })
}
const validatePhone = (e) => {
  let value = e.detail.value;
  const phoneRegex = /^1[3-9]\d{9}$/;
  if(value && !phoneRegex.test(value)){
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    userInfo.value.newPhone = ''
  }
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>
