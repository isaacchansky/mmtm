<template>
  <div id="app" :class="{ focus }">
    <div id="nav">
      <div class="sidebar">
        <button class="nav-link-icon" @click="toggleFocus">
          <icon-coffee />
        </button>
      </div>
      <div class="links">
        <template v-if="currentUser.uid">
          <router-link class="nav-link-icon" to="/notes">
            <icon-notes />
          </router-link>
          <router-link class="nav-link-icon" to="/actions">
            <icon-actions />
          </router-link>
        </template>
        <template v-else>
          <router-link to="/">Home</router-link>
        </template>
      </div>
      <router-link class="nav-link-icon" to="/settings">
        <icon-settings />
      </router-link>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { ACTIONS } from './store';
// import IconSync from './components/IconSync.vue';
import IconNotes from './components/IconNotes.vue';
import IconActions from './components/IconActions.vue';
import IconSettings from './components/IconSettings.vue';
import IconCoffee from './components/IconCoffee.vue';

export default Vue.extend({
  name: 'App',
  components: {
    // IconSync,
    IconNotes,
    IconActions,
    IconSettings,
    IconCoffee,
  },
  data() {
    return {
      focus: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
  },
  methods: {
    toggleFocus() {
      this.focus = !this.focus;
    },
    sync() {
      this.$store.dispatch(ACTIONS.FETCH_NOTES);
    },
  },
});
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, "Open Sans", "Helvetica Neue", sans-serif;
  --navbar-height: 40px;
  --background-color: #ffffff;
  --background-focus: #fafafa;
  --background-color-light: #fafafa;
  --text-color: #666;
  --text-color-focus: #333;
  --text-color-mid: #ccc;
  --text-color-light: #f2f2f2;
  --text-color-warn: #c62323;
  --font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: var(--text-color);
  z-index: 1;
  background: var(--background-color);
}
#nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #fafafa;
  height: var(--navbar-height);
  z-index: 1;
}
#content {
  margin-top: var(--navbar-height);
  height: calc(100vh - var(--navbar-height));
  overflow: hidden;
}

/* .focus {

} */

.nav-link-icon {
  padding: 1em;
}

button {
  background: transparent;
  font-size: inherit;
  border: none;
}
.button {
  border: 1px solid var(--text-color);
}
.color-warn {
  color: var(--text-color-warn);
}
</style>
