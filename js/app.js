// ================= FIREBASE IMPORTS =================
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= DOM ELEMENTS =================
const subjectsContainer = document.getElementById("subjectsContainer");
const gpaEl = document.getElementById("gpa");
const cgpaEl = document.getElementById("cgpa");

const userNameEl = document.getElementById("userName");
const authBtn = document.getElementById("authBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loadingOverlay = document.getElementById("loadingOverlay");

// ================= LOADING HELPERS =================
function showLoading() {
    loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
    loadingOverlay.classList.add("hidden");
}

// ================= NAV =================
authBtn.onclick = () => location.href = "auth.html";
logoutBtn.onclick = async () => {
    showLoading();
    await signOut(auth);
    location.reload();
};

// ================= SUBJECT UI =================
function addSubject(marks = "", credits = "") {
    const div = document.createElement("div");
    div.className = "subject";
    // div.style.gridTemplateColumns = "1fr 1fr 1fr auto";


    div.innerHTML = `
    <input
      type="number"
      min="0"
      max="100"
      placeholder="Marks (0-100)"
      value="${marks}"
      required
    >
    <input
      type="number"
      min="1"
      max="6"
      step="1"
      placeholder="Credit Hours"
      value="${credits}"
      required
    >
    <div class="subject-info"></div>
    <button title="Remove Subject">✕</button>
  `;

    div.querySelector("button").onclick = () => {
        if (subjectsContainer.children.length > 1) {
            div.style.animation = "scaleOut 0.3s ease-out";
            setTimeout(() => {
                div.remove();
                calculateLiveGPA();
            }, 300);
        }
    };

    div.querySelectorAll("input").forEach(i =>
        i.addEventListener("input", calculateLiveGPA)
    );

    subjectsContainer.appendChild(div);
}


document.getElementById("addSubject").onclick = () => addSubject();
addSubject();

// ================= GPA LOGIC =================
function gradePoint(marks) {
    if (marks >= 90 && marks <= 100) return 4.0; // A+
    if (marks >= 80) return 4.0;                // A
    if (marks >= 70) return 3.5;                // B+
    if (marks >= 60) return 3.0;                // B
    if (marks >= 55) return 2.5;                // C+
    if (marks >= 50) return 2.0;                // C
    return null; // F → no grade point
}

function gradeLetter(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 55) return "C+";
    if (marks >= 50) return "C";
    return "F";
}



function calculateGPAFromSubjects(subjects) {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach(({ marks, credits }) => {
        const gp = gradePoint(marks);
        if (gp !== null) {
            totalCredits += credits;
            totalGradePoints += gp * credits;
        }
    });

    return {
        gpa: totalCredits ? (totalGradePoints / totalCredits).toFixed(2) : "0.00",
        totalCredits,
        totalGradePoints: totalGradePoints.toFixed(2)
    };
}



function calculateLiveGPA() {
    let totalCredits = 0;
    let totalGradePoints = 0;

    document.querySelectorAll(".subject").forEach(s => {
        const marks = +s.children[0].value;
        const credits = +s.children[1].value;
        const info = s.querySelector(".subject-info");

        if (!marks || !credits) {
            if (info) info.innerHTML = "";
            return;
        }

        const gp = gradePoint(marks);
        const grade = gradeLetter(marks);
        const subjectPoints = gp !== null ? gp * credits : 0;

        if (gp !== null) {
            totalCredits += credits;
            totalGradePoints += subjectPoints;
        }

        info.innerHTML = `
      <span><strong>Grade:</strong> ${grade}</span>
      <span><strong>GP:</strong> ${gp ?? 0}</span>
      <span><strong>Total GP:</strong> ${subjectPoints.toFixed(2)}</span>
    `;
    });

    gpaEl.innerText = totalCredits
        ? (totalGradePoints / totalCredits).toFixed(2)
        : "0.00";
}


