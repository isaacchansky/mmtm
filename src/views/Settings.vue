<template>
  <div class="settings">
    <div>{{ currentUser.email }}</div>
    <br>
    <button class="button" @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ACTIONS } from '../store';

export default Vue.extend({
  name: 'Settings',
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch(ACTIONS.LOGOUT);
      this.$router.replace({ name: 'login' });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settings {
  margin: 40px auto;
  max-width: 400px;
  padding: 16px;
}
pre {
  max-height: 400px;
  overflow: auto;
}
</style>
