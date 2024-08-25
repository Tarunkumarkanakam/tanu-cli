// // Function to generate a strong random password
// function generatePassword() {
//   const length = 16; // You can change this length as needed
//   const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
//   let password = "";
//   for (let i = 0, n = charset.length; i < length; ++i) {
//     password += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return password;
// }

// // Function to fetch credentials from the local Password Manager API
// async function fetchCredentialsForSite(siteUrl) {
//   const response = await fetch(`http://localhost:5000/passwords`);
//   if (response.ok) {
//     const passwords = await response.json();
//     return passwords.filter(credential => credential.site === siteUrl);
//   } else {
//     return []; // Return an empty array if no credentials are found
//   }
// }

// // Function to suggest saved credentials if found
// function suggestCredentials(credentials, inputField) {
//   const existingBox = document.querySelector(".password-suggestion-box");
//   if (existingBox) existingBox.remove();

//   const suggestionBox = document.createElement("div");
//   suggestionBox.className = "password-suggestion-box";

//   credentials.forEach((credential) => {
//     const suggestionItem = document.createElement("div");
//     suggestionItem.className = "suggestion-item";
//     suggestionItem.textContent = `${credential.username} ••••••••`; // Mask the password in the suggestion
//     suggestionItem.addEventListener("click", async () => {
//       // Fetch the full password using the credential ID
//       const fullCredential = await fetch(`http://localhost:5000/passwords/${credential.id}`);
//       const data = await fullCredential.json();

//       const usernameField = document.querySelector("input[type='text'], input[name='username'], input[name='email']");
//       if (usernameField) usernameField.value = data.username;
//       inputField.value = data.password;
//       suggestionBox.remove();
//     });
//     suggestionBox.appendChild(suggestionItem);
//   });

//   document.body.appendChild(suggestionBox);

//   const inputRect = inputField.getBoundingClientRect();
//   suggestionBox.style.top = `${window.scrollY + inputRect.bottom + 5}px`;
//   suggestionBox.style.left = `${window.scrollX + inputRect.left}px`;

//   function outsideClickListener(event) {
//     if (!suggestionBox.contains(event.target) && event.target !== inputField) {
//       suggestionBox.remove();
//       document.removeEventListener("click", outsideClickListener);
//     }
//   }

//   document.addEventListener("click", outsideClickListener);
// }

// // Function to suggest a strong password if no saved credentials are found
// function suggestPassword(inputField) {
//   const suggestedPassword = generatePassword();

//   const suggestionBox = document.createElement("div");
//   suggestionBox.className = "password-suggestion-box";
//   suggestionBox.innerHTML = `
//     <div class="password-text">${suggestedPassword}</div>
//     <button class="copy-password">Copy</button>
//   `;

//   document.body.appendChild(suggestionBox);

//   const inputRect = inputField.getBoundingClientRect();
//   suggestionBox.style.top = `${window.scrollY + inputRect.bottom + 5}px`;
//   suggestionBox.style.left = `${window.scrollX + inputRect.left}px`;

//   const copyButton = suggestionBox.querySelector(".copy-password");
//   copyButton.addEventListener("click", (event) => {
//     event.preventDefault();
//     navigator.clipboard.writeText(suggestedPassword);
//     inputField.value = suggestedPassword;
//     suggestionBox.remove();

//     // Monitor the login form submission to save the generated password
//     monitorLoginAndSavePassword(window.location.hostname, inputField.form, inputField, suggestedPassword);
//   });

//   function outsideClickListener(event) {
//     if (!suggestionBox.contains(event.target) && event.target !== inputField) {
//       suggestionBox.remove();
//       document.removeEventListener("click", outsideClickListener);
//     }
//   }

//   document.addEventListener("click", outsideClickListener);
// }

// // Function to monitor login form submission and save the password after successful login
// function monitorLoginAndSavePassword(siteUrl, form, passwordField, password) {
//   let originalAction = form.action || window.location.href;

//   form.addEventListener("submit", function () {
//     setTimeout(async function () {
//       if (window.location.href !== originalAction) {
//         const usernameField = form.querySelector("input[type='text'], input[name='username'], input[name='email']");
//         const username = usernameField ? usernameField.value : "";

//         // Send a POST request to the API to save the password
//         await fetch('http://localhost:5000/passwords', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             site: siteUrl,
//             username: username,
//             password: password
//           })
//         });

