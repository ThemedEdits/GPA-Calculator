import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= DOM ELEMENTS =================
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loadingOverlay = document.getElementById("loadingOverlay");

// ================= LOADING HELPERS =================
function showLoading() {
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

// ================= TAB SWITCHING =================
const tabBtns = document.querySelectorAll(".tab-btn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    if (tab === "login") {
      loginForm.classList.add("active");
      signupForm.classList.remove("active");
    } else {
      signupForm.classList.add("active");
      loginForm.classList.remove("active");
    }
  });
});

// ================= PASSWORD TOGGLE =================
document.querySelectorAll(".toggle-password").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const icon = btn.querySelector("i");
    
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

// ================= SIGNUP =================
document.getElementById("signup").onclick = async () => {
  if (!nameEl.value || !emailEl.value || !passwordEl.value) {
    alert("⚠️ All fields are required");
    return;
  }

  if (passwordEl.value.length < 6) {
    alert("⚠️ Password must be at least 6 characters");
    return;
  }

  showLoading();

  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      emailEl.value,
      passwordEl.value
    );

    await setDoc(doc(db, "users", res.user.uid), {
      name: nameEl.value,
      email: emailEl.value,
      createdAt: new Date()
    });

    location.href = "index.html";
  } catch (error) {
    hideLoading();
    let message = "❌ Signup failed";
    
    if (error.code === "auth/email-already-in-use") {
      message = "❌ This email is already registered";
    } else if (error.code === "auth/invalid-email") {
      message = "❌ Invalid email address";
    } else if (error.code === "auth/weak-password") {
      message = "❌ Password is too weak";
    }
    
    alert(message);
  }
};

// ================= LOGIN =================
document.getElementById("login").onclick = async () => {
  if (!loginEmail.value || !loginPassword.value) {
    alert("⚠️ Email and password are required");
    return;
  }

  showLoading();

  try {
    await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPassword.value
    );
    location.href = "index.html";
  } catch (error) {
    hideLoading();
    let message = "❌ Login failed";
    
    if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
      message = "❌ Invalid email or password";
    } else if (error.code === "auth/wrong-password") {
      message = "❌ Incorrect password";
    } else if (error.code === "auth/too-many-requests") {
      message = "❌ Too many attempts. Please try again later";
    }
    
    alert(message);
  }
};

// ================= GOOGLE SIGN IN =================
document.getElementById("google").onclick = async () => {
  showLoading();

  try {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    // Save user if first time
    await setDoc(
      doc(db, "users", res.user.uid),
      {
        name: res.user.displayName,
        email: res.user.email,
        createdAt: new Date()
      },
      { merge: true }
    );

    location.href = "index.html";
  } catch (error) {
    hideLoading();
    
    if (error.code === "auth/popup-closed-by-user") {
      return; // User closed popup, no need to show error
    }
    
    alert("❌ Google sign-in failed. Please try again.");
  }
};

// ================= ENTER KEY SUPPORT =================
[loginEmail, loginPassword].forEach(input => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("login").click();
    }
  });
});

[nameEl, emailEl, passwordEl].forEach(input => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("signup").click();
    }
  });
});