console.log("RMP Extension loaded, St. Edward's University");

// create function for formatting name
function formatName(rawName: string): string {
    const parts = rawName.split(",");
    if (parts.length === 2) {
        const last = parts[0].trim();
        const first = parts[1].trim();

        if (first.split(" ").length >= 2) {
            const shortFirst = first.split(" ")[0].trim()
            return `${shortFirst} ${last}`;
        }
        return `${first} ${last}`;
    }

    return rawName.trim();
}

interface RatingData {
    rating: string;
    difficulty: string;
    numRatings: string;
    legacyId: string;
}

// function for injecting rating add a class and then add text and styling
function injectRating(link: HTMLAnchorElement, rating: string, difficulty: string, numRatings: string, legacyID: string): void {

    const professorUrl = legacyID !== "N/A" 
    ? `https://www.ratemyprofessors.com/professor/${legacyID}`
    : null;
    const badge = document.createElement("span");
    badge.style.display = "inline-block";
    badge.classList.add("rmp-badge");
    badge.style.marginLeft = "12px";
    badge.style.padding = "2px 6px";
    // badge.style.background = "#f0f0f0";
    badge.style.borderRadius = "6px";
    badge.style.fontSize = "12px";
    badge.style.color = "#333";

    badge.innerHTML = `
        <div><strong>Rating:</strong> ${rating} | <strong>Difficulty:</strong> ${difficulty}</div>
        <div><strong>Number of Ratings:</strong> ${numRatings}</div>
        <a href=${professorUrl} target="_blank" style="
            color: #0066cc;
            text-decoration: none;
            display: block;
            margin-top: 4px;
        ">View on RateMyProfessors</a>
    `;

    link.insertAdjacentElement("afterend", badge);
}

// function for extracting info from course catalogue
function extractAndDisplayInstructors(): void {
    const instructorCells = document.querySelectorAll<HTMLAnchorElement>("td[data-property='instructor'] a.email");
    instructorCells.forEach(link => {

        if (link.hasAttribute('data-rmp-processed')) {
            return;
        }

        const rawName = link.textContent.trim() || "";
        if (!rawName || rawName.includes('@')) {
            return;
        }
        link.setAttribute('data-rmp-processed', 'true');
        const formattedName = formatName(rawName);
        // const [firstName, lastName] = formattedName.split(" ");
        console.log("Instructor", formattedName);


        chrome.runtime.sendMessage(
            { action: "getRating", professor: formattedName },
            (response) => {
                if (response && response.ratingData) {
                    if (response.ratingData.rating === "0" && response.ratingData.difficulty === "0") {
                        response.ratingData.rating = "N/A"
                        response.ratingData.difficulty = "N/A"
                        response.ratingData.numRatings = "N/A"
                        response.ratingData.legacyID = "N/A"
                    }
                    injectRating(link, response.ratingData.rating, response.ratingData.difficulty, response.ratingData.numRatings, response.ratingData.legacyID);
                } else {
                    console.warn("No data found for", formattedName);
                    injectRating(link, "N/A", "N/A", "N/A", "N/A");
                }
            }
        )
    }
  );
}

extractAndDisplayInstructors();

// observer for looking for updates in the DOM
const observer = new MutationObserver(() => extractAndDisplayInstructors());
observer.observe(document.body, {childList: true, subtree: true});