//         console.log('Password saved successfully.');
//       }
//     }, 2000); // Adjust the timeout based on the expected login time
//   });
// }

// // Main event listener to handle focus on password fields
// document.addEventListener("focus", async function (event) {
//   if (event.target.type === "password") {
//     const siteUrl = window.location.hostname;
//     const credentials = await fetchCredentialsForSite(siteUrl);

//     if (credentials.length > 0) {
//       suggestCredentials(credentials, event.target);
//     } else {
//       suggestPassword(event.target);
//     }
//   }
// }, true);
// Function to generate a strong random password
function generatePassword() {
  const length = 16; // You can change this length as needed
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

// Function to fetch credentials from the local Password Manager API
async function fetchCredentialsForSite(siteUrl) {
  try {
    const response = await fetch(`http://localhost:5000/passwords`);
    if (response.ok) {
      const passwords = await response.json();
      return passwords.filter(credential => credential.site === siteUrl);
    } else {
      console.error("Failed to fetch credentials:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return [];
  }
}

// Function to suggest saved credentials if found
function suggestCredentials(credentials, inputField) {
  const existingBox = document.querySelector(".password-suggestion-box");
  if (existingBox) existingBox.remove();

  const suggestionBox = document.createElement("div");
  suggestionBox.className = "password-suggestion-box";

  credentials.forEach((credential) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.className = "suggestion-item";
    suggestionItem.textContent = `${credential.username} ••••••••`; // Mask the password in the suggestion
    suggestionItem.addEventListener("click", async () => {
      // Fetch the full password using the credential ID
      const fullCredential = await fetch(`http://localhost:5000/passwords/${credential.id}`);
      const data = await fullCredential.json();

      const usernameField = document.querySelector("input[type='text'], input[name='username'], input[name='email']");
      if (usernameField) usernameField.value = data.username;
      inputField.value = data.password;
      suggestionBox.remove();
    });
    suggestionBox.appendChild(suggestionItem);
  });

  document.body.appendChild(suggestionBox);

  const inputRect = inputField.getBoundingClientRect();
  suggestionBox.style.top = `${window.scrollY + inputRect.bottom + 5}px`;
  suggestionBox.style.left = `${window.scrollX + inputRect.left}px`;

  function outsideClickListener(event) {
    if (!suggestionBox.contains(event.target) && event.target !== inputField) {
      suggestionBox.remove();
      document.removeEventListener("click", outsideClickListener);
    }
  }

  document.addEventListener("click", outsideClickListener);
}

// Function to suggest a strong password if no saved credentials are found
function suggestPassword(inputField) {
  const suggestedPassword = generatePassword();

  const suggestionBox = document.createElement("div");
  suggestionBox.className = "password-suggestion-box";
  suggestionBox.innerHTML = `
    <div class="password-text">${suggestedPassword}</div>
    <button class="copy-password">Copy</button>
  `;

  document.body.appendChild(suggestionBox);

  const inputRect = inputField.getBoundingClientRect();
  suggestionBox.style.top = `${window.scrollY + inputRect.bottom + 5}px`;
  suggestionBox.style.left = `${window.scrollX + inputRect.left}px`;

  const copyButton = suggestionBox.querySelector(".copy-password");
  copyButton.addEventListener("click", (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(suggestedPassword);
    inputField.value = suggestedPassword;
    suggestionBox.remove();

    // Monitor the login form submission to save the generated password
    monitorLoginAndSavePassword(window.location.hostname, inputField.form, inputField, suggestedPassword);
  });

  function outsideClickListener(event) {
    if (!suggestionBox.contains(event.target) && event.target !== inputField) {
      suggestionBox.remove();
      document.removeEventListener("click", outsideClickListener);
    }
  }

  document.addEventListener("click", outsideClickListener);
}

// Function to save the password when the form is submitted
function monitorLoginAndSavePassword(siteUrl, form, passwordField, password) {
  form.addEventListener("submit", async function (event) {
    const usernameField = form.querySelector("input[type='text'], input[name='username'], input[name='email']");
    const username = usernameField ? usernameField.value : "";

    console.log(`Attempting to save password for site: ${siteUrl}, username: ${username}`);

    // Send a POST request to the API to save the password
    try {
      const response = await fetch('http://localhost:5000/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site: siteUrl,
          username: username,
          password: password
        })
      });

      if (response.ok) {
        console.log('Password saved successfully.');
      } else {
        console.error('Failed to save password:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving password:', error);
    }
  });
}

