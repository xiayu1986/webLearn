<template>
<div class="panel panel-primary">
  <div class="panel-heading">数据表格</div>
  <div class="panel-body">
    <div class="form-group"><input type="text" v-model="searchQuery" class="form-control" /></div>
    <Grid :data="gridData" :columns="gridColumns" :filter-key="searchQuery" :sort-order="sortOrder">
    </Grid>
  </div>
</div>
</template>

<script>
  import Grid from './components/grid.vue'
  export default {
    data() {
      return {
        searchQuery: '',
        sortOrder: {
          column: 'name',
          order: 1
        },
        gridColumns: [{"name":"出发城市","key":"city"},{"name":"飞行时长","key":"time"}],
        gridData: [
        { city: '北京', time:"2h30m" },
        { city: '上海', time:"1h3m" },
        { city: '重庆', time:"2h10m" },
        { city: '南京', time:"2h40m" }
        ]
      }
    }, components: {
      Grid
    }
  }
</script>