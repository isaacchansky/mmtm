<template>
  <div class="wrapper">
    <div class="settings">
      <div>{{ currentUser.email }}</div>
      <br>
      <div>v.{{ version }}</div>
      <br>
      <button class="button" @click="logout">Logout</button>
      <br>
      <strong>DEVICE:</strong>
      <pre>
        {{ deviceInfo }}
      </pre>
    </div>
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
    version() {
      return this.$store.state.version;
    },
    deviceInfo() {
      return this.$store.state.device;
    },
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
pre {
  max-height: 400px;
  width: 100%;
  display: block;
  overflow: auto;
}
</style>
