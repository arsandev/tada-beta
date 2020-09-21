<template>
  <div class="wrapper">
    <div class="main-header">
      <div class="logo-header">
				<a href="#" class="logo">TADA</a>
				<button class="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
					<span class="fa fa-list"></span>
				</button>
				<button class="more text-danger" @click="logout()"><i class="fa fa-sign-out"></i></button>
			</div>
      <nav class="navbar navbar-header navbar-expand-lg pt-1">
        <div class="container-fluid text-center">
          <ul class="navbar-nav topbar-nav ml-md-auto align-items-center">
            <li class="nav-item dropdown">
              <a @click="logout()" class="btn btn-danger text-white"> Keluar </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="sidebar">
      <div class="scrollbar-inner sidebar-wrapper">
        <div class="user">
          <div class="photo">
            <img src="/img/user/default.png">
          </div>
          <div class="info">
            <a class="" data-toggle="collapse" href="javascript:" aria-expanded="true">
              <span>
                <span class="user-level">Administrator</span>
              </span>
            </a>
            <div class="clearfix"></div>
          </div>
        </div>
        <ul class="nav">
          <b class="text-dark ml-3">Menu</b>
          <li class="nav-item">
            <router-link :to="{name:'aDashboard'}">
              <i class="fa fa-dashboard"></i>
              <p>Dasbor</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name:'aDocs'}">
              <i class="fa fa-folder"></i>
              <p>Dokumen</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name:'aUsers'}">
              <i class="fa fa-sort"></i>
              <p>Manajemen User</p>
            </router-link>
          </li>
          <hr>
          <b class="text-dark ml-3">Konfigurasi</b>
          <li class="nav-item">
            <router-link :to="{name:'aAccount'}">
              <i class="fa fa-user"></i>
              <p>Akun</p>
            </router-link>
          </li>
          <hr>
          <b class="text-dark ml-3">Info</b>
          <li class="nav-item">
            <router-link :to="{name:'aboutApp'}">
              <i class="fa fa-info"></i>
              <p>Tentang</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="main-panel">
      <div class="content">
        <div class="container-fluid">
          <router-view/>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="container-fluid">
        <div class="copyright ml-auto mt-3">
          Nov 2020, dibuat dengan <i class="fa fa-heart heart text-danger"></i> oleh <a href="https://arsandev.github.io">ArsanDev</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$cookies.remove("ttdt")
      this.$router.push({name: "login"})
    }
  }
}
</script>
