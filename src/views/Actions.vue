<template>
  <div class="aggregate-actions">
    <template v-for="(n, id) in notes">
      <div class="note-actions" v-if="n.actions && n.actions.length" :key="id">
        <label>{{ n.title }}</label>
        <note-actions :actions="n.actions" @change="(actions) => updateNote(n, actions)" />
      </div>
    </template>
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
    return {};
  },
  computed: {
    notes() {
      return this.$store.state.notes;
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
.aggregate-actions {
  margin: 10vh auto auto;
  width: 100%;
  max-width: 400px;
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
