<template>
  <el-container>
    <el-dialog title="新建项目" :visible.sync="openPop" width="500px" :close="closepop">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small">
        <el-form-item label="项目名称" prop="proName">
          <el-input v-model.trim="ruleForm.proName"></el-input>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-col :span="24">
            <el-form-item>
              <el-date-picker v-model="ruleForm.uptime" type="date" readonly></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="提交人" prop="submitter">
          <el-input v-model.trim="ruleForm.submitter"></el-input>
        </el-form-item>
        <el-form-item label="上线时间">
          <el-col :span="24">
            <el-form-item prop="plantime">
              <el-date-picker v-model="ruleForm.plantime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="文件备注" prop="remark">
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            placeholder="请限制在30字以内"
            max="30"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传文件" prop="fileList" ref="upload">
          <el-upload
            class="formUpload"
            action="http://192.168.2.36:3030/up"
            :on-remove="uploadFileRemove"
            :on-exceed="uploadFileExceed"
            :on-change="uploadFileChange"
            :file-list="ruleForm.fileList"
            :http-request="submitUpload"
            :auto-upload="false"
            accept=".zip, .rar"
            :limit="fileLimit"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <p>将文件拖到此处，或
                <em>点击上传</em>
              </p>
              <p>只能上传zip/rar文件,且文件名除后缀外不能有点‘.’</p>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCancle">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="uploading">立即上传</el-button>
      </div>
    </el-dialog>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="20" :offset="2">
          <h1 class="title">{{ header }}</h1>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="openUpload">上传项目<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span='24' v-for="(v,index) in items" :key="index">
          <div class="table_title">{{ v.title }}</div>
          <div class="table_content">
            <el-table
              :data="v.tabledata.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))"
              style="width:100%"
              v-loading='loading'>
              <TableColumn label="名称" prop="name" align="center"></TableColumn>
              <TableColumn label="上传时间" prop="updateTime" align="center"></TableColumn>
              <TableColumn label="提交人" prop="submitter" align="center"></TableColumn>
              <TableColumn label="计划上线时间" prop="planTime" align="center"></TableColumn>
              <TableColumn label="线上地址" align="center">
                <template slot-scope="scope">
                  <el-tag type="primary" class="table_itemurl" disable-transitions>
                    <a :href="scope.row.url" target="_blank">点击查看</a>
                  </el-tag>
                </template>
              </TableColumn>
              <TableColumn label="备注" prop="remark" align="left"></TableColumn>
              <TableColumn align="center">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="search" size="mini" placeholder="搜索项目名称"></el-input>
                </template>
                <template slot-scope="scope">
                  <el-button class="el-icon-delete" size="mini" type="danger" @click="tableDelConfirm(scope.$index, scope.row)">删除</el-button>
                </template>
              </TableColumn>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
// @ is an alias to /src
import { TableColumn } from 'element-ui'
import API from '@/api.js'

