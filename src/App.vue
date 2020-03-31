<template>
  <div id="app" :class="{ focus, max }"  v-if="resolved">
    <div id="nav">
      <div class="nav-section">
        <button class="nav-link-icon" @click="toggleFocus">
          <div class="logotype">mmtm.</div>
        </button>
      </div>

      <div class="nav-section">
        <template v-if="currentUser.uid">
          <router-link class="nav-link-icon" to="/notes">
            <icon-notes /> Notes
          </router-link>
          <router-link class="nav-link-icon" to="/actions">
            <icon-actions /> Actions
          </router-link>
        </template>
      </div>

      <div class="nav-section">
        <router-link class="nav-link-icon" to="/settings">
          <icon-settings />
        </router-link>
        <button class="nav-link-icon" @click="max = !max">
          <icon-max />
        </button>
      </div>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
  <loading-indicator v-else />
</template>
<script>
import Vue from 'vue';
import { ACTIONS } from './store';
import IconMax from './components/IconMax.vue';
import IconNotes from './components/IconNotes.vue';
import IconActions from './components/IconActions.vue';
import IconSettings from './components/IconSettings.vue';
import LoadingIndicator from './components/LoadingIndicator.vue';

export default Vue.extend({
  name: 'App',
  components: {
    IconMax,
    IconActions,
    IconNotes,
    IconSettings,
    LoadingIndicator,
  },
  data() {
    return {
      focus: false,
      max: false,
    };
  },
  computed: {
    resolved() {
      return this.$store.state.authResolved;
    },
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
  --color-warn: #ef928f;
  --color-green: #58968a;
  --color-gold: #c3a77b;
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

#content .wrapper {
  max-height: 100%;
  overflow-y: scroll;
}
#content .wrapper > * {
  margin: 14px auto;
  max-width: 400px;
  padding: 0 14px;
}
@media screen and (min-width: 768px) {
  #content .wrapper  > * {
    margin: 40px auto;
  };
}

.nav-section {
  min-width: 70px;
  text-align: center;
}

.nav-link-icon {
  padding: 1em;
  text-decoration: none;
  vertical-align: middle;
}
.nav-link-icon svg {
  vertical-align: text-bottom;
}

button {
  background: transparent;
  font-size: inherit;
  border: none;
}

a, a:hover, a:focus, a:visited {
  color: var(--text-color);
}

.form-item {
  margin-bottom: 8px;
}
.form-item label {
  text-transform: uppercase;
  letter-spacing: 0.075em;
  font-size: 12px;
  margin-bottom: 4px;
  display: inline-block;
}
.form-item input {
  border: 1px solid;
  display: block;
  width: 100%;
  padding: 0.5em;
}

.button {
  border: 1px solid currentColor;
  padding: 0.25em 1em;
  margin-bottom: 16px;
}
.button:hover, .button:focus, .button.active {
  border-color: var(--text-color-focus);
  background-color: var(--text-color-focus);
  color: var(--background-color);
}
.color-warn {
  color: var(--color-warn);
}
.color-green {
  color: var(--color-green);
}
.color-gold {
  color: var(--color-gold);
}
.button.color-warn:hover, .button.color-warn:focus {
  background-color: var(--color-warn);
  color: var(--background-color);
}
.logotype {
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: -0.05em;
  font-size: 12px;
}

.max .note {
  padding-right: 0 !important;
}
.max .actions {
  display: none;
}
.max .notes__list {
  display: none !important;
}
.max .notes__detail {
  width: 100vw !important;
}

</style>
