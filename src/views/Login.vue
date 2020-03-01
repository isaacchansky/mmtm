<template>
  <div class="login">
    <form action="#" @submit.prevent="login">
      <div class="form-item">
        <label for="email">Email</label>
        <input type="email" v-model="email">
      </div>
      <div class="form-item">
        <label for="password">Password</label>
        <input type="password" v-model="password">
      </div>
      <button class="button" type="submit">Log In</button>
    </form>
    <router-link :to="{ name: 'register' }">Register</router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import firebase from 'firebase';
// import { db } from '../main'

export default Vue.extend({
  name: 'Login',
  props: {
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
          this.$router.replace('/about');
        });
      });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  margin: 24px auto;
  padding: 16px;
}
.form-item {
  margin-bottom: 8px;
}
input {
  border: 1px solid;
  display: block;
  width: 100%;
}
</style>
