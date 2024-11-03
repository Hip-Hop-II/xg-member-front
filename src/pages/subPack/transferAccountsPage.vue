<template>
  <view class="withdrawPage">
    <view class="padding20 borderBottom20">
      <view>转账金额</view>
      <view class="flex borderBottom paddingBottom20 marginTop20">
        <view class="fontSize14 marginRight20">¥</view>
        <input v-model="value" class="input marginLeft10" type="number" placeholder="请输入金额"/>
      </view>
      <view class="fontSize14 colorFF3333 marginTop10">可提现金额{{convertFenToYuan(availableBalance)}}</view>
    </view>
    <view class="padding20 fontSize16">
      <uni-segmented-control :current="current" :values="items" styleType="text"
                             activeColor="#FF3344" inActiveColor="transparent" @clickItem="onClickItem" />
      <view class="content marginTop20">
        <view v-if="current === 0" class="marginTop20">
          <view>请选择转账公司</view>
          <view class="gray marginTop10 borderRadius backColorF7F7F7">
            <uni-data-select v-model="value" :localdata="list"
                             placeholder="请选择转账公司" class="uni_select"/>
          </view>
          <view class="fixedBottom widthCount">
            <view class="fontSize12 text-align-center marginBottom10">转账至平台账户为实时到账，且无法追回，请确认！</view>
            <view class="btn-primary">提交</view>
          </view>
        </view>
        <view v-if="current === 1">
          <view class="gray marginTop10 borderRadius backColorF7F7F7">
            <input v-model="value" type="text" class="input marginRight20" placeholder="请输入他人账户名称"/>
          </view>
          <view class="gray marginTop10 borderRadius backColorF7F7F7">
            <input v-model="value" type="text" class="input marginRight20" placeholder="请输入他人银行账号"/>
          </view>
          <view class="gray marginTop10 borderRadius backColorF7F7F7">
            <uni-data-select v-model="value" :localdata="list"
                             placeholder="请选择银行" class="uni_select"/>
          </view>
          <view class="gray marginTop10 marginBottom40 borderRadius backColorF7F7F7">
            <input v-model="value" type="text" class="input marginRight20" placeholder="请输入银行开户行"/>
          </view>
          <view class="fontSize12 text-align-center">转账至他人银行卡无法追回和撤销，请确认！</view>
          <view class="btn-primary marginTop10">提交</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {accountInfoApi} from '../../api/index'
import {convertFenToYuan} from '../../utils/index'

const value = ref()
const current = ref(0)
const items = ref(['转账至平台账户', '转账至他人银行卡'])
const userInfo = ref({})
const list = ref([])
const onClickItem = (e) => {
  if (current.value !== e.currentIndex) {
    current.value = e.currentIndex;
  }
}
const availableBalance = ref()
const getAccountInfo = async () => {
  const res = await accountInfoApi({});
  if(res.data){
    availableBalance.value = res.data.availableBalance
  }else {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  }
}
getAccountInfo()

</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>