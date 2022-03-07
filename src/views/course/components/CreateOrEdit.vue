<template>
  <div class="create-or-edit">
    <el-card>
      <!-- 头部区域 -->
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            v-for="(item, i) in steps"
            :key="item.id"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep = i"
          ></el-step>
        </el-steps>
      </div>
      <!-- 步骤容器 -->
      <el-form label-width="80px">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              placeholder="概述1"
              v-model="course.previewFirstField"
              style="width: 49%;min-width: 300px;margin-right: 15px"
            >
              <template slot="append">{{ course.previewFirstField.length }}/20</template>
            </el-input>
            <el-input
              v-model="course.previewSecondField"
              placeholder="概述2"
              style="width: 49%;min-width: 300px;"
            >
              <template slot="append">{{ course.previewSecondField.length }}/20</template>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teachername"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <!-- 计数器组件 -->
            <el-input-number v-model="course.sortNum" label="描述文字"></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <course-image v-model="course.courseListImg" label="课程封面" :limit="3"></course-image>
          <course-image v-model="course.courseImgUrl" label="解锁封面" :limit="3"></course-image>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="售价">
            <el-input v-model="course.discounts" type="number" :min="0">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model="course.price" type="numebr" :min="0">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="course.sales" type="numebr" :min="0">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag"></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择开始时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择结束时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input v-model="course.activityCourseDTO.amount" type="numebr" :min="0">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存">
              <el-input v-model="course.activityCourseDTO.stock" type="numebr" :min="0">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="course.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item v-if="activeStep !== 0">
            <el-button @click="activeStep--">上一步</el-button>
          </el-form-item>
          <el-form-item v-if="activeStep !== steps.length - 1">
            <el-button @click="activeStep++">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CourseImage from './CourseImage'
import TextEditor from '@/components/TextEditor/index'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'

export default {
  name: 'CreareOrEdit',
  components: {
    CourseImage,
    TextEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      activeStep: 0,
      // 步骤信息
      steps: [
        {
          id: 1, title: '基本信息', icon: 'el-icon-edit'
        },
        {
          id: 2, title: '课程封面', icon: 'el-icon-picture'
        },
        {
          id: 3, title: '销售信息', icon: 'el-icon-goods'
        },
        {
          id: 4, title: '秒杀信息', icon: 'el-icon-s-help'
        },
        {
          id: 5, title: '课程详情', icon: 'el-icon-edit'
        }
      ],
      course: {
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        // 课程详情内容
        courseDescriptionMarkDown: '',
        // 商品原价
        price: 0,
        // 售卖价格
        discounts: 0,
        priceTag: '',
        // 活动标签
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面地址
        courseListImg: '',
        // 解锁封面地址
        courseImgUrl: '',
        // 课程排序
        sortNum: 0,
        // 概述1
        previewFirstField: '',
        // 概述2
        previewSecondField: '',
        // 上架状态， 0 表示不上架，1 表示上架
        status: 0,
        // 销量
        sales: 0,
        // 秒杀状态
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          // 秒杀开始时间
          beginTime: '',
          // 秒杀结束时间
          endTime: '',
          // 秒杀价
          amount: 0,
          // 库存
          stock: 0
        },
        autoOnlineTime: ''
      },
      imageUrl: ''
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
        this.course = data.data
      }
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑' : '添加'}课程成功`)
        this.$router.push({ name: 'course' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
.demo-form-inline {
  margin-left: 80px;
}
</style>
