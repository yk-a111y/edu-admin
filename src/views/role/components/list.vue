<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>
      <el-table :data="roles" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配菜单</el-button>
              <el-button type="text">分配资源</el-button>
            </div>
            <div>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
    :title="isEdit ? '编辑角色' : '添加角色'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible">
      <create-or-edit
        :isEdit="isEdit"
        :roleId="roleId"
        @success="handleSuccess"
        @cancel="dialogVisible=false"
      ></create-or-edit>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, deleteRoles } from '@/services/role'
import CreateOrEdit from './CreateOrEdit.vue'

export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: ''
      },
      roles: [],
      isLoading: false,
      // dialog组件是否显示
      dialogVisible: false,
      // 添加或编辑状态的判断
      isEdit: false,
      roleId: ''
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    handleSuccess () {
      this.dialogVisible = false
      this.loadRoles()
    },
    handleAdd () {
      this.dialogVisible = true
    },
    onReset () {
      this.$refs.form.resetFields()
      this.loadRoles()
    },
    onSubmit () {
      this.loadRoles()
    },
    handleEdit (role) {
      this.isEdit = true
      this.dialogVisible = true
      this.roleId = role.id
    },
    handleDelete (role) {
      this.$confirm(`确认删除角色${role.name}?`, '删除提示')
        .then(async () => {
          await deleteRoles(role.id)
          this.$message.success('删除成功')
          this.loadRoles()
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('取消删除')
          }
        })
    },
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      if (data.code === '000000') {
        this.roles = data.data.records
      }
      this.isLoading = false
    }
  },
  filters: {
    dataFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() - 1}-${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  .el-form-item {
    width: 300px;
  }
}
</style>
