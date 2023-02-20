<template>
  <div class="home-page">

    <nav class="navbar navbar-expand navbar-dark bg-dark">
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
            <li class="nav-item" v-if="!loggedIn">
              <router-link
                  to="/login"
                  class="nav-link"
              >
                Login
              </router-link>
            </li>
            <li class="nav-item" v-if="!loggedIn">
              <router-link
                  to="/registration"
                  class="nav-link"
              >
                Registration
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav  mb-2 mb-lg-0 mb-6">
            <li>

              <span class="nav-link">  {{ pusherNewUser }}  </span>

            </li>
          </ul>

          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 mb-6"  v-if="loggedIn">
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

    </nav>

  </div>

        <div class="container">
        </div>

  <router-view />

</template>

<script>

export default {
  data() {
    return {
      pusherNewUsers:[""],
      pusherNewUser:null
     }},
  computed: {

    loggedIn() {
      try {
      if(this.$store.state.auth.user!=null){
      return this.$store.state.auth.user
      }
} catch (e) {
        localStorage.setItem('$store.loggedIn', false);
      }
      return this.$store.state.auth.user
    },
  },
  mounted() {
    const channel = this.$pusher.subscribe('my-channel');
    channel.bind('new-user', event => {
      this.pusherNewUsers.push(event)
      this.pusherNewUser=(Object.entries(this.pusherNewUsers[this.pusherNewUsers.length-1])).join(" :")
    })
    console.log('subscribing to `my-channel`...', {
      $pusher: this.$pusher,
    })
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