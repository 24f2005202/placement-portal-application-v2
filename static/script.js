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
import Company_ongoing_placement_drives from './components/company/ongoing_placement_drives.js'
import Closed_placement_drives from './components/company/closed_placement_drives.js'
import Create_Placement_Drive from './components/company/create_placement_drive.js'
import View_Placement_Drive from './components/company/view_placement_drive.js'

import Admin_Dashboard from './components/admin/admin_dashboard.js'
import Admin_Dashboard_Overview from './components/admin/admin_dashboard_overview.js'
import Admin_Profile from './components/admin/admin_profile.js'
import Registered_students from './components/admin/registered_students.js'
import Registered_companies from './components/admin/registered_companies.js'
import Ongoing_placement_drives from './components/admin/ongoing_placement_drives.js'
import Company_applications from './components/admin/company_applications.js'

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
            },
            {
                path: 'ongoing_placement_drives',
                component: Company_ongoing_placement_drives
            },
            {
                path: 'closed_placement_drives',
                component: Closed_placement_drives
            },
            {
                path: 'create_placement_drive',
                component: Create_Placement_Drive
            },
            {
                path: 'view_placement_drive/:id',
                component: View_Placement_Drive
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
            },
            {
                path: 'registered_students',
                component: Registered_students
            },
            {
                path: 'registered_companies',
                component: Registered_companies
            },
            {
                path: 'ongoing_placement_drives',
                component: Ongoing_placement_drives
            },
            {
                path: 'company_applications',
                component: Company_applications
            },
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