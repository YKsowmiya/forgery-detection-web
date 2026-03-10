document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById('submitBtn');
    const imageInput = document.getElementById('imageInput');
    const statusLabel = document.getElementById('statusLabel');
    const scoreLabel = document.getElementById('scoreLabel');
    const previewBox = document.getElementById("previewBox");

    // Image Preview logic
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewBox.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" style="max-width:100%; border-radius:8px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            previewBox.innerHTML = "<p>No image selected</p>";
        }
    });

    // Detect Button Logic with API Integration
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const file = imageInput.files[0];
        if (!file) {
            alert("Error: Please select an image file first.");
            return;
        }

        // Loading State
        statusLabel.innerText = "Analyzing Artifacts...";
        statusLabel.style.color = "white";
        scoreLabel.innerText = "Connecting to Server...";

        const formData = new FormData();
        formData.append("image", file);

        try {
            // API Fetch call to your Hugging Face Space
            const response = await fetch("https://praveenkumar17-forgery-detector.hf.space/detect", {
                method: "POST",
                body: formData,
                mode: 'cors',
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            // Result Display Logic
            if (data.status === 'Forged' || data.status === 'FORGED') {
                statusLabel.innerText = "FORGED / FAKE";
                statusLabel.style.color = "#ff4d4d"; // Red
                scoreLabel.innerText = `${data.confidence}% (Tampered)`;
            } else {
                statusLabel.innerText = "AUTHENTIC / REAL";
                statusLabel.style.color = "#2ecc71"; // Green
                scoreLabel.innerText = `${data.confidence}% (Original)`;
            }

        } catch (error) {
            console.error("Fetch error:", error);
            statusLabel.innerText = "ERROR";
            statusLabel.style.color = "#f39c12"; // Orange
            scoreLabel.innerText = "Connection failed. Is Space Running?";
        }
    });
});
