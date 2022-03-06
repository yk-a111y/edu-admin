<template>
  <div class="course-list">
    <!-- 查询表单 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span>课程筛选</span>
      </div>
      <!-- 表单 -->
      <el-form
        :inline="true"
        ref="form"
        label-position="left"
        :model="filterParams"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="isLoading"
            @click="handleReset"
          >重置</el-button>
          <el-button
            type="primary"
            :disabled="isLoading"
            @click="handleFilter"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>筛选结果</span>
        <el-button
          type="primary"
          style="float: right; margin-top: -10px"
          @click="$router.push({ name: 'course-create' })"
        >+ 添加课程</el-button>
      </div>
      <el-table
        :data="courses"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px">
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="230">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="200"
          align="center"
        >
          <template>
            <el-button>编辑</el-button>
            <el-button>内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :disabled="isLoading"
      :currentPage="filterParams.currentPage"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      isLoading: false,
      courses: [],
      totalCount: 0
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    handleCurrentChange (page) {
      this.filterParams.currentPage = page
      this.loadCourses()
    },
    async onStateChange (course) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
      }
      course.isStatusLoading = false
    },
    handleReset () {
      this.$refs.form.resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    handleFilter () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      // console.log(data)
      if (data.code === '000000') {
        // 给请求到的数据添加isStatusLoading的属性
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        this.courses = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form {
    margin-top: 10px;
  }
</style>
