<template>
  <div class="notes"
    :class="{ 'notelist-overlay': noteListOverlay }"
    v-touch:swipe.right="showNoteList"
    @keyup.alt.arrow-up="noteNav(-1)"
    @keyup.alt.arrow-down="noteNav(1)">
    <ul class="notes__list" @click="noteListOverlay = false">
      <li v-for="(n, id) in notes" :key="id">
        <router-link class="notes__list-item" :to="{ name: 'note.detail', params: { id: n.id }}">
          <div class="title-label"> {{ n.title }} </div>
          <div class="title-actions color-gold" v-if="n.actions.length">
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
      All Notes
    </button>
  </div>
</template>

<script>
import Vue from 'vue';
import { ACTIONS } from '../store';
import IconActions from '../components/IconActions.vue';
import IconAdd from '../components/IconAdd.vue';

import QUOTES from '../quotes';

export default Vue.extend({
  name: 'Notes',
  components: {
    IconActions,
    IconAdd,
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
    showNoteList() {
      this.noteListOverlay = true;
    },
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
@media screen and (max-width: 768px) {
  .notes__list {
    box-shadow: 0px 2px 8px 1px rgba(0,0,0,0.15), 0px 0px 16px 1px rgba(0,0,0,0.05);
  }
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
  right: 0;
  width: 100%;
  text-align: center;
  display: none;
  padding: 16px;
  color: var(--text-color-mid);
  text-transform: uppercase;
  background: var(--background-color);
  border-top: 1px solid var(--text-color-light);
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.1em;
}
.notes-toggle:focus {
  outline: none;
}

@media screen and (max-width: 768px) {
  .notes-toggle {
    display: block;
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
