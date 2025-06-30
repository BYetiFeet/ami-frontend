// 1. Main message sending logic
async function sendMessage() {
  const role = document.getElementById("role").value;
  const message = document.getElementById("message").value;
  const user_id = "user_" + Date.now();
  const timestamp = new Date().toISOString();

  if (!message.trim()) {
    alert("Please enter a message.");
    return;
  }

  const responseBox = document.getElementById("response");
  responseBox.innerHTML = "<em>Thinking...</em>";

  try {
    // Send message to AMI backend
    const response = await fetch("https://ami-assistant-backend.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, role, user_id })
    });

    const data = await response.json();
    const reply = data.reply || "No response received.";
    responseBox.innerText = reply;
    document.getElementById("feedback").style.display = "block";

    // Save data for feedback use
    window.lastAmiData = { user_id, role, message, reply, timestamp };

    // 2. Send log to proxy backend (Render endpoint)
    await fetch("https://ami-assistant-backend.onrender-1.com/log-to-sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "log",
        timestamp,
        user_id,
        role,
        user_message: message,
        ami_reply: reply
      })
    });

  } catch (error) {
    responseBox.innerHTML = "<span style='color:red;'>Error contacting AMI. Please try again later.</span>";
    console.error("Error:", error);
  }
}

// 3. Feedback submission logic
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
    feedback_score: score,
    feedback_comment: comment
  };

  try {
    // Send feedback directly to Google Apps Script endpoint
    const response = await fetch("https://script.google.com/macros/s/AKfycbxNt4pS-U-jcpTV3UuI-ROsVEIs2Y2XDsqcFsKCsMWk8_Ov1yTDPZb_JKNCXZvGqReD/exec", {
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
