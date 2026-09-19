/* ================= QUICK SYMPTOMS ================= */

function addSymptom(symptom) {

    const textarea =
        document.getElementById("symptoms");


    if (textarea.value.trim() === "") {

        textarea.value = symptom;

    } else {

        textarea.value += ", " + symptom;

    }


    textarea.focus();
}


async function analyzeSymptoms() {

    const symptoms =
        document
        .getElementById("symptoms")
        .value
        .trim();

    if (symptoms === "") {
        alert("Please describe your symptoms first.");
        return;
    }

    const resultSection =
        document.getElementById("resultSection");

    resultSection.style.display = "block";

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    // Show loading message
    resultSection.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <div>
                    <span class="result-badge">
                        ✦ AI HEALTH ASSESSMENT
                    </span>

                    <h2>Analyzing your symptoms...</h2>

                    <p>
                        MediSense AI is carefully reviewing
                        the symptoms you provided.
                    </p>
                </div>

                <div class="result-icon">✦</div>
            </div>
        </div>
    `;

    try {

        const response = await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                symptoms: symptoms
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        displayResult(data);

    } catch (error) {

        console.error(error);

        resultSection.innerHTML = `
            <div class="result-card">

                <h2>Something went wrong</h2>

                <p>
                    We couldn't analyze your symptoms
                    right now. Please try again.
                </p>

                <button
                    class="again-btn"
                    onclick="analyzeAgain()">
                    ← Try again
                </button>

            </div>
        `;
    }
}



/* ================= ABOUT MODAL ================= */

function openAbout() {

    document
        .getElementById("aboutModal")
        .style.display = "flex";

}


function closeAbout() {

    document
        .getElementById("aboutModal")
        .style.display = "none";

}



/* ================= CLOSE MODAL ================= */

window.onclick = function(event) {

    const modal =
        document.getElementById("aboutModal");


    if (event.target === modal) {

        closeAbout();

    }

};


function analyzeAgain() {

    document
        .getElementById("symptoms")
        .value = "";


    document
        .getElementById("resultSection")
        .style.display = "none";


    document
        .getElementById("symptoms")
        .focus();

}

function displayResult(data) {

    const resultSection =
        document.getElementById("resultSection");

    let conditionsHTML = "";

    data.possibleConditions.forEach(function(condition) {

        conditionsHTML += `
            <div class="condition">

                <div>
                    <strong>${condition.name}</strong>

                    <p>
                        ${condition.reason}
                    </p>
                </div>

                <small>
                    ${condition.likelihood}
                </small>

            </div>
        `;

    });


    let missingHTML = "";

    data.missingInformation.forEach(function(item) {

        missingHTML += `<li>${item}</li>`;

    });


    let selfCareHTML = "";

    data.selfCare.forEach(function(item) {

        selfCareHTML += `<li>${item}</li>`;

    });


    let warningHTML = "";

    data.warningSigns.forEach(function(item) {

        warningHTML += `<li>${item}</li>`;

    });


    resultSection.innerHTML = `

        <div class="result-card">

            <div class="result-header">

                <div>

                    <span class="result-badge">
                        ✦ AI HEALTH ASSESSMENT
                    </span>

                    <h2>
                        Here's what MediSense found
                    </h2>

                    <p>
                        This assessment is based on
                        the symptoms you provided.
                    </p>

                </div>

                <div class="result-icon">
                    ♡
                </div>

            </div>


            <div class="result-block">

                <h3>
                    🩺 Possible conditions
                </h3>

                <div class="condition-list">

                    ${conditionsHTML}

                </div>

            </div>


            <div class="result-block">

                <h3>
                    🔎 Information that may help
                </h3>

                <ul>
                    ${missingHTML}
                </ul>

            </div>


            <div class="result-block">

                <h3>
                    💡 What you can do
                </h3>

                <ul>
                    ${selfCareHTML}
                </ul>

            </div>


            <div class="medical-help">

                <h3>
                    ⚠️ When to seek medical help
                </h3>

                <ul>
                    ${warningHTML}
                </ul>

            </div>


            <div class="result-disclaimer">

                <strong>
                    Urgency: ${data.urgency}
                </strong>

                <br><br>

                MediSense provides AI-generated health
                information and does not replace a
                qualified healthcare professional.

            </div>


            <button
                class="again-btn"
                onclick="analyzeAgain()">

                ← Analyze another symptom

            </button>

        </div>
    `;
}