<template>
  <div class="home-page">

    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto" >
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 mb-2">
            <li class="nav-item">
              <router-link
                  to="/"
                  class="nav-link"
              >
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  to="/chat"
                  class="nav-link"
              >
                Chat
              </router-link>
            </li>
          </ul>
          <div
              v-if="!loggedIn"
              class="navbar-nav mr-auto"
          >
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 mb-2">
            <li class="nav-item">
              <router-link
                  to="/login"
                  class="nav-link"
              >
                Login
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  to="/registration"
                  class="nav-link"
              >
                Registration
              </router-link>
            </li>
            </ul>
          </div>

          <div
              v-if="loggedIn"
              class="navbar-nav ml-auto"
          >
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 mb-2">
            <li class="nav-item">
              <a
                  class="nav-link"
                  @click.prevent="logOut"
              >
                LogOut
              </a>
            </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

  </div>

        <div class="container">
        </div>

  <router-view />

</template>

<script>

export default {
  computed: {
    loggedIn() {
      try {
      if(this.$store.state.auth.user!=null){
      return this.$store.state.auth.user
      }
} catch (e) {
        localStorage.setItem('$store.logddgedIn', false);
      }
      return this.$store.state.auth.user
    },
  },
  methods: {

    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};

</script>
<style scoped>
</style>