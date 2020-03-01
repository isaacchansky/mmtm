<template>
  <div class="notes"
    :class="{ 'notelist-overlay': noteListOverlay }"
    @keyup.alt.arrow-up="noteNav(-1)"
    @keyup.alt.arrow-down="noteNav(1)">
    <ul class="notes__list" @click="noteListOverlay = false">
      <li v-for="(n, id) in notes" :key="id">
        <router-link class="notes__list-item" :to="{ name: 'note.detail', params: { id: n.id }}">
          <div class="title-label"> {{ n.title }} </div>
          <div class="title-actions" v-if="n.actions.length">
            <icon-actions />
            {{ n.actions.filter(a => a.state !== 'done').length }}
          </div>
        </router-link>
      </li>
      <li class="spacer"></li>
      <li>
        <router-link
          class="notes__list-item notes__list-item--new"
          :to="{ name: 'note.detail', params: { id: 'new' }}">
          <icon-add />
        </router-link>
      </li>
    </ul>
    <div class="notes__detail">
      <router-view v-if="$route.params.id" :key="$route.params.id"></router-view>
      <div class="quote" v-else>
        <div class="quote-text">
          {{ randomQuote }}
        </div>
      </div>
    </div>
    <button class="notes-toggle" @click="noteListOverlay = !noteListOverlay">
      <icon-sidebar />
    </button>
  </div>
</template>

<script>
import Vue from 'vue';
import { ACTIONS } from '../store';
import IconActions from '../components/IconActions.vue';
import IconAdd from '../components/IconAdd.vue';
import IconSidebar from '../components/IconSidebar.vue';

import QUOTES from '../quotes';

export default Vue.extend({
  name: 'Notes',
  components: {
    IconActions,
    IconAdd,
    IconSidebar,
  },
  data() {
    return {
      title: '',
      content: '',
      noteListOverlay: false,
    };
  },
  computed: {
    notes() {
      return this.$store.state.notes || {};
    },
    randomQuote() {
      return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    },
  },
  methods: {
    noteNav(change) {
      const ids = Object.keys(this.notes);
      const currIndex = ids.indexOf(this.$route.params.id);
      const newIndex = currIndex + change;
      if (currIndex === -1 || newIndex === -1 || !ids[newIndex]) {
        return;
      }
      this.$router.push({ name: 'note.detail', params: { id: ids[newIndex] } });
    },
    addNote() {
      this.$store.dispatch(ACTIONS.ADD_NOTE, {
        title: this.title,
        content: this.content,
      });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.notes {
  display: flex;
  height: 100%;
}

.spacer {
  flex: 1;
}

.notes__list {
  padding: 0;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
  width: 200px;
  border-right: 1px solid var(--text-color-light);
  display: flex;
  flex-direction: column;
  transition: all 250ms ease-in-out;
}
.notes__list-item {
  padding: 1em 1.5em;
  display: block;
  text-decoration: none;
  font-size: 12px;
  font-weight: bold;
  color: var(--text-color);
}
.notes__list-item:hover,
.notes__list-item.router-link-active {
  background-color: var(--text-color-light);
}
.title-label {
  margin-bottom: 4px;
}

.notes__list-item--new {
  text-align: center;
}
.notes__list li + li {
  border-top: 1px solid var(--text-color-light);
}

.notes__detail {
  width: calc(100vw - 200px);
}

.quote {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: var(--font-serif);
  color: var(--text-color-mid);
  font-size: 18px;
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1.6;
}
.quote-text {
  max-width: 560px;
}


.notes-toggle {
  position: fixed;
  bottom: 0;
  left: 0;
  display: none;
  padding: 16px;
}
.notes-toggle:focus {
  outline: none;
}

@media screen and (max-width: 768px) {
  .notes-toggle {
    display: flex;
  }
  .notes__list {
    position: fixed;
    top: var(--navbar-height);
    background-color: var(--background-color);
    bottom: 0;
    width: 100vw;
    z-index: 2;
    transform: translateX(-100%);
  }
  .notelist-overlay .notes__list {
    transform: translateX(0%);
  }
  .notes__detail {
    width: 100vw;
  }
}
</style>
