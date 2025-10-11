import { RateMyProfessor } from "rate-my-professor-api-ts"

const CACHE_TTL = 24 * 60 * 60 * 1000;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getRating") {
        const professor = message.professor;

        // check chrome.storage.local cache
        chrome.storage.local.get([professor], async (result) => {
            const cached = result[professor];

            if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                console.log(`Cache hit for ${professor}`);
                sendResponse({ ratingData: cached.value });
                return;
            }

            try {
                console.log(`Fetching fresh data`);
                const rmp_instance = new RateMyProfessor("St. Edward's University", professor);
                const data = await rmp_instance.get_professor_info();

                const ratingData = {
                    rating: data?.avgRating?.toString() ?? "N/A",
                    difficulty: data?.avgDifficulty?.toString() ?? "N/A",
                    numRatings: data?.numRatings?.toString() ?? "N/A",
                    legacyID: data?.legacyId?.toString() ?? "N/A"
                };

                console.log("Fetched RMP data for", professor, data);

                // save to cache
                chrome.storage.local.set({
                    [professor]: {
                        value: ratingData,
                        timestamp: Date.now(),
                    }
                });

                console.log("Cache hit value:", cached.value);

                sendResponse({ ratingData });

            } catch (err) {
                console.error("RMP fetch failed:", err);
                sendResponse({
                    ratingData: {
                        rating: "N/A",
                        difficulty: "N/A",
                        numRatings: "N/A",
                        legacyID: "N/A"
                    },
                })
            }
        

        })

        return true;
    }
  }
)