<template>
  <div class="col-md-12">
    <div class="card card-container">

      <Form
        :validation-schema="schema"
        @submit="handleLogin"
      >
        <div class="form-group">
          <p>email12@example.com</p>
          <p>123abc</p>
          <label for="userEmail">userEmail</label>
          <Field
            name="userEmail"
            type="text"
            class="form-control"
          />
          <ErrorMessage
            name="userEmail"
            class="error-feedback"
          />
        </div>
        <div class="form-group">
          <label for="password">password</label>
          <Field
            name="password"
            type="password"
            class="form-control"
          />
          <ErrorMessage
            name="password"
            class="error-feedback"
          />
        </div>

        <div class="form-group">
          <button
            class="btn btn-primary btn-block"
            :disabled="loading"
          >
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            />
            <span>Login</span>
          </button>
        </div>

        <div class="form-group">
          <div
            v-if="message"
            class="alert alert-danger"
            role="alert"
          >
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login-page",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      userEmail: yup.string().required("userEmail is required!"),
      password: yup.string().required("Password is required!"),

    });

    return {
      loading: false,
      message: "",
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  methods: {
    handleLogin(user) {
      this.loading = true;
      // console.log(user,"----methods- handleLogin(user)")
      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 50px auto 25px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}



.error-feedback {
  color: red;
}
</style>
