<template>
  <div class="note-tags">
    <ul class="tags">
      <li v-for="t in tags" :key="t">
        <div class="tag">
          {{ t }}
          <button class="tag__remove" @click="removeTag(t)"> &times; </button>
        </div>
      </li>
    </ul>
    <form @submit.prevent="addTag" class="tag-form">
      <select v-model="newExistingTag">
        <option v-for="t in availableTags" :key="t" :value="t">
          {{ t }}
        </option>
      </select>
      <input type="text" v-model="newNovelTag" placeholder="new tag" />
      <button class="button" :disabled="isDisabled"> Add Tag </button>
    </form>
  </div>
</template>
<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'noteTags',
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    existingTags: {
      type: Array,
      default: () => ['Work', 'Weekend', 'Personal'],
    },
  },
  data() {
    return {
      newExistingTag: '',
      newNovelTag: '',
    };
  },
  computed: {
    isDisabled() {
      return this.newNovelTag + this.newExistingTag === '';
    },
    availableTags() {
      return this.existingTags.filter((t) => !this.tags.includes(t));
    },
  },
  methods: {
    removeTag(tag) {
      this.$emit('change', this.tags.filter((t) => t !== tag));
    },
    addTag() {
      const theTag = this.newNovelTag || this.newExistingTag;
      if (!theTag) {
        return;
      }
      this.newExistingTag = '';
      this.newNovelTag = '';
      this.$emit('change', [...this.tags, theTag]);
    },
  },
});
</script>
<style>
.tags {
  margin: 0;
  padding: 0;
  list-style: none;
}
.tags li {
  display: inline-block;
}
.tag {
  border: 1px solid var(--text-color-mid);
  padding-left: 0.25em;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}
.tag__remove {
  font-size: 14px;
  line-height: 16px;
}

.tag-form input {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid var(--text-color-mid);
  font-size: 16px;
  margin: 0 8px;
}
.tag-form input::placeholder {
  color: var(--text-color-light);
}
</style>
