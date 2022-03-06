<template>
  <div class="user-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="filterParams" ref="filter-form">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="filterParams.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="rangeDate">
            <el-date-picker
              type="daterange"
              v-model="filterParams.rangeDate"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" :disabled="isLoading">查询</el-button>
            <el-button @click="handleReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="users"
        style="width: 100%"
        v-loading="isLoading">
        <el-table-column
          prop="id"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="portrait"
          label="头像"
          width="180">
          <template slot-scope="scope">
            <img :src="scope.row.portrait || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" width="50">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.statue"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="ENABLE"
              inactive-value="DISABLE"
              @change="handleForbidUser(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleSelectRole(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配角色的下拉菜单 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogFormVisible"
      width="50%"
    >
      <el-select v-model="roleIdList" placeholder="请选择" multiple>
        <el-option
          v-for="item in roles"
          :key="item.value"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="filterParams.currentPage"
      :page-size="filterParams.pageSize"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :disabled="isLoading">
    </el-pagination>
  </div>
</template>

<script>
import { getUserPages, forbidUser, getAllRoles, getUserRoles, allocateUserRoles } from '@/services/role'

export default {
  name: 'UserList',
  data () {
    return {
      users: [],
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      isLoading: false,
      dialogFormVisible: false,
      // 下拉菜单数据
      roles: [],
      // 选中数据组成的列表
      roleIdList: [],
      // 数据总条数
      totalCount: 0,
      currentRoleId: null
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    async handleAllocate () {
      const { data } = await allocateUserRoles({
        userId: this.currentRoleId,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogFormVisible = false
      }
    },
    async handleSelectRole (userInfo) {
      this.currentRoleId = userInfo.id
      this.dialogFormVisible = true
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.roles = data.data
      }
      const { data: data2 } = await getUserRoles(userInfo.id)
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
      }
    },
    handleCurrentChange (val) {
      this.filterParams.currentPage = val
      this.loadUsers()
    },
    handleSizeChange (val) {
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    handleReset () {
      this.$refs['filter-form'].resetFields()
      this.loadUsers()
    },
    handleQuery () {
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    async loadUsers () {
      this.isLoading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreatTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      if (data.code === '000000') {
        this.users = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    }
  },
  filters: {
    dataFormat (date) {
      date = new Date()
      return `
        ${date.getFullYear()}-${date.getMonth() - 1}-${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss"></style>
