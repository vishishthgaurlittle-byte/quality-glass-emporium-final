// ==========================================================================
// Quality Glass Emporium — Login / Signup Page
// ==========================================================================

function renderLogin() {
  return `
    ${renderSiteHeader()}
    <div class="login-page">
      <div class="login-card animate-scale-in">
        <div style="text-align: center; margin-bottom: 8px;">
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--secondary);">storefront</span>
        </div>
        <h1 class="login-title">Welcome</h1>
        <p class="login-subtitle">Sign in to your Quality Glass Emporium account</p>

        <div class="login-tabs" id="login-tabs">
          <div class="login-tab active" onclick="switchLoginTab('login')">Login</div>
          <div class="login-tab" onclick="switchLoginTab('signup')">Sign Up</div>
        </div>

        <!-- Login Form -->
        <form class="login-form" id="login-form" onsubmit="handleLogin(event)">
          <div class="input-group">
            <label for="login-email">Username</label>
            <input type="text" id="login-email" class="input-field" placeholder="Enter your username" required />
          </div>
          <div class="input-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" class="input-field" placeholder="Enter your password" required />
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-full" style="justify-content: center;">
            Sign In
          </button>
        </form>

        <!-- Signup Form -->
        <form class="login-form" id="signup-form" style="display: none;" onsubmit="handleSignup(event)">
          <div class="input-group">
            <label for="signup-name">Full Name</label>
            <input type="text" id="signup-name" class="input-field" placeholder="Your full name" required />
          </div>
          <div class="input-group">
            <label for="signup-email">Username</label>
            <input type="text" id="signup-email" class="input-field" placeholder="Enter your username" required />
          </div>
          <div class="input-group">
            <label for="signup-password">Password</label>
            <input type="password" id="signup-password" class="input-field" placeholder="Create a password" required minlength="6" />
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-full" style="justify-content: center;">
            Create Account
          </button>
        </form>
      </div>
    </div>
    ${renderBottomNav('')}
  `;
}

function switchLoginTab(tab) {
  const tabs = document.querySelectorAll('#login-tabs .login-tab');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  tabs.forEach(t => t.classList.remove('active'));
  
  if (tab === 'login') {
    tabs[0].classList.add('active');
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
  } else {
    tabs[1].classList.add('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';
  submitBtn.disabled = true;

  const result = await Auth.login(email, password);
  
  if (result.success) {
    showToast(`Welcome back, ${result.user.name}!`, 'success');
    Router.navigate(result.user.role === 'admin' ? '/admin' : '/account');
  } else {
    showToast(result.error, 'error');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Creating Account...';
  submitBtn.disabled = true;

  const result = await Auth.signup(name, email, password);
  
  if (result.success) {
    showToast(`Welcome, ${result.user.name}! Account created.`, 'success');
    Router.navigate('/account');
  } else {
    showToast(result.error, 'error');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}
