async function sendMessage() {
  const role = document.getElementById("role").value;
  const message = document.getElementById("message").value;
  const user_id = "user_" + Date.now();  // Temporary unique ID

  if (!message.trim()) {
    alert("Please enter a message.");
    return;
  }

  // Show loading
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
function startVoiceInput() {
  const voiceStatus = document.getElementById("voice-status");
  voiceStatus.innerText = "Listening...";

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice input not supported in this browser.");
    voiceStatus.innerText = "";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-GB';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("message").value = transcript;
    voiceStatus.innerText = "✔️ Captured: " + transcript;
  };

  recognition.onerror = function(event) {
    console.error("Speech recognition error:", event.error);
    voiceStatus.innerText = "❌ Error: " + event.error;
  };

  recognition.onend = function() {
    if (voiceStatus.innerText === "Listening...") {
      voiceStatus.innerText = "❌ No speech detected";
    }
  };

  recognition.start();
}

async function submitFeedback() {

  const score = document.getElementById("feedbackScore").value;
  const comment = document.getElementById("feedbackComment").value;
  alert("Thank you for your feedback!");

  // Optionally send this to a backend endpoint or log it locally
}
