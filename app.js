// API URL for backend (assuming it's hosted at localhost:5000)
const API_URL = "http://localhost:5000/api";

// Check for stored token (for keeping users logged in)
let token = localStorage.getItem('token');

// Registration
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    alert('Registration successful! You can now log in.');
  } catch (error) {
    alert('Error registering user.');
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token); // Save JWT token
      token = data.token;
      alert('Login successful!');
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    alert('Error logging in.');
  }
});

// Upload Mod
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('modTitle').value;
  const description = document.getElementById('modDescription').value;
  const modFile = document.getElementById('modFile').files[0];

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('modFile', modFile);

  try {
    const response = await fetch(`${API_URL}/mods/upload`, {
      method: 'POST',
      headers: {
        'x-auth-token': token // Include JWT token for authentication
      },
      body: formData
    });

    const data = await response.json();
    alert('Mod uploaded successfully!');
    loadMods(); // Reload mod list after upload
  } catch (error) {
    alert('Error uploading mod.');
  }
});

// Fetch and Display Mods
async function loadMods() {
  try {
    const response = await fetch(`${API_URL}/mods`);
    const mods = await response.json();

    const modList = document.getElementById('modList');
    modList.innerHTML = ''; // Clear previous list

    mods.forEach(mod => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${mod.title}</strong> - <a href="${API_URL}${mod.filePath}" download>Download</a>`;
      modList.appendChild(li);
    });
  } catch (error) {
    alert('Error loading mods.');
  }
}

// Call loadMods() on page load to show all mods
loadMods();