// Main event listener to handle focus on password fields
document.addEventListener("focus", async function (event) {
  if (event.target.type === "password") {
    const siteUrl = window.location.hostname;
    const credentials = await fetchCredentialsForSite(siteUrl);

    if (credentials.length > 0) {
      suggestCredentials(credentials, event.target);
    } else {
      suggestPassword(event.target);
    }
  }
}, true);


// // Function to generate a strong random password
// function generatePassword() {
//   const length = 16; // You can change this length as needed
//   const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
//   let password = "";
//   for (let i = 0, n = charset.length; i < length; ++i) {
//     password += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return password;
// }

// // Function to fetch credentials from the local Password Manager API
// async function fetchCredentialsForSite(siteUrl) {
//   const response = await fetch(`http://localhost:5000/passwords`);
//   if (response.ok) {
//     const passwords = await response.json();
//     return passwords.filter(credential => credential.site === siteUrl);
//   } else {
//     return []; // Return an empty array if no credentials are found
//   }
// }

// // Function to suggest saved credentials if found
// function suggestCredentials(credentials, inputField) {
//   const existingBox = document.querySelector(".password-suggestion-box");
//   if (existingBox) existingBox.remove();

//   const suggestionBox = document.createElement("div");
//   suggestionBox.className = "password-suggestion-box";

//   credentials.forEach((credential) => {
//     const suggestionItem = document.createElement("div");
//     suggestionItem.className = "suggestion-item";
//     suggestionItem.textContent = `${credential.username} ••••••••`; // Mask the password in the suggestion
//     suggestionItem.addEventListener("click", async () => {
//       // Fetch the full password using the credential ID
//       const fullCredential = await fetch(`http://localhost:5000/passwords/${credential.id}`);
//       const data = await fullCredential.json();

//       const usernameField = document.querySelector("input[type='text'], input[name='username'], input[name='email']");
//       if (usernameField) usernameField.value = data.username;
//       inputField.value = data.password;
//       suggestionBox.remove();
//     });
//     suggestionBox.appendChild(suggestionItem);
//   });

//   document.body.appendChild(suggestionBox);

//   const inputRect = inputField.getBoundingClientRect();
//   suggestionBox.style.top = `${window.scrollY + inputRect.bottom + 5}px`;
//   suggestionBox.style.left = `${window.scrollX + inputRect.left}px`;

//   function outsideClickListener(event) {
//     if (!suggestionBox.contains(event.target) && event.target !== inputField) {
//       suggestionBox.remove();
//       document.removeEventListener("click", outsideClickListener);
//     }
//   }

//   document.addEventListener("click", outsideClickListener);
// }

// // Function to suggest a strong password if no saved credentials are found
// function suggestPassword(inputField) {
//   const suggestedPassword = generatePassword();

//   const suggestionBox = document.createElement("div");
//   suggestionBox.className = "password-suggestion-box";
//   suggestionBox.innerHTML = `
//     <div class="password-text">${suggestedPassword}</div>
//     <button class="copy-password">Copy</button>
//   `;

//   document.body.appendChild(suggestionBox);

//   const inputRect = inputField.getBoundingClientRect();
//   suggestionBox.style.top = `${window.scrollY + inputRect.bottom + 5}px`;
//   suggestionBox.style.left = `${window.scrollX + inputRect.left}px`;

//   const copyButton = suggestionBox.querySelector(".copy-password");
//   copyButton.addEventListener("click", (event) => {
//     event.preventDefault();
//     navigator.clipboard.writeText(suggestedPassword);
//     inputField.value = suggestedPassword;
//     suggestionBox.remove();
//   });

//   function outsideClickListener(event) {
//     if (!suggestionBox.contains(event.target) && event.target !== inputField) {
//       suggestionBox.remove();
//       document.removeEventListener("click", outsideClickListener);
//     }
//   }

//   document.addEventListener("click", outsideClickListener);
// }

// // Main event listener to handle focus on password fields
// document.addEventListener("focus", async function (event) {
//   if (event.target.type === "password") {
//     const siteUrl = window.location.hostname;
//     const credentials = await fetchCredentialsForSite(siteUrl);

//     if (credentials.length > 0) {
//       suggestCredentials(credentials, event.target);
//     } else {
//       suggestPassword(event.target);
//     }
//   }
// }, true);
