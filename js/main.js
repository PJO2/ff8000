document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("nav a[data-page]"); // Select only links with `data-page`
    const content = document.getElementById("content");
    const languageToggle = document.getElementById("language-toggle");

    let currentLanguage = "fr"; // Default language

    // Function to load and render a page dynamically
    function loadPage(page) {
        const folder = currentLanguage === "fr" ? "pages" : "pages_en";
        fetch(`${folder}/${page}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Page not found");
                }
                return response.text();
            })
            .then(html => {
                content.innerHTML = html;

                // Call renderPageContent after loading to handle dynamic rendering
                renderPageContent();
                
                // Update active link in the navigation
                updateActiveLink(page);
            })
            .catch(error => {
                content.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
            });
    }

    // Function to render dynamic content (like services, references, certifications)
    function renderPageContent() {
        const dataFile = `data/data_${currentLanguage}.json`;

        fetch(dataFile)
            .then(response => response.json())
            .then(data => {
                // Example: Dynamically load content for specific sections
                const offersContainer = document.getElementById("offers-container");
                if (offersContainer) {
                    offersContainer.innerHTML = ""; // Clear existing content
                    renderTiles(offersContainer, data.offers, "offer");                 
                }
                const domainsContainer = document.getElementById("domains-container");
                if (domainsContainer) {
                    domainsContainer.innerHTML = ""; // Clear existing content
                    renderTiles(domainsContainer, data.domains, "domain");                 
                }

                const certificationsContainer = document.getElementById("certifications-container");
                if (certificationsContainer) {
                    certificationsContainer.innerHTML = ""; // Clear existing content
                    renderTiles(certificationsContainer, data.certifications, "certification");
                }

                const referencesContainer = document.getElementById("references-container");
                if (referencesContainer) {
                    referencesContainer.innerHTML = ""; // Clear existing content
                    renderTiles(referencesContainer, data.references, "reference");
                }
            })
            .catch(error => console.error("Error loading dynamic content:", error));
    }

    // Helper function to render tiles dynamically
    function renderTiles(container, items, type) {
        items.forEach(item => {
            let tileHTML = "";
            if (type === "certification") {
                tileHTML = `
                    <div class="col-auto">
                        <div class="tile bg-light shadow p-3 rounded d-flex flex-column h-100">
                            <img src="${item.image}" style="margin-left: 75px; width: 150px; ${item.style || ''}">
                            <p class="mt-3">${item.name}</p>
                        </div>
                    </div>
                `;
            } else if (type === "reference") {
                tileHTML = `
                    <div class="col-auto">
                        <div class="tile bg-light shadow p-3 rounded d-flex flex-column h-100">
                            <img src="${item.image}" class="logo" alt="${item.alt}">
                            <p class="mt-3">${item.title}</p>
                            <div class="overlay-text">${item.description}</div>
                        </div>
                    </div>
                `;
            } else if (type === "offer") {
                tileHTML = `
                    <div class="col-auto">
                        <div class="tile bg-light shadow p-3 rounded d-flex flex-column h-100">
                            <img src="${item.image}" class="img50" alt="${item.alt}">
                            <p class="mt-3">${item.title}</p>
                            <div class="overlay-text">${item.description}</div>
                        </div>
                    </div>
                `;
            } else if (type === "domain") {
                tileHTML = `
                    <div class="col-auto">
                        <div class="tile bg-light shadow p-3 rounded d-flex flex-column h-100">
                            <img src="${item.image}" class="img80" alt="${item.alt}">
                            <p class="mt-3">${item.title}</p>
                            <div class="overlay-text">${item.description}</div>
                        </div>
                    </div>
                `;
        }
        container.innerHTML += tileHTML;
        });
    }

    // Update the active link in the navigation
    function updateActiveLink(page) {
        links.forEach(link => {
            const linkPage = link.getAttribute("data-page");
            if (linkPage === page) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    // Toggle language and reload current page content
    languageToggle.addEventListener("click", () => {
        currentLanguage = currentLanguage === "fr" ? "en" : "fr";
        languageToggle.innerHTML = currentLanguage === "fr" ? "<B>FR</B>-en" : "fr-<B>EN</b>";

        const activeLink = document.querySelector("nav a.active");
        const pageToLoad = activeLink ? activeLink.getAttribute("data-page") : "accueil.html";
        loadPage(pageToLoad);
    });

    // Event listener for navigation links
    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault(); // Prevent default link behavior
            const page = link.getAttribute("data-page");
            loadPage(page);
        });
    });

    // Load the default page when the site is first loaded
    loadPage("accueil.html");
});
