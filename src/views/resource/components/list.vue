<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
              <el-option
                v-for="item in resourceCategories"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="add">
        <el-button size="mini" @click="handleAdd">添加</el-button>
      </div>
      <!-- Table组件 -->
      <el-table
        :data="resources"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading">
        <el-table-column
          type="index"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.row)"
              type="danger"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑或添加操作 -->
      <el-dialog
        :title="isEdit ? '编辑资源' : '添加资源'"
        :visible.sync="dialogFormVisible"
        v-if="dialogFormVisible"
        width="50%">
        <create-or-edit
          :isEdit="isEdit"
          :resourceId="resourceId"
          :resourceCategories="resourceCategories"
          @cancel="dialogFormVisible = false"
          @success="handleSuccess"
        ></create-or-edit>
      </el-dialog>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-size="form.size"
        layout="total, prev, pager, next"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategory, deleteResource } from '@/services/resource'
import CreateOrEdit from './CreateOrEdit.vue'

export default {
  name: 'ResourceList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      resources: [{}],
      form: {
        current: 1,
        size: 10,
        // 资源名称
        name: '',
        // 资源路径
        url: '',
        // 资源分类 ID
        categoryId: ''
      },
      totalCount: 0,
      // 资源分类列表
      resourceCategories: [],
      isLoading: false,
      // 对话框显示状态
      dialogFormVisible: false,
      // 编辑状态
      isEdit: false,
      // 资源Id
      resourceId: ''
    }
  },
  created () {
    // 加载资源数据
    this.loadResources()
    // 加载资源列表
    this.loadResourceCategory()
  },
  methods: {
    handleSuccess () {
      this.dialogFormVisible = false
      this.loadResources()
      this.loadResourceCategory()
    },
    handleEdit (rowData) {
      this.dialogFormVisible = true
      this.isEdit = true
      this.resourceId = rowData.id
    },
    handleDelete (rowData) {
      this.$confirm('确认删除吗', '删除提示')
        .then(async () => {
          // 删除操作
          const { data } = await deleteResource(rowData.id)
          if (data.code === '000000') {
            // 更新资源列表
            this.loadResources()
            this.$message.success('删除成功')
          } else {
            this.$message.info(data.mesg)
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleAdd () {
      this.dialogFormVisible = true
      this.isEdit = false
    },
    async loadResourceCategory () {
      const { data } = await getResourceCategory()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    handleSizeChange (val) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    },
    async loadResources () {
      // 开始加载数据
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
      }
      // 数据加载完毕
      this.isLoading = false
    },
    onReset () {
      this.$refs.form.resetFields()
      this.loadResources()
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
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
</style>
