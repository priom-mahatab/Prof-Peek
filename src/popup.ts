document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-rmp") as HTMLButtonElement | null;
    if (!searchButton) return;

    searchButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://www.ratemyprofessors.com/" });
    });
});