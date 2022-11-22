<template>
  <div
      v-if="!currentUser"
      class="navbar-nav ml-auto"
  >
<span>please login</span>
</div>
  <div
      v-if="currentUser"
      class="navbar-nav ml-auto"
  >
    <span> login-ok</span>
  </div>
<!--  <contacts  />-->
</template>

<script>
// import contacts from "./contacts";
export default {
  name: 'Home-page',
  props: {
    msg: String
  },
  computed: {
    currentUser() {
      try {
        if (this.$store.state.auth.user.role != null) {
          // console.log(this.$store.state.auth.user.role," -currentUser role !=null")
        }
      } catch (e) {
        localStorage.setItem('state.auth.user.role', '3');
      }
      return this.$store.state.auth.user;
    },
  },
  components: {
    // contacts,
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
