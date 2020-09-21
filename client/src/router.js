import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import vueCookies from 'vue-cookies'
import axios from 'axios'

Vue.use(Router)
Vue.use(vueCookies)

const adminRule = async (to, from, next) => {
  let condition = false
  var check = await axios.get("/api/auth/checkStatusUser", {
    headers: {
      Authorization: `Bearer ${Vue.$cookies.get("ttdt")}`
    }
  })
  if (check) {
    if (check.data.status === "admin") next()
    else next({name: 'pDashboard'})
  }
  else next({name: 'login'})
}
const partyRule = async (to, from, next) => {
  let condition = false
  var check = await axios.get("/api/auth/checkStatusUser", {
    headers: {
      Authorization: `Bearer ${Vue.$cookies.get("ttdt")}`
    }
  })
  if (check) {
    if (check.data.status === "party") next()
    else next({name: 'aDashboard'})
  }
  else next({name: 'login'})
}
const publicRule = (to, from, next) => {
  let condition = false
  if (Vue.$cookies.get("ttdt")) condition = true
  if (condition) next({name: 'aDashboard'})
  else next()
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/sign',
      name: 'sign',
      meta:{title:'Halaman Tanda Tangan'},
      component: () => import('./views/client/TTD.vue')
    },
    {
      path: '/',
      name: 'login',
      meta:{title:'Masuk'},
      beforeEnter: publicRule,
      component: () => import('./views/Login.vue')
    },

    {
      path: '/ad',
      component: () => import('./views/admin/Layout.vue'),
      beforeEnter: adminRule,
      children: [
        {
          path: '/account',
          name: 'aAccount',
          meta:{title:'Pengaturan Akun'},
          component: () => import('./views/admin/Account.vue')
        },
        {
          path: '/about',
          name: 'aboutApp',
          meta:{title:'Tentang Aplikasi'},
          component: () => import('./views/About.vue')
        },
        {
          path: '',
          meta:{title:'Dasbor'},
          name: 'aDashboard',
          component: () => import('./views/admin/Dashboard.vue'),
        },
        {
          path: '/docs',
          component: () => import('./views/admin/Docs/Layout.vue'),
          children: [
            {
              path: '',
              meta:{title:'Manajemen Dokumen'},
              name: 'aDocs',
              component: () => import('./views/admin/Docs/Docs.vue'),
            },
            {
              path: ':id',
              meta:{title:'Detail Dokumen'},
              name: 'aDocDetail',
              component: () => import('./views/admin/Docs/DocDetail.vue'),
            },
            {
              path: ':id/party',
              meta:{title:'Pengaturan Pihak Yang Terlibat'},
              name: 'aDocSettingParty',
              component: () => import('./views/admin/Docs/DocSettingParty.vue'),
            },
            {
              path: ':id/party/:id_party',
              meta:{title:'Ubah Pihak'},
              name: 'aDocSettingPartyShow',
              component: () => import('./views/admin/Docs/PartyEdit.vue'),
            },
            {
              path: ':id/rule',
              meta:{title:'Aturan Dokumen'},
              name: 'aDocSettingRule',
              component: () => import('./views/admin/Docs/DocSettingRule.vue'),
            },
            {
              path: ':id/party/create',
              meta:{title:'Tambah Pihak'},
              name: 'aPartyCreate',
              component: () => import('./views/admin/Docs/PartyCreate.vue'),
            },
          ]
        },
        {
          path: 'users',
          meta:{title:'Manajemen User'},
          name: 'aUsers',
          component: () => import('./views/admin/Users/Users.vue'),
        },
        {
          path: 'users/:id',
          meta:{title:'Detail User'},
          name: 'aUsersDetail',
          component: () => import('./views/admin/Users/UserDetail.vue'),
        }
      ]
    },

    {
      path: '/pa',
      component: () => import('./views/party/Layout.vue'),
      beforeEnter: partyRule,
      children: [
        {
          path: '/about',
          name: 'pAboutApp',
          meta:{title:'Tentang Aplikasi'},
          component: () => import('./views/About.vue')
        },
        {
          path: '',
          meta:{title:'Dasbor'},
          name: 'pDashboard',
          component: () => import('./views/party/Dashboard.vue'),
        },
        {
          path: 'docs',
          meta:{title:'Dokumen'},
          name: 'pDocs',
          component: () => import('./views/party/Docs/Docs.vue'),
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title // Set <title> for every components
  NProgress.start()
  NProgress.set(0.5)
  next()
})
router.afterEach(() => {
  setTimeout(() => NProgress.done(), 20)
})

export default router
