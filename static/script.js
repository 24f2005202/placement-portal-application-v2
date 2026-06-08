import Home from './components/Home.js'
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import Login from './components/login.js'

import Student_Register from './components/student/student_register.js'
import Student_Dashboard from './components/student/student_dashboard.js'
import Student_Dashboard_Overview from './components/student/student_dashboard_overview.js'
import Student_Profile from './components/student/student_profile.js'

import Company_Register from './components/company/company_register.js'
import Company_Dashboard from './components/company/company_dashboard.js'
import Company_Dashboard_Overview from './components/company/company_dashboard_overview.js'
import Company_Profile from './components/company/company_profile.js'

import Admin_Dashboard from './components/admin/admin_dashboard.js'
import Admin_Dashboard_Overview from './components/admin/admin_dashboard_overview.js'
import Admin_Profile from './components/admin/admin_profile.js'

const routes = [
    { path: '/', component: Home },
    { path: '/student_register', component: Student_Register },
    { path: '/company_register', component: Company_Register },
    { path: '/login', component: Login },
    { path: '/student_dashboard', 
        component: Student_Dashboard,
        children: [
            {
                path: '',
                component: Student_Dashboard_Overview
            },
            {
                path: 'profile',
                component: Student_Profile
            }
        ]
    },
    { path: '/company_dashboard', 
        component: Company_Dashboard,
        children: [
            {
                path: '',
                component: Company_Dashboard_Overview
            },
            {
                path: 'profile',
                component: Company_Profile
            }
        ]
    },
    { path: '/admin_dashboard', 
        component: Admin_Dashboard,
        children: [
            {
                path: '',
                component: Admin_Dashboard_Overview
            },
            {
                path: 'profile',
                component: Admin_Profile
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el: "#app",
    router,
    template: `
    <div>
        <nav-bar></nav-bar>
        <main>
        <router-view></router-view>
        </main>
        <foot></foot>
    </div>
    `,
    components:{
        "nav-bar": Navbar,
        "foot": Footer
        
    }
})