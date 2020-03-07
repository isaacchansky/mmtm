import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import { Plugins, DeviceInfo } from '@capacitor/core';


Vue.use(Vuex);

firebase.initializeApp({
  apiKey: 'AIzaSyC7Qm0Mpt3ZzLV4td8O3VDSmJkiVsSGsZI',
  authDomain: 'horme-notes.firebaseapp.com',
  databaseURL: 'https://horme-notes.firebaseio.com',
  projectId: 'horme-notes',
  storageBucket: 'horme-notes.appspot.com',
  messagingSenderId: '403054310178',
  appId: '1:403054310178:web:d43078e7b8ef07a2c16b7b',
});

export const db = firebase.firestore();

export enum MUT {
  SET_CURRENT_USER = 'SET_CURRENT_USER',
  SET_NOTES = 'SET_NOTES',
  SET_CURRENT_NOTE = 'SET_CURRENT_NOTE',
  UPDATE_NOTE = 'UPDATE_NOTE',
  REMOVE_NOTE = 'REMOVE_NOTE',
  SET_DEVICE = 'SET_DEVICE',
  SET_SHOW_NOTES_LIST = 'SET_SHOW_NOTES_LIST',
  SET_RESOLVED = 'SET_RESOLVED',
}

export enum ACTIONS {
  AUTH_USER = 'authUser',
  LOGOUT = 'logout',
  FETCH_NOTES = 'fetchnotes',
  FETCH_NOTE = 'fetchnote',
  ADD_NOTE = 'addNote',
  SAVE_NOTE = 'saveNote',
  DELETE_NOTE = 'deleteNote',
}

export interface Note {
  title: string;
  content: string;
  id: string;
  createdAt: Date;
}

export interface NoteSet {
  [key: string]: Note;
}

export interface Action {
  title: string;
  done: boolean;
  createdAt: Date;
}

const store = new Vuex.Store({
  state: {
    version: '0.0.1',
    currentUser: {} as any,
    notes: {} as NoteSet,
    currentNoteID: '' as string | null,
    device: {} as DeviceInfo,
    showNotesList: true,
    authResolved: false,
  },
  getters: {
    noteSummaries(state) {
      return Object.values(state.notes).map((n: Note) => ({
        id: n.id,
        title: n.title,
      }));
    },
  },
  mutations: {
    [MUT.SET_CURRENT_USER](state, user) {
      Vue.set(state, 'currentUser', user);
    },
    [MUT.SET_DEVICE](state, device) {
      Vue.set(state, 'device', device);
    },
    [MUT.SET_SHOW_NOTES_LIST](state, show) {
      Vue.set(state, 'showNotesList', show);
    },
    [MUT.SET_NOTES](state, notes: Note[]) {
      // Key notes off of ID
      const notelist = [];
      const noteset = {} as any;
      for (let i = 0; i < notes.length; i += 1) {
        noteset[notes[i].id] = notes[i];
        notelist.push({
          id: notes[i].id,
          title: notes[i].title,
          createdAt: notes[i].createdAt,
        });
      }
      Vue.set(state, 'notes', noteset);
      Vue.set(state, 'noteList', notelist);
    },
    [MUT.SET_CURRENT_NOTE](state, note: Note) {
      Vue.set(state, 'currentNoteID', note.id);
    },
    [MUT.UPDATE_NOTE](state, note: Note) {
      Vue.set(state.notes, note.id, note);
    },
    [MUT.REMOVE_NOTE](state, id: string) {
      delete state.notes[id];
    },
    [MUT.SET_RESOLVED](state, isResolved: boolean) {
      Vue.set(state, 'authResolved', isResolved);
    },
  },
  actions: {
    [ACTIONS.AUTH_USER](context, user) {
      // context.commit(MUT.SET_CURRENT_USER, user);
    },
    async [ACTIONS.LOGOUT](context) {
      return new Promise((resolve, reject) => {
        firebase.auth().signOut().then(() => {
          context.commit(MUT.SET_CURRENT_USER, null);
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    },
    async [ACTIONS.FETCH_NOTES](context) {
      return new Promise((resolve, reject) => {
        db.collection('notes').orderBy('createdAt').where('owner', '==', store.state.currentUser.uid).get().then((q) => {
          const notesData = q.docs.map((d) => ({ id: d.id, ...d.data() }));
          context.commit(MUT.SET_NOTES, notesData);
          resolve(notesData);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    async [ACTIONS.FETCH_NOTE](context, id) {
      return new Promise((resolve, reject) => {
        db.collection('notes').doc(id).get().then((d) => {
          const data = { id: d.id, ...d.data() };
          context.commit(MUT.SET_CURRENT_NOTE, data);
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    async [ACTIONS.ADD_NOTE](context, { title, content }) {
      return new Promise((resolve, reject) => {
        db.collection('notes').add({
          title,
          content,
          createdAt: new Date(),
          owner: context.state.currentUser.uid,
          actions: [],
        }).then(async (d) => {
          await context.dispatch(ACTIONS.FETCH_NOTES);
          resolve(d);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    async [ACTIONS.SAVE_NOTE](context, note: Note) {
      return new Promise((resolve, reject) => {
        db.collection('notes').doc(note.id).update({ ...note }).then(() => {
          context.commit(MUT.UPDATE_NOTE, { ...note });
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    },
    async [ACTIONS.DELETE_NOTE](context, id) {
      return new Promise((resolve, reject) => {
        db.collection('notes').doc(id).delete().then(() => {
          context.commit(MUT.REMOVE_NOTE, id);
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    },
  },
  // modules: {
  // },
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.commit(MUT.SET_CURRENT_USER, user);
    store.dispatch(ACTIONS.FETCH_NOTES);
  }
  store.commit(MUT.SET_RESOLVED, true);
});

Plugins.Device.getInfo().then((data) => {
  store.commit(MUT.SET_DEVICE, data);
});

export default store;
