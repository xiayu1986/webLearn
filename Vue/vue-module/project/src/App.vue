<template>
<div>
    <div class="panel panel-primary">
        <div class="panel-heading">数据表格</div>
        <div class="panel-body">
            <div class="form-group text-right">
                <div class="form-inline">
                    <input type="text" v-model="searchQuery" class="form-control" placeholder="请输入关键字" />
                </div>
            </div>
                <grid :data="gridData" :columns="gridColumns" :filter-key="searchQuery">
                </grid>
        </div>
    </div>
    <div class="panel panel-primary">
        <div class="panel-heading">加载数据</div>
        <div class="panel-body">
            <data-table :head-list="headList" :user-list="userList"></data-table>
        </div>
    </div>
</div>
</template>

<script>
  import Grid from './components/grid.vue';//加载数据表格
  import dataTable from './components/dataTable.vue';//加载用户列表
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
    },
    components: {
      grid:Grid,
      dataTable:dataTable
    }
  }

  /*----------------------测试ES6----------------------*/
  class People{
    constructor(name){
        this.name=name;
    }
    getName(){
     console.log(this.name);
    }
  }

  class Student extends People{
    constructor(name,grade){
        super(name);
        this.grade=grade;
    }
    getGrade(){
        console.log(this.grade)
    }
  }
  var p= new People("小明");
  p.getName();
  var s=new Student("小张","三年级");
  s.getName();
  s.getGrade();
</script>