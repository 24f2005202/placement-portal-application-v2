export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
        <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Registered Students</h2>
        </div>

        <div class="row" style="padding: 20px;">
        <table class="table">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Course</th>
                <th scope="col">Batch Year</th>
                <th scope="col">Current CGPA</th>
                <th scope="col">Resume Link</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="student in registeredStudents" :key="student.id">
                <td scope="row">{{ student.id }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.course }}</td>
                <td>{{ student.batch_year }}</td>
                <td>{{ student.current_cgpa }}</td>
                <td> <a :href="student.resume_link" target="_blank"> View </a> </td>
                <td>
                <button type="button" class="btn btn-danger" @click="blacklist_student(student.id)">Blacklist</button>
                </td>
            </tr>
        </tbody>
        </table>
        </div>
    </div>
    
    
    
    `,
    data: function(){
        return {
            registeredStudents: []
        }
    },
    mounted(){
        this.loadRegisteredStudents()
    },
    methods:{
        async loadRegisteredStudents(){
            const response= await fetch('/api/admin/registered_students', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })

            const data= await response.json()
            this.registeredStudents = data
        },
        async blacklist_student(student_id) {
            try {
                const res = await fetch(`/api/admin/deactivate_student/${student_id}`, {
                    method: "PUT",
                    headers: {
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message);
                    this.loadRegisteredStudents();   
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            }
        }
        }
    }
