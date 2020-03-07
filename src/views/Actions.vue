<template>
  <div class="wrapper">
    <div class="aggregate-actions">
      <div class="tag-filters" v-if="tags.length">
        <button class="button"
          :class="{active: tagFilter === null}"
          @click="tagFilter = null"> All </button>
        <button class="button"
          v-for="t in tags" :key="t"
          :class="{active: tagFilter === t}"
          @click="tagFilter = t">{{ t }}</button>
      </div>
      <template v-for="(n, id) in notes">
        <div class="note-actions" v-if="n.actions && n.actions.length" :key="id">
          <label>
            <router-link :to="{ name: 'note.detail', params: { id: n.id }}">
              {{ n.title }}
            </router-link>
          </label>
          <note-actions :actions="n.actions" @change="(actions) => updateNote(n, actions)" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import NoteActions from '../components/NoteActions.vue';
import { ACTIONS } from '../store';

export default Vue.extend({
  name: 'Actions',
  components: {
    NoteActions,
  },
  data() {
    return {
      tagFilter: null,
    };
  },
  computed: {
    notes() {
      if (this.tagFilter) {
        const notes = {};
        Object.keys(this.$store.state.notes).forEach((noteKey) => {
          const n = this.$store.state.notes[noteKey];
          if (n.tags.includes(this.tagFilter)) {
            notes[noteKey] = n;
          }
        });
        return notes;
      }
      return this.$store.state.notes;
    },
    tags() {
      const tags = [];
      Object.values(this.$store.state.notes).forEach((n) => {
        n.tags.forEach((t) => {
          if (!tags.includes(t)) {
            tags.push(t);
          }
        });
      });
      return tags;
    },
  },
  methods: {
    async updateNote(note, actions) {
      await this.$store.dispatch(ACTIONS.SAVE_NOTE, {
        ...note,
        actions,
      });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tag-filters {
  text-align: center;
}
.aggregate-actions {
  padding: 0 !important;
}
.note-actions {
  margin-bottom: 20px;
}
.note-actions label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  padding: 8px;
}
>>> .actions__list {
  padding: 0;
}

@media screen and (max-width: 768px) {
  .note-actions label {
    background-color: var(--background-color-light);
    padding: 8px 16px;
  }
}

</style>
