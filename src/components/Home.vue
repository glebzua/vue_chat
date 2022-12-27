<template>
  <div
      v-if="loggedIn"
      class="navbar-nav ml-auto"
  >
    <span>loggedIn </span>
  </div>
  <div
      v-if="!loggedIn"
      class="navbar-nav ml-auto"
  >
    <span>  please login </span>
  </div>

</template>

<script>


export default {
  name: 'Home-page',
  props: {
    msg: String

  },
  computed: {
    loggedIn() {
      try {
        if (localStorage.loggedIn === 'true') {
          return true
        }
      } catch (e) {
        localStorage.setItem('$store.loggedIn', 'false');
      }
      return false;
    },
  },
    methods: {
      logOut() {
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');


      }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

</style>
