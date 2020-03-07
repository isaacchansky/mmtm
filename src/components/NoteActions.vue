<template>
  <div class="actions" :class="{ collapsed, 'focused-view': !notesContext }">
    <label  v-if="notesContext" class="actions__title">
      <span class="actions__title--wide">Actions</span>
      <span class="actions__title--narrow" @click="collapsed = !collapsed">
        Actions
        <icon-chevron-down />
      </span>
      <button v-if="hasDoneActions" class="actions__clear-done" @click="clearDone">clear done</button>
    </label>
    <ul class="actions__list">
      <li class="actions__item"
        :class="`actions__item--${a.state || 'todo'}`"
        v-for="(a, i) in internalActions"
        :key="a.title">
        <button class="actions__item-label"
          @keyup.arrow-up="advanceAction(i, 'asc')"
          @keyup.arrow-down="advanceAction(i, 'desc')"
          @click="advanceAction(i)">
          {{ a.title }}
          <span class="action__icon"></span>
        </button>
      </li>
      <li v-if="notesContext" class="actions__item actions__item--todo actions__item--new">
        <div class="actions__item-label">
          <input class="action__new-input"
            type="text"
            v-model="newAction"
            @blur="addAction(newAction)"
            @keyup.enter="addAction(newAction)" />
          <span class="action__icon"></span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from 'vue';
import debounce from 'lodash/debounce';
import IconChevronDown from './IconChevronDown.vue';

const ACTION_STATE = {
  TODO: 'todo',
  STARTED: 'started',
  DONE: 'done',
};

const actionStates = [
  ACTION_STATE.TODO,
  ACTION_STATE.STARTED,
  ACTION_STATE.DONE,
];

export default Vue.extend({
  name: 'NoteActions',
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
    notesContext: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    IconChevronDown,
  },
  data() {
    return {
      collapsed: false,
      newAction: '',
      internalActions: [],
      actionStates: [
        {
          text: 'To Do',
          value: ACTION_STATE.TODO,
        },
        {
          text: 'Started',
          value: ACTION_STATE.STARTED,
        },
        {
          text: 'Done',
          value: ACTION_STATE.DONE,
        },
      ],
    };
  },
  computed: {
    hasDoneActions() {
      return this.internalActions.filter((action) => action.state === 'done').length > 0;
    },
  },
  watch: {
    actions: {
      handler(newval) {
        this.internalActions = newval;
      },
      immediate: true,
    },
  },
  methods: {
    clearDone() {
      this.internalActions = this.internalActions.filter((action) => action.state !== 'done');
      this.update();
    },
    addAction(title) {
      const action = title.trim();
      this.newAction = '';
      if (action.length === 0) {
        return;
      }
      this.internalActions.push({
        title: action,
        done: false,
        state: ACTION_STATE.TODO,
        createdAt: new Date(),
      });
      this.update();
    },
    advanceAction(index, dir) {
      const change = dir === 'desc' ? -1 : 1;
      this.internalActions = this.internalActions.map((a, i) => {
        if (i === index) {
          const astate = actionStates[actionStates.indexOf(a.state) + change] || ACTION_STATE.TODO;
          return {
            ...a,
            state: astate,
          };
        }
        return a;
      });
      this.update();
    },
    update: debounce(function updateactions() {
      this.$emit('change', [...this.internalActions]);
    }, 500),
  },
});

</script>
<style scoped>

.actions__title {
  padding: 0 1rem;
  text-transform: uppercase;
  font-size: 12px;
  color: var(--text-color-mid);
  letter-spacing: 0.05em;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.actions__clear-done {
  color: var(--text-color-mid);
}
.actions__clear-done:focus {
  outline: none;
  color: var(--text-color);
}

.actions__list {
  margin: 0;
  list-style: none;
  padding: 0 1rem;
  max-height: 100vh;
  transition: all 250ms ease-in-out;
}
.collapsed .actions__list {
  max-height: 0;
  overflow: hidden;
}
.collapsed svg {
  transform: rotate(90deg);
}
.actions__item {
  margin-bottom: 8px;
}
.focused-view .actions__item {
  padding-left: 12px;
}
.actions__item-label {
  border: none;
  font-size: 16px;
  padding: 2px 2px;
  background-color: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row-reverse;
  color: currentColor;
  text-align: left;
}
.actions__item-label:focus {
  outline: none;
  background-color: var(--background-focus);
  border-radius: 14px;
}
.action__icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  border: 1px solid var(--text-color-mid);
  border-radius: 50%;
  vertical-align: middle;
  position: relative;
  margin-right: 0.5em;
}
.action__icon:after,
.action__icon:before {
  content: '';
  width: 3px;
  height: 3px;
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 1px;
  transition: all 150ms linear;
}
.action__icon:after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
.action__icon:before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.actions__item--todo .action__icon:before,
.actions__item--todo .action__icon:after {
  border-radius: 50%;
  border: 1px solid var(--text-color-mid);
}
.actions__item--started {
  color: var(--color-green);
}
.actions__item--started .actions__item-label {
  font-weight: 500;
}
.actions__item--started .action__icon:after {
  border: none;
  background-color: var(--text-color);
  width: 80%;
  height: 1px;
}
.actions__item--done {
  color: var(--color-gold);
  opacity: 0.5;
  text-decoration: line-through;
}
.actions__item--done .action__icon:after {
  border: none;
  background-color: var(--text-color);
  width: 80%;
  height: 1px;
}
.actions__item--done .action__icon:before {
  border: none;
  background-color: var(--text-color);
  width: 80%;
  height: 1px;
}
.actions__item--new .action__icon {
  opacity: 0.5;
}
.action__new-input {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid var(--text-color-light);
  font-size: 16px;
}
.action__new-input:focus {
  outline: none;
}
.action__new-input:focus + .action__icon {
  opacity: 1;
}

.actions__title--narrow {
  display: none;
}
@media screen and (max-width: 1200px) {
  .actions__title--narrow {
    display: block;
  }
  .actions__title--wide {
    display: none;
  }
}
</style>
