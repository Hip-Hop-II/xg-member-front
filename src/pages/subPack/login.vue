<template>
  <view class="login padding020">
    <view class="title" v-html="'请登录账户<br>查看完整内容'"></view>

    <view class="flex switchTab">
      <view :class="[{ 'tabActive': tabIndex === 1 }, 'tab']" @click="tabClick(1)">账号登录</view>
      <!-- <view :class="[{ 'tabActive': tabIndex === 2 }, 'tab']" @click="tabClick(2)">验证码登录</view> -->
    </view>
    <view v-if="tabIndex === 1">
      <view class="inputItem marginTop20">
        <view class="text">用户名</view>
        <view class="gray marginTop10 padding020">
          <input v-model="loginForm.loginName" placeholder="请输入用户名" />
        </view>
      </view>
      <view class="inputItem marginTop20">
        <view class="text">密码</view>
        <view class="gray marginTop10 padding020">
          <input v-model="loginForm.password" minlength="6" type="password" placeholder="请输入至少6位密码" />
        </view>
      </view>
    </view>

    <view v-if="tabIndex === 2">
      <view class="inputItem marginTop20">
        <view class="text">手机号</view>
        <view class="gray marginTop10 padding020">
          <input v-model="loginForm.phone" @blur="validatePhone($event)" model:value="{{loginForm.phone}}"
            maxlength="11" placeholder="请输入手机号" />
        </view>
      </view>
      <view class="inputItem marginTop20">
        <view class="text">验证码</view>
        <view class="gray marginTop10 padding020">
          <input v-model="loginForm.smsCode" maxlength="6" type="text" placeholder="请输入验证码" />
          <text class="btn_text" @click="sendCode">{{ text }}</text>
        </view>
      </view>
    </view>
    <view class="btn-primary" @click="loginClick()">确定</view>
    <navigator target="miniProgram" open-type="exit" hover-class="none">
      <view class="cancel">取消登录</view>
    </navigator>
  </view>
  <view class="fixedBottom text-align-center color666666 fontSize12">京ICP备17020774号-8X</view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { loginApi, getMemberInfoApi, smsCodeApi } from '../../api/index'

const tabIndex = ref(1)
const loginForm = ref({
  loginName: "",
  password: "",
  phone: "",
  smsCode: "",
  openId: uni.getStorageSync('openId')
})
const tabClick = (index) => {
  tabIndex.value = index
}
const text = ref('发送')
const isSending = ref(false)
const countdown = ref(60)
const timer = ref(null)
const sendCode = () => {
  if (isSending.value) return;
  smsCodeApi({ phone: loginForm.value.phone }).then(res => { })
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

const loginClick = () => {
  if (tabIndex.value === 1) {
    if (!loginForm.value.loginName) {
      uni.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return
    }
    if (loginForm.value.password.length < 6) {
      uni.showToast({
        title: '密码长度不能小于6位',
        icon: 'none'
      });
      return
    }
  }
  if (tabIndex.value === 2 && !loginForm.value.phone && !loginForm.value.smsCode) {
    uni.showToast({
      title: '请输入手机号或验证码码',
      icon: 'none'
    })
    return
  }
  loginApi(loginForm.value).then((res: any[]) => {
    if (res.code === 200) {
      uni.setStorage({
        key: 'userInfo',
        data: res.data
      })
      if (res.data.statusCode === 'created') {
        uni.showToast({
          title: res.data.statusMsg,
          icon: 'none'
        })
        getMemberInfoApi({}).then(res => {
          if (res.data && res.data.nextStep && res.data.nextStep.url) {
            goAuth(res.data.nextStep.url)
          } else {
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/subPack/bankInfo'
              })
            }, 500)
          }
        })
      } else {
        uni.navigateTo({
          url: '/pages/my/index'
        })
      }
    }
  })
}
const goAuth = (fadada_url) => {
  wx.navigateTo({
    url: "/pagesFace/pages/webview/webview?url=" + encodeURIComponent(fadada_url)
  });
}
const validatePhone = (e) => {
  let value = e.detail.value;
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (value && !phoneRegex.test(value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    loginForm.value.phone = ''
  }
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>
