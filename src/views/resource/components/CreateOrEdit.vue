<template>
  <div class="create-or-edit">
    <el-form>
      <el-form-item label="资源名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="资源路径">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="资源分类">
        <el-select v-model="form.category" placeholder="请选择类别">
          <el-option
            v-for="item in resourceCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { getResourceById, saveOrUpdate } from '@/services/resource'

export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: [Number, String]
    },
    resourceCategories: {
      default: []
    }
  },
  created () {
    if (this.isEdit) {
      this.loadResourceInfo()
    }
  },
  data () {
    return {
      form: {
        name: '',
        url: '',
        description: '',
        categoryId: ''
      }
    }
  },
  methods: {
    async onSubmit () {
      const { data } = await saveOrUpdate(this.form)
      if (data.code === '000000') {
        this.$emit('success')
        this.$message.success(this.isEdit ? '编辑成功' : '添加成功')
        this.form = {}
      }
    },
    onCancel () {
      this.$emit('cancel')
      this.form = {}
    },
    async loadResourceInfo () {
      const { data } = await getResourceById(this.resourceId)
      if (data.code === '000000') {
        this.form = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
