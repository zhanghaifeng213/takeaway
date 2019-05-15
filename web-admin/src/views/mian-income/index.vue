<template>
  <div class="mian-income">
    <!-- <h5>头像上传</h5> -->
    <!-- <el-upload class="avatar-uploader"
               :action="actionUrl"
               :headers="headers"
               :show-file-list="false"
               :on-success="handleAvatarSuccess"
               :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl"
           :src="imageUrl"
           class="avatar">
      <i v-else
         class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>-->
    <el-form :model="info" :inline="true" class="demo-form-inline">
      <el-form-item
        label="店铺名称"
        :rules="[
      { required: true, message: '请输入店铺名称', trigger: 'blur' }
    ]"
      >
        <el-input v-model="info.name" placeholder="添加类别"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveName">保存</el-button>
      </el-form-item>
    </el-form>
    <el-form :model="info" :inline="true" class="demo-form-inline">
      <el-form-item
        label="公告信息"
        :rules="[
      { required: true, message: '请输入公告信息', trigger: 'blur' }
    ]"
      >
        <el-input v-model="info.announcement" type="textarea" :rows="2" placeholder="公告"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveAnnouncement">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { imgUrlFormat } from "@/libs/tool";
import { getInfo, updateInfo } from "@/fetch/info";
export default {
  name: "mian-income",
  data() {
    const token = sessionStorage.getItem("token");
    return {
      info: {},
      imageUrl: "",
      actionUrl:
        (process.env.NODE_ENV !== "production"
          ? "/proxyApi"
          : process.env.API_ROOT) + "/info/upload",
      headers: {
        Authorization: "Bearer " + token
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      getInfo().then(res => {
        if (res.data.code == 1) {
          this.info = res.data.data;
          this.imageUrl = imgUrlFormat(res.data.data.avatar);
        }
      });
    },
    saveName() {
      let data = {
        name: this.info.name,
        id: this.info._id
      };
      updateInfo(data).then(res => {
        if (res.data.code == 1) {
          this.$message({
            type: "success",
            message: res.data.data
          });
        } else {
          this.$message({
            type: "error",
            message: "保存失败"
          });
        }
      });
    },
    saveAnnouncement() {
      let data = {
        announcement: this.info.announcement,
        id: this.info._id
      };
      updateInfo(data).then(res => {
        if (res.data.code == 1) {
          this.$message({
            type: "success",
            message: res.data.data
          });
        } else {
          this.$message({
            type: "error",
            message: "保存失败"
          });
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.data.code == 1) {
        this.$message({
          type: "success",
          message: res.data.data
        });
      } else {
        this.$message({
          type: "error",
          message: "保存失败"
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="less">
.mian-income {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-form {
    .el-form-item {
      .el-input,
      .el-textarea {
        width: 300px;
      }
    }
  }
}
</style>
