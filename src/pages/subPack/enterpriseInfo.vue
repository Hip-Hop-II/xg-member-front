<template>
  <view class="enterpriseInfo">
    <view class="padding20 fontSize16 borderBottom20">
      <view class="flex spaceBetween">
        <view>关联方编号</view>
        <view>{{ merchantForm.merchantNum }}</view>
      </view>
      <view class="flex spaceBetween marginTop10">
        <view>关联方名称</view>
        <view>{{ merchantForm.merchantName }}</view>
      </view>
    </view>
    <view class="list-item">
      <view class="flex borderBottom">
        <view class="width70 required">关联方简称</view>
        <input v-model="merchantForm.merchantShortName" class="input" type="text" placeholder="请输入简称" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">法人姓名</view>
        <input v-model="merchantForm.lawPersonName" class="input" type="text" placeholder="请输入法人姓名" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">法人电话</view>
        <input v-model="merchantForm.lawPersonTelephone" @blur="validatePhone($event)"
          model:value="{{merchantForm.lawPersonTelephone}}" maxlength="11" class="input" type="text"
          placeholder="请输入法人电话" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">联系邮箱</view>
        <input v-model="merchantForm.contractEmail" class="input" type="text" placeholder="请输入联系邮箱" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">实际经营地址</view>
        <input v-model="merchantForm.merchantAddress" class="input" type="text" placeholder="请输入地址" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">行业分类</view>
        <uni-data-picker :localdata="CommonMcc" v-model="merchantForm.mccCode"
          :map="{ text: 'label', value: 'value' }" :border="false" placeholder="请选择" class="f_1" popup-title="请选择" />
      </view>
    </view>
    <view class="btn-primary marginLeft20 marginRight20" @click="bankInfo">下一步</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { companyInfoFirstApi, getMemberInfoApi, getIndustryTypeApi, getCommonMccApi } from '../../api/index'
import { convertIndustry } from "../../utils/index"

const industryType = ref([])
const merchantForm = ref({
  merchantNum: uni.getStorageSync('userInfo').merchantNum || '',
  merchantName: uni.getStorageSync('userInfo').memberName || '',
  lawPersonTelephone: uni.getStorageSync('userInfo').telephone || '',
  merchantShortName: '',
  lawPersonName: '',
  merchantAddress: '',
  mccCode: '',
  contractEmail: ''
})
const getMerchantDetails = async () => {
  const res = await getMemberInfoApi({});
  merchantForm.value = res.data
  merchantForm.value.merchantName = res.data.bankAccountName
}

const CommonMcc = ref([])
const getCommonMcc = async () => {
  const res = await getCommonMccApi({});
  CommonMcc.value = convertIndustry(res.data)
}
getCommonMcc()

getMerchantDetails()
const validatePhone = (e) => {
  let value = e.detail.value;
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (value && !phoneRegex.test(value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
  }
}

const bankInfo = () => {
  if (merchantForm.value.nextStep?.url) {
    wx.navigateTo({
      url: "/pagesFace/pages/webview/webview?url=" + encodeURIComponent(merchantForm.value.nextStep?.url),
    });
  } else if (merchantForm.value.merchantShortName &&
    merchantForm.value.lawPersonName &&
    merchantForm.value.lawPersonTelephone &&
    merchantForm.value.mccCode &&
    merchantForm.value.contractEmail) {
    companyInfoFirstApi(merchantForm.value).then((res: any[]) => {
      if (res.code === 200) {
        uni.navigateTo({
          url: `/pages/subPack/bankInfo`
        })
      }
    })
  } else {
    uni.showToast({
      title: '请填写必填项',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>
