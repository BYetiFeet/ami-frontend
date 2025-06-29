async function sendMessage() {
  const role = document.getElementById("role").value;
  const message = document.getElementById("message").value;
  const user_id = "user_" + Date.now();  // Temporary ID

  const response = await fetch("https://your-ami-backend.onrender.com/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, role, user_id })
  });

  const data = await response.json();
  document.getElementById("response").innerText = data.reply;
  document.getElementById("feedback").style.display = "block";
}

async function submitFeedback() {
  const score = document.getElementById("feedbackScore").value;
  const comment = document.getElementById("feedbackComment").value;
  alert("Thank you for your feedback!");
}