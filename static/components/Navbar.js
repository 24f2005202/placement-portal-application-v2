export default {
    template: `
    <nav class="navbar">
        <a class="app-name" href="/">
            <img src="/static/img/logo.png" alt="Logo" style="width:22px; margin-right:10px;">
            Placement Portal Application
        </a>

        <div class="all-buttons">
            <router-link v-if="!login_status" to="/student_register">
                <button class="dark_btn">Register as Student</button>
            </router-link>

            <router-link v-if="!login_status" to="/company_register">
                <button class="dark_btn">Register as Company</button>
            </router-link>

            <router-link v-if="!login_status" to="/login">
                <button class="dark_btn">Login</button>
            </router-link>

            <button
                v-if="login_status"
                @click="logout_user"
                class="dark_btn">
                Logout
            </button>
        </div>
    </nav>
    `,

    data() {
        return {
            login_status: false
        };
    },

    created() {
        this.login_status = localStorage.getItem("login_status") === "true";
    },

    methods: {
        logout_user() {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("id");
            localStorage.removeItem("role");
            localStorage.setItem("login_status", "false");

            this.login_status = false;

            this.$router.push("/");
        }
    },

    watch: {
        $route() {
            this.login_status = localStorage.getItem("login_status") === "true";
        }
    }
}