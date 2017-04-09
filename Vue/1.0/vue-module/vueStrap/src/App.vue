<template>
  <div id="app">
  	<alert type="success/info/danger/warning">
		213123
	</alert>
  </div>
</template>

<script>
import {modal} from 'vue-strap';
import { alert } from 'vue-strap'
export default {
  name: 'app',
  data () {
    return {
      showRight: true
    }
  },
  components:{alert}
}
</script>