// ================= AUTH STATE =================
onAuthStateChanged(auth, async user => {
    showLoading();

    if (!user) {
        // User is logged out
        authBtn.style.display = "flex";
        logoutBtn.style.display = "none";
        userNameEl.innerText = "";
        document.getElementById("saveSemester").style.display = "none";
        document.getElementById("history").style.display = "none";
        hideLoading();
        return;
    }

    // User is logged in
    authBtn.style.display = "none";
    logoutBtn.style.display = "flex";

    const snap = await getDoc(doc(db, "users", user.uid));
    userNameEl.innerText = `Hi, ${snap.data().name}`;

    document.getElementById("saveSemester").style.display = "block";
    document.getElementById("history").style.display = "block";

    await loadHistory();
    hideLoading();
});

// ================= SAVE SEMESTER =================
document.getElementById("saveSemester").onclick = async () => {
    // Check if user is logged in
    if (!auth.currentUser) {
        alert("🔒 Please login to save your semester");
        location.href = "auth.html";
        return;
    }

    const subjects = [];
    let totalCredits = 0;

    document.querySelectorAll(".subject").forEach(s => {
        const m = +s.children[0].value;
        const c = +s.children[1].value;
        if (m && c) {
            subjects.push({ marks: m, credits: c });
            totalCredits += c;
        }
    });

    if (subjects.length === 0) {
        alert("⚠️ At least one subject is required");
        return;
    }

    showLoading();

    try {
        const result = calculateGPAFromSubjects(subjects);

        const semester =
            document.getElementById("semesterName").value || "Semester";

        await addDoc(
            collection(db, "users", auth.currentUser.uid, "semesters"),
            {
                semester,
                subjects,
                gpa: result.gpa,
                credits: result.totalCredits,
                totalGradePoints: result.totalGradePoints,
                date: new Date()
            }
        );


        resetForm();
        await loadHistory();

        // Success feedback
        const saveBtn = document.getElementById("saveSemester");
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.style.background = 'var(--success)';

        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.background = '';
        }, 2000);

    } catch (error) {
        alert("❌ Error saving semester: " + error.message);
    } finally {
        hideLoading();
    }
};

// ================= RESET =================
function resetForm() {
    subjectsContainer.innerHTML = "";
    addSubject();
    gpaEl.innerText = "0.00";
    document.getElementById("semesterName").value = "";
}

