<template>
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th v-for="col in columns" v-on:click="sortBy(col.key)" :class="{active:sortKey===col.key}">
          {{ col.name}}
          <span class="arrow" :class="sortOrders[col.key] > 0 ? 'asc' : 'desc'"></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData">
        <td v-for="col in columns">
          {{entry[col.key]}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    replace:true,
    props: {
      data: Array,
      columns: Array,
      filterKey: String
    },
    methods: {
      sortBy: function(key) {
        this.sortKey = key;
         this.sortOrders[key] = this.sortOrders[key] * -1;
      }
    },
    filters:{
    },
    data() {
      var sortOrders = {}
      this.columns.forEach(function(col) {
        sortOrders[col.key] = 1
      })
      return {
        sortKey: '',
        sortOrders: sortOrders
      }
    },
    computed: {//实时计算数据变化
        filteredData: function () {
          var sortKey = this.sortKey,//当前排序的key
            filterKey = this.filterKey && this.filterKey.toLowerCase(),//要过滤的关键字
            order = this.sortOrders[sortKey] || 1,//排序状态 asc desc
            data = this.data;//props传递的gridData
          if (filterKey) {//仅在关键字不为空时查找
            data = data.filter(function (row,index,array) {//遍历数组的方法，row:数组子元素,index:索引，array:原始数组
              //Object.keys(row)用于返回数组子元素中可以枚举的属性
              return Object.keys(row).some(function (key) {//遍历子元素的属性以得到对应的value
                return String(row[key]).toLowerCase().indexOf(filterKey) > -1;//将得到的value转换为string并判断是否包含要查找的目标关键字
              })
            })
          }
          if (sortKey) {//排序字段不为空时进行排序
            data = data.slice().sort(function (a, b) {//使用slice将data转换为数组并进行排序
              a = a[sortKey];
              b = b[sortKey];
              return (a === b ? 0 : a > b ? 1 : -1) * order;//返回比较结果
            })
          }
          return data
        }
      }
  }
</script>
<style>
  @import '/src/assets/css/bootstrap.min.css';
  @import '/src/assets/css/theme.css';
</style>