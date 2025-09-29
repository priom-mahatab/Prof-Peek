console.log("RMP Extension loaded, St. Edward's University");

// create function for formatting name
function formatName(rawName) {
    const parts = rawName.split(",");
    if (parts.length === 2) {
        const last = parts[0].trim();
        const first = parts[1].trim();

        if (first.split(" ").length === 2) {
            const shortFirst = first.split(" ")[0].trim()
            return `${shortFirst} ${last}`;
        }
        return `${first} ${last}`;
    }

    return rawName.trim();
}

// function for injecting rating add a class and then add text and styling
function injectRating(link, ratingData) {
    const badge = document.createElement("span");
    badge.textContent = `Rating: ${ratingData.rating} | Difficulty: ${ratingData.difficulty}`;
    badge.classList.add("rmp-badge");
    badge.style.marginLeft = "8px";
    badge.style.padding = "2px 6px";
    badge.style.background = "#f0f0f0";
    badge.style.borderRadius = "6px";
    badge.style.fontSize = "12px";
    badge.style.color = "#333";

    link.insertAdjacentElement("afterend", badge);
}

// function for extracting info from course catalogue
function extractAndDisplayInstructors() {
    const instructorCells = document.querySelectorAll("td[data-property='instructor'] a.email");
    instructorCells.forEach(link => {
        const rawName = link.textContent.trim();
        const formattedName = formatName(rawName);
        const [firstName, lastName] = formattedName.split(" ");
        console.log("Instructor", formattedName);

        const fakeData = {
            rating: "4.2",
            difficulty: "3.6"
        }

        if (!link.nextSibling || !link.nextSibling.classList?.contains("rmp-badge")) {
            injectRating(link, fakeData);
        }
    }
  );
}

extractAndDisplayInstructors();

// observer for looking for updates in the DOM
const observer = new MutationObserver(() => extractAndDisplayInstructors());
observer.observe(document.body, {childList: true, subtree: true});