// ================= HISTORY + CGPA =================
async function loadHistory() {
    if (!auth.currentUser) return;

    const list = document.getElementById("semesterList");
    list.innerHTML = '<div style="text-align:center; color: var(--gray);">Loading...</div>';

    let weighted = 0, credits = 0;

    try {
        const snap = await getDocs(
            collection(db, "users", auth.currentUser.uid, "semesters")
        );

        list.innerHTML = "";

        if (snap.empty) {
            list.innerHTML = '<li style="text-align:center; color: var(--gray); padding: 2rem;">No saved semesters yet. Start by adding one above!</li>';
            cgpaEl.innerText = "0.00";
            return;
        }

        snap.forEach(d => {
            const data = d.data();

            weighted += Number(data.gpa) * data.credits;
            credits += data.credits;


            const li = document.createElement("li");
            li.innerHTML = `
        <div>
          <strong>${data.semester}</strong>
          <span style="color: var(--white); margin-left: 1rem;">
  GPA: ${data.gpa} • Credits: ${data.credits} • Total GP: ${data.totalGradePoints}
</span>

        </div>
        <div>
          <button onclick="openEditModal('${d.id}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteSemester('${d.id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
            list.appendChild(li);
        });

        cgpaEl.innerText = credits
            ? (weighted / credits).toFixed(2)
            : "0.00";
    } catch (error) {
        list.innerHTML = '<li style="text-align:center; color: var(--danger);">Error loading history</li>';
    }
}

// ================= DELETE =================
window.deleteSemester = async id => {
    if (!auth.currentUser) {
        alert("🔒 Please login first");
        location.href = "auth.html";
        return;
    }

    if (!confirm("Are you sure you want to delete this semester?")) return;

    showLoading();

    try {
        await deleteDoc(
            doc(db, "users", auth.currentUser.uid, "semesters", id)
        );

        await loadHistory();
    } catch (error) {
        alert("❌ Error deleting semester: " + error.message);
    } finally {
        hideLoading();
    }
};

// ================= EDIT MODAL =================
let currentEditId = null;

window.openEditModal = async id => {
    if (!auth.currentUser) {
        alert("🔒 Please login first");
        location.href = "auth.html";
        return;
    }

    currentEditId = id;
    showLoading();

    try {
        const snap = await getDoc(
            doc(db, "users", auth.currentUser.uid, "semesters", id)
        );

        const data = snap.data();

        document.getElementById("editSemesterName").value = data.semester;

        const container = document.getElementById("editSubjects");
        container.innerHTML = "";

        const subjects = data.subjects?.length
            ? data.subjects
            : [{ marks: "", credits: "" }];

        subjects.forEach(s => addEditSubject(s.marks, s.credits));

        updateEditGPA();
        document.getElementById("editModal").classList.remove("hidden");
    } catch (error) {
        alert("❌ Error loading semester: " + error.message);
    } finally {
        hideLoading();
    }
};

function addEditSubject(marks = "", credits = "") {
    const div = document.createElement("div");
    div.className = "subject";

    div.innerHTML = `
    <input type="number" min="0" max="100" placeholder="Marks (0-100)" value="${marks}">
<input type="number" min="1" max="6" step="1" placeholder="Credit Hours" value="${credits}">
<div class="subject-info"></div>
    <button title="Remove Subject">✕</button>
  `;

    div.querySelector("button").onclick = () => {
        if (div.parentElement.children.length > 1) {
            div.style.animation = "scaleOut 0.3s ease-out";
            setTimeout(() => {
                div.remove();
                updateEditGPA();
            }, 300);
        }
    };

    div.querySelectorAll("input").forEach(i =>
        i.addEventListener("input", updateEditGPA)
    );

    document.getElementById("editSubjects").appendChild(div);
}

function updateEditGPA() {
    const subjects = [];

    document.querySelectorAll("#editSubjects .subject").forEach(s => {
        const m = +s.children[0].value;
        const c = +s.children[1].value;
        if (m && c) subjects.push({ marks: m, credits: c });
    });

    if (!subjects.length) {
        document.getElementById("editGPA").innerText = "0.00";
        return;
    }

    const result = calculateGPAFromSubjects(subjects);
    document.getElementById("editGPA").innerText = result.gpa;
}


// ================= SAVE EDIT =================
document.getElementById("saveEdit").onclick = async () => {
    if (!auth.currentUser) {
        alert("🔒 Please login first");
        location.href = "auth.html";
        return;
    }

    const subjects = [];
    let credits = 0;

    document.querySelectorAll("#editSubjects .subject").forEach(s => {
        const m = +s.children[0].value;
        const c = +s.children[1].value;
        if (m && c) {
            subjects.push({ marks: m, credits: c });
            credits += c;
        }
    });

    if (subjects.length === 0) {
        alert("⚠️ At least one subject is required");
        return;
    }

    showLoading();

    try {
        const result = calculateGPAFromSubjects(subjects);

        await updateDoc(
            doc(db, "users", auth.currentUser.uid, "semesters", currentEditId),
            {
                semester: document.getElementById("editSemesterName").value,
                subjects,
                gpa: result.gpa,
                credits: result.totalCredits,
                totalGradePoints: result.totalGradePoints
            }
        );


        closeModal();
        await loadHistory();
    } catch (error) {
        alert("❌ Error updating semester: " + error.message);
    } finally {
        hideLoading();
    }
};

document.getElementById("addEditSubject").onclick = () => {
    addEditSubject();
    updateEditGPA();
};

document.getElementById("closeModal").onclick = closeModal;
document.getElementById("cancelEdit").onclick = closeModal;

function closeModal() {
    document.getElementById("editModal").classList.add("hidden");
}

// Add CSS for scale out animation
const style = document.createElement('style');
style.textContent = `
  @keyframes scaleOut {
    to {
      transform: scale(0.9);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);