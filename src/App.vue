<template>
  <div class="home-page">

    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto" >
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
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
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
          <div
              v-if="!loggedIn"
              class="navbar-nav ml-auto"
          >
            <li class="nav-item">
              <router-link
                  to="/login"
                  class="nav-link"
              >
                Login
              </router-link>
            </li>
          </div>

          <div
              v-if="loggedIn"
              class="navbar-nav ml-auto"
          >
            <li class="nav-item">
              <a
                  class="nav-link"
                  @click.prevent="logOut"
              >
                LogOut
              </a>
            </li>
          </div>
        </div>
      </div>
    </nav>

  </div>

        <div class="container">
        </div>

  <router-view />-->

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

      // window.location.reload();
      this.$router.push('/login');
    }
  }
};

</script>
<style scoped>
</style>