<template>
  <div class="note" v-if="id">
    <input ref="title"
      class="note__title"
      :disabled="frozen"
      v-model="title"
      @keyup="updateNote" />
    <note-actions notes-context :actions="actions" @change="updateActions" />
    <editor-menu-bubble
      :editor="editor"
      :keep-in-bounds="true"
      v-slot="{ commands, isActive, menu }" >
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <button
            class="menububble__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <icon-bold />
          </button>

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <icon-italic />
          </button>
      </div>
    </editor-menu-bubble>
    <editor-content class="note__content" :editor="editor" />
    <div class="note__management">
      <button @click="deleteNote" class="color-warn button">
        Delete <icon-trash />
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  History,
} from 'tiptap-extensions';
import { Plugins } from '@capacitor/core';
import debounce from 'lodash/debounce';
import { ACTIONS } from '../store';
import NoteActions from '../components/NoteActions.vue';
import IconTrash from '../components/IconTrash.vue';
import IconBold from '../components/IconBold.vue';
import IconItalic from '../components/IconItalic.vue';

const { Modals } = Plugins;

export default Vue.extend({
  name: 'NoteDetail',
  components: {
    EditorContent,
    EditorMenuBubble,
    NoteActions,
    IconTrash,
    IconBold,
    IconItalic,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      editor: null,
      title: '',
      content: '',
      note: {},
      actions: [],
      frozen: false,
    };
  },
  watch: {
    id(newval) {
      if (newval && newval !== 'new') {
        this.setupNote();
      }
    },
  },
  methods: {
    setupNote() {
      if (this.id && this.id !== 'new') {
        this.note = this.$store.state.notes[this.id];
        this.title = this.note.title;
        this.content = this.note.content;
        this.actions = this.note.actions || [];
        this.editor.setContent(this.note.content);
      }
    },
    updateActions(actions) {
      this.actions = actions;
      this.updateNote();
    },
    updateNote: debounce(async function updatenote() {
      if (this.id === 'new') {
        const docRef = await this.$store.dispatch(ACTIONS.ADD_NOTE, {
          title: this.title,
          content: this.content,
        });
        this.$router.replace({ name: 'note.detail', params: { id: docRef.id } });
        return;
      }
      await this.$store.dispatch(ACTIONS.SAVE_NOTE, {
        id: this.id,
        title: this.title,
        content: this.content,
        actions: this.actions,
      });
    }, 500),
    async deleteNote() {
      this.frozen = true;
      const confirmRet = await Modals.confirm({
        title: 'Confirm',
        message: `Delete ${this.note.title}?`,
      });
      if (confirmRet.value) {
        await this.$store.dispatch(ACTIONS.DELETE_NOTE, this.id);
        this.frozen = false;
        this.$router.replace({ name: 'notes' });
      }
    },
  },
  mounted() {
    if (window.document.documentElement.clientWidth > 768) {
      this.$refs.title.focus();
    }
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new History(),
      ],
      onUpdate: debounce(({ getJSON }) => {
        this.content = getJSON();
        this.updateNote();
      }, 500),
    });
    this.setupNote();
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.note {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.note__title {
  z-index: 1;
  display: block;
  width: 100%;
  padding: 1em;
  border: 0;
  font-size: 18px;
  font-weight: bold;
  position: sticky;
  top: 0;
  background-color: var(--background-color);
  color: var(--text-color);
}
.note__title:focus {
  outline: none;
  color: var(--text-color-focus);
}
.note__management {
  margin: 2rem 1rem;
  background-color: var(--background-color);
}
.note__content {
  padding: 0 1rem;
  flex: 1;
}
.note__content >>> .ProseMirror {
  height: 100%;
}
.note__content >>> .ProseMirror:focus {
  outline: none;
  color: var(--text-color-focus);
}

@media screen and (min-width: 1200px) {
  .note {
    padding-right: 400px;
    position: relative;
  }
  .actions {
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 100%;
    z-index: 2;
    padding: 50px;
  }
}

.menububble {
  display: none;
}

@media screen and (max-width: 768px) {
  .menububble {
    position: absolute;
    display: flex;
    z-index: 20;
    background: var(--text-color-focus);
    border-radius: 5px;
    padding: .3rem;
    margin-bottom: .5rem;
    transform: translateX(-50%);
    visibility: hidden;
    opacity: 0;
    transition: opacity .2s,visibility .2s;
  }
  .menububble svg {
    color: var(--text-color-light);
    width: 1em;
    height: 1em;
  }
  .menububble.is-active {
    opacity: 1;
    visibility: visible;
  }
}
</style>
