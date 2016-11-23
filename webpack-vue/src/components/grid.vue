<template>
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th v-for="col in columns" v-on:click="sortBy(col.key)">

          {{ col.name}}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in data">
        <td v-for="col in columns">
          {{entry[col.key]}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    props: {
      data: Array,
      columns: Array,
      sortOrder: Object,
      filterKey: String
    },
    methods: {
      sortBy: function(col) {
        this.sortKey = col;
        this.sortOrders[col] *= -1
      }
    },
    filters:{
        capitalize:function(str){
          return str
        }
    },
    data() {
      var sortOrders = {}
      this.columns.forEach(function(col) {
        sortOrders[col] = 1
      })
      return {
        sortKey: '',
        sortOrders: sortOrders
      }
    }
  }
</script>
