<template>
  <div class="create-or-edit">
    <el-form>
      <el-form-item label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="role.description" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { getRoleById, saveOrUpdate } from '@/services/role'

export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    onCancel () {
      // 设置取消状态，让父组件处理
      this.$emit('cancel')
      this.role = {}
    },
    async onSubmit () {
      const { data } = await saveOrUpdate(this.role)
      if (data.code === '000000') {
        this.$emit('success')
        this.$message.success('操作成功')
        this.role = {}
      }
    },
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
