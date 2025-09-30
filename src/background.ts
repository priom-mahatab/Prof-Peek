import { RateMyProfessor } from "rate-my-professor-api-ts"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getRating") {
        (async () => {
            try {
                const rmp_instance = new RateMyProfessor("St. Edward's University", message.professor);
                const data = await rmp_instance.get_professor_info();

                sendResponse({
                    ratingData: {
                        rating: data?.avgRating?.toString() ?? "N/A",
                        difficulty: data?.avgDifficulty?.toString() ?? "N/A"
                    }
                });
            } catch (err) {
                console.error("RMP fetch failed", err);
                sendResponse({ ratingData: {rating: "N/A", difficulty: "N/A" }})
            }
        })();

        return true;
    }
  }
)