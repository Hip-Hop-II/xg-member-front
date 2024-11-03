<template>
  <view class="enterpriseInfo">
    <view class="padding020">
      <view class="fontSize18 marginTop20 marginBottom20">上传营业执照</view>
      <uni-file-picker v-model="merchantForm.licenceUrl" limit="1" file-mediatype="image"
        :sizeType="['original', 'compressed']" @select="selectFile($event, 'licenceUrl')"
        @delete="deleteFile($event, 'licenceUrl')" />
    </view>
    <view class="list-item">
      <view class="flex spaceBetween borderBottom">
        <view class="width70">单位名称</view>
        <view>
          {{ merchantForm.merchantName }}
          <text class="colorFF3333" @click="OCRChange('营业执照')">修改</text>
        </view>
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">单位简称</view>
        <input v-model="merchantForm.merchantShortName" class="input" type="text" placeholder="请输入单位简称" />
      </view>
      <view class="flex spaceBetween borderBottom">
        <view class="width70">营业执照号码</view>
        <view>
          {{ merchantForm.socialCreditCode }}
          <text class="colorFF3333" @click="OCRChange('营业执照')">修改</text>
        </view>
      </view>
      <view class="flex spaceBetween borderBottom">
        <view class="width70">营业执照有效期</view>
        <view>
          {{ merchantForm.socialCreditCodeStart }}
          {{ merchantForm.socialCreditCodeStart && merchantForm.socialCreditCodeEnd ? '-' : '' }}
          {{ merchantForm.socialCreditCodeEnd === 29991231 ? "长期" : merchantForm.socialCreditCodeEnd }}
          <text class="colorFF3333" @click="OCRChange('营业执照')">修改</text>
        </view>
      </view>
      <view class="flex spaceBetween borderBottom">
        <view class="width70">法人名称</view>
        <view>
          {{ merchantForm.lawPersonName }}
          <text class="colorFF3333" @click="OCRChange('营业执照')">修改</text>
        </view>
      </view>
      <view class="flex spaceBetween borderBottom">
        <view class="width70">执照地址</view>
        <view>
          {{ merchantForm.socialCreditAddress }}
          <text class="colorFF3333" @click="OCRChange('营业执照')">修改</text>
        </view>
      </view>
      <view class="flex borderBottom">
        <view class="width70 required">办公地址</view>
        <textarea v-model="merchantForm.merchantAddress" class="input" type="text" placeholder="请输入办公地址" auto-height />
      </view>
    </view>
    <view class="flex spaceBetween">
      <view class="btn-primary-left" @click="goBack">上一步</view>
      <view class="btn-primary-right" @click="otherInfo">下一步</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { onBackPress } from '@dcloudio/uni-app';
import { uploadToOss } from '../../utils/upload'
import { saveFileApi, delFileApi, getMemberInfoApi, companyBaseInfoApi } from '../../api/index'

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
  businessScope: "",
  fileId: "",
  lawPersonName: "",
  merchantName: "",
  merchantNum: "",
  socialCreditAddress: "",
  socialCreditCode: "",
  socialCreditCodeEnd: "",
  socialCreditCodeStart: "",
  merchantShortName: "",
  merchantAddress: "",
})

const getMerchantDetails = async () => {
  const res = await getMemberInfoApi({});
  if (res.data.merchantFiles?.length > 0) {
    res.data.merchantFiles.map(item => {
      merchantForm[item.fileType] = [{ url: item.filePath, id: item.id, name: item.fileType, extname: 'png' }]
    });
  }
  merchantForm.lawPersonName = res.data.lawPersonName
  merchantForm.merchantName = res.data.merchantName
  merchantForm.merchantNum = res.data.merchantNum
  merchantForm.socialCreditAddress = res.data.socialCreditAddress
  merchantForm.socialCreditCode = res.data.socialCreditCode
  merchantForm.socialCreditCodeEnd = res.data.socialCreditCodeEnd
  merchantForm.socialCreditCodeStart = res.data.socialCreditCodeStart
  merchantForm.merchantShortName = res.data.merchantShortName
  merchantForm.merchantAddress = res.data.merchantAddress
}
getMerchantDetails()

const selectFile = (e, bizType) => {
  uploadToOss({
    file: e.tempFiles[0],
    bizType: bizType
  }).then(img => {
    saveFileApi({
      merchantNum: uni.getStorageSync('userInfo').merchantNum,
      fileType: bizType,
      filePath: img.url
    }).then(res => {
      getMerchantDetails()
      // for (let key in res.data || {}) {
      //   if (merchantForm[key]) {
      //     merchantForm[key] = res.data[key]
      //   }
      // }
      // merchantForm[bizType] = [{ id: res.data.fileId, url: img.url }]
      // merchantForm.lawPersonName = res.data.lawPersonName
      // merchantForm.merchantName = res.data.merchantName
      // merchantForm.merchantNum = res.data.merchantNum
      // merchantForm.socialCreditAddress = res.data.socialCreditAddress
      // merchantForm.socialCreditCode = res.data.socialCreditCode
      // merchantForm.socialCreditCodeEnd = res.data.socialCreditCodeEnd
      // merchantForm.socialCreditCodeStart = res.data.socialCreditCodeStart
      // uni.showToast({
      //   title: res.msg,
      //   icon: 'none'
      // })
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
const otherInfo = () => {
  if (!merchantForm.merchantShortName || !merchantForm.merchantAddress || !merchantForm.merchantName) {
    uni.showToast({
      title: '请填写必填项',
      icon: 'none'
    })
    return
  }
  companyBaseInfoApi({
    "merchantNum": uni.getStorageSync('userInfo').merchantNum,
    "merchantShortName": merchantForm.merchantShortName,
    "merchantAddress": merchantForm.merchantAddress,
  }).then(res => {
    uni.redirectTo({
      url: `/pages/subPack/publicAccountInfo?name=${merchantForm.merchantName}`
    })
  });
}

function goBack() {
  uni.navigateBack({ delta: 1 });
}

const OCRChange = (text) => {
  uni.showToast({
    title: `请重新上传【${text}】照片`,
    icon: 'none'
  })
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
