<template>
    <div>
        <div class="form-group text-right">
            <div class="form-inline">
                <input type="text" v-model="searchQuery" class="form-control" placeholder="请输入关键字" />
            </div>
        </div>
            <Grid :data="gridData" :columns="gridColumns" :filter-key="searchQuery">
            </Grid>
    </div>
</template>

<script>
  import Grid from './components/grid.vue'
  export default {
    data(){
      return {
        searchQuery: '',
        sortOrder: {
          column: 'name',
          order: 1
        },
        gridColumns: [{"name":"出发城市","key":"city"},{"name":"飞行时长","key":"time"},{"name":"起飞时间","key":"depTime"}],
        gridData: [
        { city: '北京', time:"2h30m" ,depTime:"2016-11-24 13:00:00"},
        { city: '上海', time:"1h3m" ,depTime:"2016-11-26 17:12:00"},
        { city: '重庆', time:"2h10m" ,depTime:"2016-11-23 09:30:00"},
        { city: '南京', time:"2h40m" ,depTime:"2016-11-27 21:30:00"}
        ]
      }
    }, components: {
      Grid
    }
  }
</script>