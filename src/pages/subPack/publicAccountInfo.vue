<template>
  <view class="enterpriseInfo">
    <view class="padding020">
      <view class="fontSize18 marginTop20 marginBottom20">上传开户许可证</view>
      <uni-file-picker v-model="merchantForm.openAccountLicenceUrl" limit="1" file-mediatype="image"
        @select="selectFile($event, 'openAccountLicenceUrl')" @delete="deleteFile($event, 'openAccountLicenceUrl')" />
    </view>
    <view class="list-item">
      <view class="flex spaceBetween borderBottom marginTop10">
        <view class="width70">单位名称</view>
        <view>{{ merchantForm.merchantName }}</view>
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">银行卡号</view>
        <input v-model="merchantForm.bankAccountNo" class="input" type="text" placeholder="请输入银行账号" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">银行名称</view>
        <input v-model="merchantForm.bankName" @click="bankNameSelect('bankName')" class="input arrow_bg" type="text"
          disabled placeholder="请选择" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">省市县</view>
        <uni-data-picker :localdata="areaList" v-model="areaCode" @change="onchangeAreaCode"
          :map="{ text: 'label', value: 'value' }" :border="false" :clear-icon="false" placeholder="请选择" class="f_1"
          popup-title="请选择" />
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">支行名称</view>
        <input v-model="merchantForm.bankOpenName" @click="bankNameSelect('subBankName')" class="input arrow_bg"
          type="text" disabled placeholder="请选择" />
      </view>
    </view>
    <view class="flex spaceBetween">
      <view class="btn-primary-left" @click="goBack">上一步</view>
      <view class="btn-primary-right" @click="authenticationInfo">下一步</view>
    </view>
  </view>

  <uni-popup ref="shareDialog" type="bottom" :safe-area="false" background-color="rgba(0,0,0,0)">
    <view class="shareDialog">
      <uni-search-bar v-model="searchValue" @confirm="search" @blur="search" @clear="clear" clearButton="auto"
        cancelButton="none" class="fixedSearch" placeholder="输入银行关键字" />
      <view v-if="isLoading">
        <view class="loading">
          <view class="loading-dot"></view>
          <view class="loading-dot"></view>
          <view class="loading-dot"></view>
        </view>
        <view class="text-align-center marginBottom40">加载中</view>
      </view>
      <view v-if="bankSelect === 'bankName'">
        <view class="list_500" v-if="bankList.length > 0">
          <view v-for="item in bankList" :key="item.bankNum" @click="bankNameClick(item)" class="list_10">
            {{ item.bankName }}</view>
        </view>
        <view v-if="bankList.length === 0" class="text-align-center">无数据</view>
      </view>
      <view v-if="bankSelect === 'subBankName'">
        <view class="list_500" v-if="bankSubList.length > 0">
          <view v-for="item in bankSubList" :key="item.subBankCode" @click="subBankNameClick(item)" class="list_10">
            {{ item.subBankName }}</view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { onBackPress } from '@dcloudio/uni-app';
import { uploadToOss } from '../../utils/upload'
import { convertArea } from '../../utils/index'
import { saveFileApi, delFileApi, getMemberInfoApi, getAreaCodeApi, getBankListApi, postAccountInfoApi, getBankSubListApi } from '../../api/index'

onBackPress(() => {
  uni.navigateBack({
    delta: 1
  });
})

const merchantForm = reactive({
  // [{name: '', extname: '', url: '', id:''}]
  legalLicenceFrontUrl: [],
  legalLicenceBackUrl: [],
  licenceUrl: [],
  openAccountLicenceUrl: [],
  bankCardFrontUrl: [],
  bankCardBackUrl: [],
  lawPersonName: '',
  bankCardNumber: '',
  bankAccountName: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  areaName: '',
  areaCode: '',
  bankCode: '',
  bankName: '',
  bankAccountNo: '',
  contractEmail: '',
  bankOpenName: '',
  bankSubCode: '',
  merchantName: "",
})

const getMerchantDetails = async () => {
  const res = await getMemberInfoApi({});
  if (res.data.merchantFiles?.length > 0) {
    res.data.merchantFiles.map(item => {
      merchantForm[item.fileType] = [{ url: item.filePath, id: item.id, name: item.fileType, extname: 'png' }]
    });
  }
  getBankSubList("")
  merchantForm.merchantName = res.data.merchantName
  merchantForm.bankCardNumber = res.data.bankCardNumber
  merchantForm.bankAccountNo = res.data.bankCardNumber
  merchantForm.bankCode = res.data.bankCode
  merchantForm.bankName = res.data.bankName
  merchantForm.provinceName = res.data.provinceName
  merchantForm.provinceCode = res.data.provinceCode
  merchantForm.cityName = res.data.cityName
  merchantForm.cityCode = res.data.cityCode
  merchantForm.areaName = res.data.areaName
  merchantForm.areaCode = res.data.areaCode
  merchantForm.bankOpenName = res.data.bankOpenName
  merchantForm.bankSubCode = res.data.bankSubCode
  areaCode.value = res.data.areaCode
}

getMerchantDetails()

const selectFile = (e, bizType) => {
  uploadToOss({
    file: e.tempFiles[0],
    bizType: bizType
  }).then(res => {
    saveFileApi({
      merchantNum: uni.getStorageSync('userInfo').merchantNum,
      fileType: bizType,
      filePath: res.url
    }).then(res => {
      merchantForm[bizType] = [{ id: res.data.fileId }]
      uni.showToast({
        title: res.msg,
        icon: 'none'
      })
    });
  });
}
const deleteFile = (e, bizType) => {
  const id = merchantForm[bizType][0]?.id;
  if (!id) return true;
  delFileApi({
    merchantNum: uni.getStorageSync('userInfo').merchantNum,
    fileId: id
  }).then(res => {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  })
  merchantForm[bizType] = []
}

