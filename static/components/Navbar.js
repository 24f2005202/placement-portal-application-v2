export default {
    template: `
    
    <nav class="navbar">
        <a class="app-name" href="/">
            Placement Portal Application
        </a>
            
        <div class="all-buttons">
            <router-link to="/student_register"><button class="dark_btn" type="button">Register as Student</button></router-link>
            <router-link to="/company_register"><button class="dark_btn" type="button">Register as Company</button></router-link>
            <router-link to="/login"><button class="dark_btn" type="button">Login</button></router-link>
            <button @click="logout_user" class="dark_btn" type="button">Logout</button>
        </div>
    </nav>
    `,
    methods:{
        logout_user(){
            localStorage.removeItem('auth_token');
            localStorage.removeItem('id');
            localStorage.removeItem('role');
            this.$router.push('/');

        }
        
    }
    
}