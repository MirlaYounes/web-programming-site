const form = document.getElementById("profile-form");
const reviewPanel = document.getElementById("review-panel");
const editBtn = document.getElementById("edit-btn");
const confirmBtn = document.getElementById("confirm-btn");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    document.getElementById("review-student_id").textContent = document.getElementById("student_id").value;
    document.getElementById("review-fullname").textContent = document.getElementById("fullname").value;
    document.getElementById("review-email").textContent = document.getElementById("email").value;
    document.getElementById("review-phone").textContent = document.getElementById("phone").value;
    document.getElementById("review-birthdate").textContent = document.getElementById("birthdate").value;
    document.getElementById("review-portfolio").textContent = document.getElementById("portfolio").value;
    document.getElementById("review-gin446").textContent = document.getElementById("gin446").value;
    document.getElementById("review-major").textContent = document.getElementById("major").value;
    document.getElementById("review-gpa").textContent = document.getElementById("gpa").value;
    document.getElementById("review-credits").textContent = document.getElementById("credits").value;
    document.getElementById("review-graduation_month").textContent = document.getElementById("graduation_month").value;
    document.getElementById("review-language").textContent = document.getElementById("language").value;
    document.getElementById("review-project_title").textContent = document.getElementById("project_title").value;
    document.getElementById("review-project_area").textContent = document.getElementById("project_area").value;
    document.getElementById("review-description").textContent = document.getElementById("description").value;
    document.getElementById("review-team_size").textContent = document.getElementById("team_size").value;
    document.getElementById("review-project_color").textContent = document.getElementById("project_color").value;
    document.getElementById("review-meeting_date").textContent = document.getElementById("meeting_date").value;
    document.getElementById("review-meeting_time").textContent = document.getElementById("meeting_time").value;

    // Collect radio buttons, checkboxes, and multi-selects
    const grad = document.querySelector('input[name="graduation"]:checked')?.value || "";
    const internship = document.querySelector('input[name="internship_completed"]:checked')?.value || "";
    const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(cb => cb.value);
    const software = [...document.getElementById("software").selectedOptions].map(opt => opt.value);

    document.getElementById("review-graduation").textContent = grad;
    document.getElementById("review-internship_completed").textContent = internship;
    document.getElementById("review-skills").textContent = skills.join(", ");
    document.getElementById("review-software").textContent = software.join(", ");

    // Hide the form and show the review panel
    form.classList.add("hidden");
    reviewPanel.classList.add("open");
});

// Edit button: hides review panel and brings back the form with data intact
editBtn.addEventListener("click", function () {
    reviewPanel.classList.remove("open");
    form.classList.remove("hidden");
});

// Confirm & Submit button: bypasses event listener and sends data to server
confirmBtn.addEventListener("click", function () {
    HTMLFormElement.prototype.submit.call(form);
});