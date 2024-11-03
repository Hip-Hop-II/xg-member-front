<template>
  <view class="login padding20">
    <view class="inputItem marginTop20">
      <view class="text">手机号</view>
      <view class="gray marginTop10 padding020">
        <input v-model="userInfo.phone" readonly/>
      </view>
    </view>
    <view class="inputItem marginTop20">
      <view class="text">验证码</view>
      <view class="gray marginTop10 padding020">
        <input v-model="userInfo.smsCode" maxlength="6" type="number" placeholder="请输入验证码"/>
        <text class="btn_text" @click="sendCode">{{text}}</text>
      </view>
    </view>
    <view class="inputItem marginTop20">
      <view class="text">旧密码</view>
      <view class="gray marginTop10 padding020">
        <input v-model="userInfo.oldPwd" type="password"
               @blur="validatePassword($event)" placeholder="请输入新密码"/>
      </view>
    </view>
    <view class="inputItem marginTop20">
      <view class="text">新密码</view>
      <view class="gray marginTop10 padding020">
        <input v-model="userInfo.newPwd" type="password"
               @blur="validatePassword($event)" placeholder="请输入新密码"/>
      </view>
    </view>
    <view class="color999999 fontSize12 text-align-center marginTop10">{{tipText}}</view>
    <view class="inputItem marginTop10">
      <view class="text">确认密码</view>
      <view class="gray marginTop10 padding020">
        <input v-model="confirmPwd" type="password"
               @blur="validatePassword($event)" placeholder="请输入确认密码"/>
      </view>
    </view>
    <view class="btn-primary" @click="updatePwdClick">确定修改</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {loginInfoApi, updatePwdApi, smsCodeApi} from '../../api/index'

const userInfo = ref({
  merchantNum: uni.getStorageSync('userInfo').merchantNum,
  phone: '',
  smsCode: '',
  oldPwd: '',
  newPwd: ''
})
const confirmPwd = ref()
const getLoginInfo = async () => {
  const res = await loginInfoApi({});
  userInfo.value.phone = res.data.otherInfo.phone
}
getLoginInfo()

const tipText = ref('密码需要长度8-18的字母和数字组成，不包括特殊字符')

const validatePassword = (e) =>{
  let value = e.detail.value;
  const regex = /^[A-Za-z0-9]{8,18}$/; // 匹配8到18位的字母和数字
  if (!regex.test(value)) {
    uni.showToast({
      title: tipText.value,
      icon: 'none'
    })
  }
}
const text = ref('发送')
const isSending = ref(false)
const countdown = ref(60)
const timer = ref(null)
const sendCode = () => {
  if (isSending.value) return;
  smsCodeApi({phone: userInfo.value.phone}).then(res => {
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
const updatePwdClick = () => {
  if(confirmPwd.value !== userInfo.value.newPwd){
    uni.showToast({
      title: '2次密码不一致，重新输入',
      icon: 'none'
    })
    return
  }
  updatePwdApi(userInfo.value).then(res => {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  })
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>
