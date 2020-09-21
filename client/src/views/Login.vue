<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5">
            <div class="card-body">
              <h5 class="card-title text-center">Masuk Ke Halaman Admin</h5>
              <form class="form-signin" onsubmit="return false" method="post">
                <div class="form-label-group mb-3">
                  <input type="text" ref="username" class="form-control" placeholder="Masukan username" required autofocus autocomplete="off">
                </div>
                <div class="form-label-group mb-3">
                  <input type="password" ref="password" class="form-control" placeholder="Masukan password" required>
                </div>
                <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit" @click.prevent="login()">Masuk</button>
              </form>
            </div>
          </div>
          <div class="text-center">(c) 2020 - TADA V1.0.0</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.axios.post(`${this.api}/auth/login`, {
        username: this.$refs.username.value,
        password: this.$refs.password.value
      }).then(res => {
        let data = res.data
        if (data.status) {
          this.$cookies.set("ttdt", data.token)
          if (data.type === "admin") {
            // this.$router.push({name: "aDashboard"})
            window.location = "/ad"
          }
          else {
            this.$router.push({name: "pDashboard"})
          }
        }
        else this.toastr.warning("Username atau password salah!")
      })
    }
  }
}
</script>
