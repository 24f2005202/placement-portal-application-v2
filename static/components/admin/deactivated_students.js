export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">
                Deactivated Students
            </h2>
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
                        <th scope="col">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="student in deactivated_students" :key="student.id">
                        <td>{{ student.id }}</td>
                        <td>{{ student.name }}</td>
                        <td>{{ student.course }}</td>
                        <td>{{ student.batch_year }}</td>
                        <td>{{ student.current_cgpa }}</td>
                        <td>
                            <button
                                type="button"
                                class="btn btn-success"
                                @click="activate_student(student.id)"
                            >
                                Activate
                            </button>
                        </td>
                    </tr>

                    <tr v-if="deactivated_students.length === 0">
                        <td colspan="6" class="text-center">
                            No deactivated students found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,

    data() {
        return {
            deactivated_students: []
        };
    },

    mounted() {
        this.loadDeactivatedStudents();
    },

    methods: {
        async loadDeactivatedStudents() {
            try {
                const response = await fetch('/api/admin/deactivated_students', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    this.deactivated_students = data;
                } else {
                    alert(data.message || "Failed to load deactivated students.");
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            }
        },

        async activate_student(student_id) {
            try {
                const response = await fetch(`/api/admin/activate_student/${student_id}`, {
                    method: "PUT",
                    headers: {
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
                    this.loadDeactivatedStudents();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            }
        }
    }
};