export default {
  name: 'home',
  components: {
    TableColumn
  },
  data () {
    const proNameReg = (rule, value, cb) => {
      if (value) {
        this.items[0].tabledata.forEach((v) => {
          if (v.name === value) {
            return cb(new Error('项目名重复'))
          }
        })
        cb()
      } else {
        cb(new Error('请输入项目名称'))
      }
    }
    return {
      header: 'UED项目引导页面',
      items: [
        {
          title: '设计原型图&文档',
          tabledata: []
        }
      ],
      ruleForm: {
        proName: '',
        uptime: '',
        submitter: '',
        plantime: '',
        remark: '',
        fileList: []
      },
      rules: {
        proName: [
          { validator: proNameReg, trigger: 'blur' }
        ],
        submitter: [
          { required: true, message: '请输入提交人名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        plantime: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请描述信息', trigger: 'blur' },
          { max: 30, message: '请限制在 30 字以内', trigger: 'blur' }
        ],
        fileList: [
          { required: true, message: '文件不能为空', trigger: 'change' }
        ]
      },
      fileLimit: 1,
      param: '',
      search: '',
      loading: false,
      uploading: false,
      openPop: false
    }
  },
  mounted () {
    this.ruleForm.uptime = this.todayDate()
    this.initList()
  },
  methods: {
    // 文件删除对话框
    tableDelConfirm (index, row) {
      this.$confirm('此操作将永久删除该文件，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.items[0].tabledata.splice(index, 1)
        this.deleteFile(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 文件删除
    deleteFile (row) {
      this.$http.delete(API.delete, {
        params: row
      })
        .then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
        .catch((err) => {
          console.log(err)
          console.log(row)
        })
    },
    // 打开上传项目dialog
    openUpload () {
      this.openPop = true
    },
    // 关闭上传项目dialog
    closepop () {
      this.openPop = false
      this.onCancle()
    },
    // 取消上传事件
    onCancle () {
      this.$refs.ruleForm.resetFields()
    },
    // 预备上传文件删除
    uploadFileRemove (file, fileList) {
      this.ruleForm.fileList = []
    },
    // 上传文件限制
    uploadFileExceed (file, fileList) {
      this.$message({
        message: '一个项目只能上传一个压缩包',
        type: 'warning'
      })
    },
    // 上传文件更改
    uploadFileChange (file, fileList) {
      this.ruleForm.fileList.push(file)
    },
    // 提交上传
    submitUpload () {
      // new FormData()
      this.param = new FormData()
      if (this.ruleForm.fileList) {
        this.$refs.upload.clearValidate()
      }
      this.$refs.ruleForm.validate((valid) => {
        // 通过校验 并 将数值加入new FormData #文件字段单独加入
        this.uploading = true
        if (valid) {
          for (const key in this.ruleForm) {
            if (this.ruleForm.hasOwnProperty(key)) {
              const el = this.ruleForm[key]
              if (key === 'fileList') {
                this.param.append(key, el[0].raw)
              } else {
                this.param.append(key, el)
              }
            }
          }
          this.submitAxios()
        } else {
          this.uploading = false
          return false
        }
      })
    },
    submitAxios () {
      this.$http.post(API.post, this.param)
        .then((res) => {
          this.uploading = false
          this.initList()
          this.closepop()
          this.$message({
            message: '文件上传成功！',
            type: 'success'
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 初始化数据
    initList () {
      this.$http.get(API.get)
        .then((res) => {
          this.items[0].tabledata = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    checkFileName () {
      let name = this.fileList[0].name
      let count = 0
      name.split('').forEach(v => {
        if (v === '.') {
          count++
        }
      })
      if (count > 1) {
        this.$message({
          type: 'warning',
          message: '文件名内不能包含点'
        })
      }
    },
    // 获取当天日期
    todayDate () {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      if (m < 10) m = `0${m}`
      if (d < 10) d = `0${d}`
      return `${y}-${m}-${d}`
    }
  }
}
</script>

<style lang="scss" scoped>
$btn_color: #409eff;
.el-form {
  width: 400px;
  .el-col-24 {
    height: 32px;
    .el-date-editor{
      width: 100%;
    }
  }
  .uploadItem {
    height: 180px;
    position: relative;
    label {
      position: absolute;
      top: 0;
      left: 0;
      width: 88px;
      height: 32px;
      padding: 0 12px 0 0;
      line-height: 32px;
      font-size: 14px;
      color: #606266;
      text-align: right;
    }
    .formUpload {
      position: absolute;
      left: 100px;
      .el-upload__text {
        p {
          margin: 5px 0;
          &:last-child {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}
.el-header{
  background: #006bd6;
  .title{
    color: white;
    margin: 0;
    line-height: 60px;
  }
  .el-button{
    border: none;
    margin-top: 10px;
  }
}
.el-main{
  background: #eee;
  overflow: hidden;
  .el-row{
    width: 1300px;
    margin-left: 50% !important;
    margin-right: 0 !important;
    transform: translateX(-50%);
    .el-col{
      margin-bottom: 30px;
      .table_title{
        border-radius: 3px 3px 0 0;
        background: white;
        position: relative;
        font-size: 18px;
        line-height: 40px;
        font-weight: bold;
        text-align: left;
        text-indent: 1em;
        &::before{
          position: absolute;
          content: "";
          width: 3px;
          height: 18px;
          background: #057ef8;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .table_content{
        border-radius: 0 0 3px 3px;
        padding: 0 5px;
        background: white;
        .el-table{
          thead{
            background: #eee;
            color: #ccc;
          }
          .table_itemurl{
            background: rgba($btn_color, .1);
            border-color: rgba($btn_color, .2);
            a{
              color: $btn_color;
              text-decoration: none;
            }
          }
        }
      }
    }
  }
}
</style>
