<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<template>
  <el-card style="height: 100%">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <slot name="extra"></slot>
        <!--具名插槽 -->
        <!-- <el-button type="primary">添加分类</el-button> -->
      </div>
    </template>

    <slot></slot>
    <!-- 内容插槽 -->
  </el-card>
</template>
<style lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
