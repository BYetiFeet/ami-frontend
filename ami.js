function submitFeedback() {
  const score = document.getElementById("feedbackScore").value;
  const comment = document.getElementById("feedbackComment").value;
  const user_id = "user_" + Date.now();  // Optional — use stored ID if you have it
  const timestamp = new Date().toISOString();

  fetch("https://script.google.com/macros/s/AKfycbzrpW3Vj_Xz2UTsvlyI4B9fe1d3uIvMry5FI9DIUhTJfQFErVYxY659VYCBzu0xwh8i/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "feedback",
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
      alert("Feedback failed to send.");
    }
  })
  .catch(error => {
    console.error("Feedback error:", error);
    alert("An error occurred.");
  });
}
