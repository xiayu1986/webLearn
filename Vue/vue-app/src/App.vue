<template>
  <div>
    <name :name="name"></name>
  </div>
</template>

<script>
import area from './components/area.vue';
export default {
  props:["name"],
  components:{"name":area}
}
</script>
