<template>
  <div class="login">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isLoginLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/services/user'

export default {
  name: 'login',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码为 6 - 18 个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 表单验证
        await this.$refs.form.validate()
        // 请求
        this.isLoginLoading = true
        const { data } = await login(this.form)
        this.isLoginLoading = false
        // 响应数据处理
        if (data.state === 1) {
          this.$message.success('登录成功')
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error('登录失败')
        }
      } catch (err) {
        console.log('验证失败', err)
      }
    }
  }
}
</script>

<style lang="scss">
  .login {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(84, 92, 100);
    .el-form {
      background-color: #fff;
      width: 300px;
      padding: 20px;
      border-radius: 10px;
      .el-button {
        width: 100%;
      }
    }
  }
</style>
