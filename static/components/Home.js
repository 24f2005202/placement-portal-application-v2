export default {
    template: `
    <div>
        <img src="/static/img/ppa.png" alt="Banner" style="width: 100%; height: auto;">

        <div class="home">
            <h1>Where startups and job seekers connect</h1>
            <div class="buttons">
            <router-link to="/student_register"> <button class="btn btn-dark">Continue as a Student</button> </router-link>
            <router-link to="/company_register"> <button class="btn btn-dark">Continue as a Company</button> </router-link>
            </div>
        </div>

        
    </div>
    `
}