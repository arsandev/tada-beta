<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            Informasi Akun
          </div>
          <div class="card-body">
            <form @submit.prevent="changeUsername()" method="post">
              <table class="table">
                <tr>
                  <th>Username</th>
                  <td>:</td>
                  <td>
                    <input type="text" v-model="my.username" autocomplete="off" class="form-control">
                  </td>
                </tr>
                <tr>
                  <td colspan="3"><button type="submit" class="btn btn-success">Perbarui</button></td>
                </tr>
              </table>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            Ubah Password
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword()" method="post">
              <table class="table">
                <tr>
                  <th>Password Lama</th>
                  <td>:</td>
                  <td>
                    <input type="password" v-model="pass.old" autocomplete="off" class="form-control">
                  </td>
                </tr>
                <tr>
                  <th>Password Baru</th>
                  <td>:</td>
                  <td>
                    <input type="password" v-model="pass.new" autocomplete="off" class="form-control">
                  </td>
                </tr>
                <tr>
                  <th>Konfirmasi Password Baru</th>
                  <td>:</td>
                  <td>
                    <input type="password" v-model="pass.confirm" autocomplete="off" class="form-control">
                  </td>
                </tr>
                <tr>
                  <td colspan="3"><button type="submit" class="btn btn-success">Perbarui</button></td>
                </tr>
              </table>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        my: '',
        pass: {
          old: '',
          new: '',
          confirm: ''
        }
      }
    },
    methods: {
      getMy() {
        this.axios.get(`${this.api}/users/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(res => {
          this.my = res.data
        })
      },
      changeUsername() {
        this.axios.post(`${this.api}/users/me/username`, {
          username: this.my.username
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(res => {
          if (res.data.status) {
            this.toastr.success("Username telah berubah!")
          }
          else {
            this.toastr.error("Terjadi kesalahan pada sistem!")
          }
        })
      },
      changePassword() {
        if (this.pass.new === this.pass.confirm) {
          this.axios.post(`${this.api}/users/me/password`, {
            old: this.pass.old,
            new: this.pass.new,
            confirm: this.pass.confirm
          }, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(res => {
            if (res.data.status) {
              this.toastr.success("Password telah berubah!")
            }
            else {
              this.toastr.warning("Password lama anda salah!")
            }
          })
        }
        else {
          this.toastr.warning("Password baru dan password konfirmasi tidak sama!")
        }
      }
    },
    mounted() {
      this.getMy()
    }
  }
</script>
