<template>
  <view class="enterpriseInfo">
    <view class="list-item">
      <view class="flex spaceBetween borderBottom">
        <view class="width70">编号</view>
        <view>{{ merchantForm.merchantNum }}</view>
      </view>
      <view class="flex spaceBetween borderBottom">
        <view class="width70">昵称</view>
        <view>{{ merchantForm.nickName }}</view>
      </view>
      <view class="flex spaceBetween borderBottom">
        <view class="width70">电话</view>
        <view class="gray marginTop10 flex">
          <input v-model="merchantForm.lawPersonTelephone" @blur="validatePhone($event)"
            model:value="{{merchantForm.lawPersonTelephone}}" maxlength="11" class="input" placeholder="请输入手机号" />
          <view class="btn_text" @click="getTelCode">{{ text }}</view>
        </view>
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">验证码</view>
        <input v-model="merchantForm.smsCode" maxlength="5" class="input" type="text" placeholder="请输入验证码" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">邮箱</view>
        <input v-model="merchantForm.contractEmail" @blur="validateEmail($event)"
          model:value="{{merchantForm.contractEmail}}" class="input" type="text" placeholder="请输入邮箱" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">登录账号</view>
        <input v-model="merchantForm.loginName" class="input" type="text" placeholder="请输入登录账号" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">登录密码</view>
        <input v-model="merchantForm.password" minlength="6" class="input" type="text" placeholder="请输入登录密码" />
      </view>
    </view>
    <view class="btn-primary marginLeft20" @click="documentInfo">保存下一步</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onBackPress } from '@dcloudio/uni-app';
import {
  getMemberInfoApi,
  idAuthSmsCodeApi,
  registerInfoApi,
} from '../../api/index'

onBackPress(() => {
  uni.navigateBack({
    delta: 1
  });
})

const merchantForm = ref({
  merchantNum: uni.getStorageSync('userInfo').merchantNum || '',
  lawPersonTelephone: uni.getStorageSync('userInfo').telephone || '',
  merchantName: uni.getStorageSync('userInfo').merchantName || '',
  memberType: "",
  contractEmail: "",
  loginName: "",
  password: "",
  smsCode: "",
})

const getMerchantDetails = async () => {
  const res = await getMemberInfoApi({});
  merchantForm.value = { ...merchantForm.value, ...res.data }
}
getMerchantDetails()

const documentInfo = () => {
  if (merchantForm.value.password.length < 6) {
    uni.showToast({
      title: '密码长度不能小于6位',
      icon: 'none'
    })
    return;
  }
  if (merchantForm.value.merchantNum &&
    merchantForm.value.contractEmail &&
    merchantForm.value.loginName &&
    merchantForm.value.password &&
    merchantForm.value.lawPersonTelephone &&
    merchantForm.value.smsCode) {
    registerInfoApi(merchantForm.value).then((res) => {
      if (res.code === 200) {
        if (merchantForm.value.memberType === "company") {
          uni.navigateTo({
            url: '/pages/subPack/companyBaseInfo'
          })
        } else {
          uni.navigateTo({
            url: '/pages/subPack/documentInfo?type=personal'
          })
        }

      }
    })
  } else {
    uni.showToast({
      title: '请填写必填项',
      icon: 'none'
    })
  }
}


const timer = ref(null)
const countdown = ref(60)
const isSending = ref(false)
const text = ref('验证码')
const getTelCode = () => {
  if (!merchantForm.value.lawPersonTelephone) return;
  if (isSending.value) return;
  uni.showLoading();
  idAuthSmsCodeApi({
    phone: merchantForm.value.lawPersonTelephone
  }).then((res) => {
    merchantForm.value.smsCode = res.data.telCode;
    uni.showToast({
      title: '验证码发送成功',
      icon: 'none'
    })
    uni.hideLoading();
  }).catch(() => {
    uni.hideLoading();
    uni.showToast({
      title: '验证码发送失败',
      icon: 'none'
    })
  });
  startCountdown()
}
const startCountdown = () => {
  isSending.value = true;
  timer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
      text.value = `${countdown.value}s`;
    } else {
      clearInterval(timer.value);
      isSending.value = false;
      countdown.value = 60;
      text.value = '重新发送';
    }
  }, 1000);
};

const validatePhone = (e) => {
  let value = e.detail.value;
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (value && !phoneRegex.test(value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    merchantForm.value.lawPersonTelephone = ''
  }
}
const validateEmail = (e) => {
  let value = e.detail.value;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (value && !emailRegex.test(value)) {
    uni.showToast({
      title: '请输入正确的邮箱',
      icon: 'none'
    })
    merchantForm.value.contractEmail = ''
  }
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;

  .btn_text {
    width: 100px;
    text-align: right;
    color: #007aff;
  }

  .input {
    width: 100%;
    text-align: right;
    background-color: #F7F7F7;
    padding: 5px;
    border-radius: 3px;
  }
}
</style>
