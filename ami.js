async function sendMessage() {
  const role = document.getElementById("role").value;
  const message = document.getElementById("message").value;
  const user_id = "user_" + Date.now();  // Temporary unique ID

  if (!message.trim()) {
    alert("Please enter a message.");
    return;
  }

  const responseBox = document.getElementById("response");
  responseBox.innerHTML = "<em>Thinking...</em>";

  try {
    const response = await fetch("https://ami-assistant-backend.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, role, user_id })
    });

    const data = await response.json();
    responseBox.innerText = data.reply || "No response received.";
    document.getElementById("feedback").style.display = "block";
  } catch (error) {
    responseBox.innerHTML = "<span style='color:red;'>Error contacting AMI. Please try again later.</span>";
    console.error("Error:", error);
  }
}

function submitFeedback() {
  const score = document.getElementById("feedbackScore").value;
  const comment = document.getElementById("feedbackComment").value;
  const timestamp = new Date().toISOString();
  const user_id = "user_" + Date.now();  // Or match with original user_id if needed

  fetch("https://script.google.com/macros/s/AKfycbzrpW3Vj_Xz2UTsvlyI4B9fe1d3uIvMry5FI9DIUhTJfQFErVYxY659VYCBzu0xwh8i/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timestamp: timestamp,
      user_id: user_id,
      feedback_score: score,
      feedback_comment: comment
    }),
  })
  .then(response => {
    if (response.ok) {
      alert("Thank you for your feedback!");
    } else {
      alert("Feedback submission failed.");
    }
  })
  .catch(error => {
    console.error("Feedback error:", error);
    alert("There was an error sending feedback.");
  });
}
