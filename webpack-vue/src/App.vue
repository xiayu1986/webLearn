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