const authenticationInfo = () => {
  postAccountInfoApi({
    "merchantNum": uni.getStorageSync('userInfo').merchantNum,
    "bankAccountName": merchantForm.bankAccountName,
    "bankAccountNo": merchantForm.bankAccountNo,
    "bankCode": merchantForm.bankCode,
    "bankName": merchantForm.bankName,
    "provinceCode": merchantForm.provinceCode,
    "provinceName": merchantForm.provinceName,
    "cityCode": merchantForm.cityCode,
    "cityName": merchantForm.cityName,
    "areaCode": merchantForm.areaCode,
    "areaName": merchantForm.areaName,
    "bankSubCode": merchantForm.bankSubCode,
    "bankOpenName": merchantForm.bankOpenName,
  }).then(res => {
    uni.redirectTo({
      url: '/pages/subPack/documentInfo?type=enterprise'
    })
  });
}

function goBack() {
  uni.navigateBack({ delta: 1 });
}

const searchValue1 = ref('')
const searchValue = ref()
const bankSelect = ref()
const bankList = ref([])
const bankAllList = ref([])
const shareDialog = ref()
const areaCode = ref('')
const areaList = ref([])
const bankSubListAll = ref([])
const bankSubList = ref([])
const isLoading = ref(false)

const search = (res) => {
  if (bankSelect.value === 'bankName') {
    bankList.value = []
    bankList.value = bankAllList.value.filter(bank => bank.bankName.includes(res.value))
  } else {
    getBankSubList(res.value)
  }
}

const clear = () => {
  if (bankSelect.value === 'bankName') {
    bankList.value = bankAllList.value
  } else {
    getBankSubList('')
  }
}

const bankNameClick = (item) => {
  merchantForm.bankName = item.bankName
  merchantForm.bankCode = item.bankNum
  shareDialog.value.close()
  merchantForm.bankOpenName = ''
  merchantForm.bankSubCode = ''
  if (merchantForm.bankCode && merchantForm.cityCode) {
    getBankSubList('')
  }
}

const subBankNameClick = (item) => {
  merchantForm.bankOpenName = item.subBankName
  merchantForm.bankSubCode = item.subBankCode
  shareDialog.value.close()
}

const bankNameSelect = (type) => {
  if (type === 'bankName') {
    bankList.value = bankAllList.value
  }
  if (type === 'subBankName' && !merchantForm.bankCode) {
    uni.showToast({
      title: '请选择银行名称',
      icon: 'none'
    })
    return
  }
  if (type === 'subBankName' && !merchantForm.cityCode) {
    uni.showToast({
      title: '请选择省市区',
      icon: 'none'
    })
    return
  }
  if (type === 'subBankName' && bankSubList.value.length === 0) {
    uni.showToast({
      title: '暂无数据',
      icon: 'none'
    })
    return
  }
  searchValue.value = ''
  searchValue1.value = ''
  bankSelect.value = type
  shareDialog.value.open()
}

const getBankSubList = (value) => {
  if (merchantForm.bankCode && merchantForm.cityCode) {
    isLoading.value = true
    bankSubList.value = []
    const provinceCodeArr = ['110000', '120000', '310000', '500000']
    getBankSubListApi({
      bankNum: merchantForm.bankCode,
      provinceCode: merchantForm.provinceCode,
      cityCode: provinceCodeArr.includes(merchantForm.provinceCode) ? merchantForm.provinceCode : merchantForm.cityCode,
      bankName: value
    }).then((res) => {
      if (res.code === 200 && res.data && res.data.length > 0) {
        bankSubListAll.value = res.data
        res.data.length > 100 ? bankSubList.value = res.data.slice(0, 100) : bankSubList.value = res.data
      } else {
        bankSubList.value = []
      }
    }).finally(() => {
      isLoading.value = false
    });
  }
}

const getInitData = () => {
  getAreaCodeApi({}).then((res) => {
    if (res.code === 200) {
      areaList.value = convertArea(res.data)
    }
  })
  getBankListApi({}).then((res) => {
    if (res.code === 200) {
      bankAllList.value = res.data
    }
  })
}
getInitData()

const onchangeAreaCode = (e) => {
  const value = e.detail.value
  merchantForm.provinceCode = value[0].value;
  merchantForm.provinceName = value[0].text;
  merchantForm.cityCode = value[1].value;
  merchantForm.cityName = value[1].text;
  merchantForm.areaCode = value[2].value;
  merchantForm.areaName = value[2].text;
  if (merchantForm.bankCode && merchantForm.cityCode) {
    getBankSubList('')
  }
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;

  .input {
    width: 100%;
    text-align: right;
    background-color: #F7F7F7;
    padding: 5px;
    border-radius: 3px;
  }

  .arrow_bg {
    padding: 5px 20px 5px 5px;
    background-position: 98% 50%;
  }

  .uni-data-tree {
    background: #F7F7F7;
    border-radius: 3px;
  }

  .selected-area,
  .selected-list {
    justify-content: flex-end;
  }

  .list_500 {
    height: 500px;
    overflow-y: scroll;
    margin-top: 50px;

    .list_10 {
      padding: 10px 0;
    }
  }

  .shareDialog {
    color: #4E5969;
    text-align: center;
    padding: 20px 0 35px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: #ffffff;

    .loading {
      margin: 100px 0 20px;

      .loading-dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #888;
        opacity: 0;
        animation: blink 1.4s infinite both;
      }

      .loading-dot+.loading-dot {
        margin-left: 12px;
      }

      .loading-dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .loading-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
    }

    @keyframes blink {
      0% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }
  }
}
</style>
