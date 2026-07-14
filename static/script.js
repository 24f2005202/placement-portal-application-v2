import Home from './components/Home.js'
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import Login from './components/login.js'

import Student_Register from './components/student/student_register.js'
import Student_Dashboard from './components/student/student_dashboard.js'
import Student_Dashboard_Overview from './components/student/student_dashboard_overview.js'
import Student_Profile from './components/student/student_profile.js'
import Student_registered_companies from './components/student/student_registered_companies.js'
import Student_ongoing_placement_drives from './components/student/student_ongoing_placement_drives.js'
// import Student_applied_drives from './components/student/student_applied_drives.js'
import Student_view_placement_drive from './components/student/student_view_placement_drive.js'
import Student_applied_drives from './components/student/student_applied_drives.js'
import Student_interview from './components/student/student_interview.js'

import Company_Register from './components/company/company_register.js'
import Company_Dashboard from './components/company/company_dashboard.js'
import Company_Dashboard_Overview from './components/company/company_dashboard_overview.js'
import Company_Profile from './components/company/company_profile.js'
import Company_ongoing_placement_drives from './components/company/ongoing_placement_drives.js'
import Company_closed_placement_drives from './components/company/closed_placement_drives.js'
import Create_Placement_Drive from './components/company/create_placement_drive.js'
import View_Placement_Drive from './components/company/view_placement_drive.js'
import Company_schedule_interview from './components/company/company_schedule_interview.js'
import Company_interviews from './components/company/company_interviews.js'

import Admin_Dashboard from './components/admin/admin_dashboard.js'
import Admin_Dashboard_Overview from './components/admin/admin_dashboard_overview.js'
import Admin_Profile from './components/admin/admin_profile.js'
import Registered_students from './components/admin/registered_students.js'
import Registered_companies from './components/admin/registered_companies.js'
import Ongoing_placement_drives from './components/admin/ongoing_placement_drives.js'
import Closed_placement_drives from './components/admin/closed_placement_drive.js'
import Company_applications from './components/admin/company_applications.js'
import Deactivated_students from './components/admin/deactivated_students.js'
import Deactivated_companies from './components/admin/deactivated_companies.js'
import Admin_student_applications from './components/admin/admin_student_applications.js'

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
            },
            {
                path: 'registered_companies',
                component: Student_registered_companies
            },
            {
                path: 'ongoing_placement_drives',
                component: Student_ongoing_placement_drives
            },
            // {
            //     path: 'applied_drives',
            //     component: Student_applied_drives
            // },
            {
                path: 'view_placement_drive/:id',
                component: Student_view_placement_drive
            },
            {
                path: 'applied_drives',
                component: Student_applied_drives
            },
            {
                path: 'interview',
                component: Student_interview
            },
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
                component: Company_closed_placement_drives
            },
            {
                path: 'create_placement_drive',
                component: Create_Placement_Drive
            },
            {
                path: 'view_placement_drive/:id',
                component: View_Placement_Drive
            },
            {
                path: 'schedule_interview/:id',
                component: Company_schedule_interview
            },
            {
                path: 'interviews',
                component: Company_interviews
            },
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
                path: 'closed_placement_drives',
                component: Closed_placement_drives
            },
            {
                path: 'company_applications',
                component: Company_applications
            },
            {
                path: 'deactivated_students',
                component: Deactivated_students
            },
            {
                path: 'deactivated_companies',
                component: Deactivated_companies
            },
            {
                path: 'student_applications',
                component: Admin_student_applications
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