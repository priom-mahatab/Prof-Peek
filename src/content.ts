console.log("RMP Extension loaded, St. Edward's University");

// create function for formatting name
function formatName(rawName: string): string {
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

interface RatingData {
    rating: string;
    difficulty: string;
}

// function for injecting rating add a class and then add text and styling
function injectRating(link: HTMLAnchorElement, rating: string, difficulty: string): void {
    const badge = document.createElement("span");
    badge.textContent = `Rating: ${rating} | Difficulty: ${difficulty}`;
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
                    injectRating(link, response.ratingData.rating, response.ratingData.difficulty);
                } else {
                    injectRating(link, "N/A", "N/A");
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


