<template>
  <view class="withdrawPage">
    <view class="padding20 backColorFFFFFF">
      <view>提现金额</view>
      <view class="flex borderBottom paddingBottom20 marginTop20">
        <view class="fontSize14 marginRight20">¥</view>
        <input v-model="money" class="input marginLeft10" type="number" placeholder="请输入金额" />
      </view>
      <view class="fontSize14 colorFF3333 marginTop10">可提现金额{{ convertFenToYuan(availableBalance) }}</view>
    </view>
    <view class="flex spaceBetween marginTop20 padding20 backColorFFFFFF fontSize14">
      <view>提现至</view>
      <view class="arrow_bg paddingRight20 fontSize12">建设银行</view>
    </view>
    <view @click="shareDialog.open()" class="btn-primary fixedBottom widthCount marginLeft20 marginRight20">提现</view>
    <uni-popup ref="shareDialog" type="bottom" :safe-area="false" mask-background-color="rgba(0,0,0,0.8)">
      <view class="shareDialog padding20">
        <view class="flex spaceBetween colorFFFFFF">
          <view>验证码接收手机</view>
          <view>{{ phone }}</view>
        </view>
        <view class="flex spaceBetween backColorFFFFFF borderRadius marginTop10 padding20">
          <input v-model="code" maxlength="6" type="text" placeholder="请输入验证码" />
          <text class="btn_text" @click="sendCode">{{ text }}</text>
        </view>
        <view class="backColorFFFFFF borderRadius marginTop10 padding20 marginBottom40">
          <textarea v-model="remark" placeholder="请输入说明" />
        </view>
        <view class="btn-primary marginTop10 marginBottom20" @click="fundWithdrawClick">确定</view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { accountInfoApi, loginInfoApi, fundWithdrawSmsCodeApi, fundWithdrawAddApi, fundWithdrawbankListApi } from '../../api/index'
import { convertFenToYuan } from '../../utils/index'

const availableBalance = ref()
const phone = ref()
const getAccountInfo = async () => {
  const res = await accountInfoApi({});
  if (res.data) {
    availableBalance.value = res.data.availableBalance
  } else {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  }
  loginInfoApi({}).then(res => {
    if (res.data) {
      phone.value = res.data.otherInfo.phone
    }
  })
  fundWithdrawbankListApi({}).then(res => {
    if (res.data) {

    }
  })
}
getAccountInfo()

const money = ref()
const shareDialog = ref()

const code = ref()
const remark = ref()
const text = ref('发送')
const isSending = ref(false)
const countdown = ref(60)
const timer = ref(null)
const sendCode = () => {
  if (isSending.value) return;
  fundWithdrawSmsCodeApi({ id: 'withdraw' }).then(res => {
    if (res.data) {
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
const fundWithdrawClick = () => {
  if (money.value && remark.value) {
    uni.showToast({
      title: '请输入金额或者提现说明',
      icon: 'none'
    })
    return
  }
  fundWithdrawAddApi({
    accountId: '',
    money: money.value,
    remark: remark.value,
    bankCardId: ''
  }).then(res => {
    if (res.data) {
      shareDialog.value.close()
    }
  })
}
</script>
