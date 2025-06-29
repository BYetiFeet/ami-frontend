async function sendMessage() {
  const role = document.getElementById("role").value;
  const message = document.getElementById("message").value;
  const user_id = "user_" + Date.now(); // Temporary unique ID

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

    // Optionally: store details to use during feedback
    window.lastAmiData = {
      user_id,
      role,
      message,
      reply: data.reply,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    responseBox.innerHTML = "<span style='color:red;'>Error contacting AMI. Please try again later.</span>";
    console.error("Error:", error);
  }
}

async function submitFeedback() {
  const score = document.getElementById("feedbackScore").value;
  const comment = document.getElementById("feedbackComment").value;

  if (!window.lastAmiData) {
    alert("Please send a message to AMI before submitting feedback.");
    return;
  }

  const payload = {
    mode: "feedback",
    timestamp: window.lastAmiData.timestamp,
    user_id: window.lastAmiData.user_id,
    role: window.lastAmiData.role,
    user_message: window.lastAmiData.message,
    ami_reply: window.lastAmiData.reply,
    feedback_score: score,
    feedback_comment: comment
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzrpW3Vj_Xz2UTsvlyI4B9fe1d3uIvMry5FI9DIUhTJfQFErVYxY659VYCBzu0xwh8i/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Thank you for your feedback!");
      document.getElementById("feedback").style.display = "none";
    } else {
      alert("Failed to send feedback.");
    }
  } catch (error) {
    console.error("Feedback error:", error);
    alert("An error occurred while sending feedback.");
  }
}
