<template>
  <div class="wrapper">
    <div class="register">
      <form action="#" @submit.prevent="register">
        <div class="form-item">
          <label for="email">Email</label>
          <input type="email" v-model="email">
        </div>
        <div class="form-item">
          <label for="password">Password</label>
          <input type="passowrd" v-model="password">
        </div>
        <button class="button" type="submit">Register</button>
      </form>
      <router-link :to="{ name: 'login' }">Log In</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import firebase from 'firebase';
// import { db } from '../main';

export default Vue.extend({
  name: 'Register',
  props: {
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    register() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(() => {
        this.$router.replace('/login');
      });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
