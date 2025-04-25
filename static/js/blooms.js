// static/js/blooms.js

// Sanity check
console.log("✅ blooms.js loaded, running on", window.location.pathname);

// ─── Data definitions ─────────────────────────────────────────────────────────
const bloomsData = [
    {
        name: "Roses",
        image: "rose.jpg",
        badge: { text: "Most Popular", class: "bg-danger" },
        meaning: "Love, respect, courage (varies by color)",
        occasions: ["Romantic occasions", "Anniversaries", "Weddings"]
    },
    {
        name: "Lilies",
        image: "lily.jpg",
        meaning: "Purity, rebirth, elegance",
        occasions: ["Sympathy arrangements", "Easter celebrations", "Weddings"]
    },
    {
        name: "Tulips",
        image: "tulip.jpg",
        meaning: "Perfect love, new beginnings",
        occasions: ["Spring celebrations", "Birthdays", "New home gifts"]
    },
    {
        name: "Sunflowers",
        image: "sunflower.jpg",
        meaning: "Adoration, loyalty, longevity",
        occasions: ["Summer celebrations", "Congratulations", "Friendship gestures"]
    },
    {
        name: "Daisies",
        image: "daisy.jpg",
        meaning: "Innocence, purity, loyal love",
        occasions: ["New baby arrangements", "Children's celebrations", "Cheerful get-well bouquets"]
    },
    {
        name: "Orchids",
        image: "orchid.jpg",
        badge: { text: "Elegant", class: "bg-info" },
        meaning: "Luxury, beauty, strength",
        occasions: ["Sophisticated gifts", "Housewarmings", "Business arrangements"]
    }
];

const occasionsData = [
    {
        title: "Weddings",
        icon: "bi-ring",
        description: "Traditional wedding flowers symbolize love, purity, and new beginnings:",
        flowers: ["Roses", "Peonies", "Lilies", "Stephanotis", "Hydrangeas"],
        images: ["wedding1.png", "wedding2.png"]
    },
    {
        title: "Sympathy",
        icon: "bi-heart",
        description: "Flowers for sympathy arrangements convey respect, remembrance, and comfort:",
        flowers: ["White Lilies", "Chrysanthemums", "Carnations", "Gladioli", "White Roses"],
        images: ["sympathy1.png", "sympathy2.png", "sympathy3.png"]
    },
    {
        title: "Birthdays",
        icon: "bi-gift",
        description: "Birthday flowers should be vibrant and celebratory, reflecting the recipient's personality:",
        flowers: ["Gerbera Daisies", "Sunflowers", "Tulips", "Carnations"],
        images: ["birthday1.png", "birthday2.png"]
    },
    {
        title: "Anniversaries",
        icon: "bi-calendar-heart",
        description: "Different wedding anniversaries have traditional flower associations:",
        flowers: ["1st: Carnations", "5th: Daisies", "10th: Daffodils", "25th: Iris", "50th: Yellow Roses"],
        images: ["anniversary1.png", "anniversary2.png", "anniversary3.png"]
    },
    {
        title: "Get Well",
        icon: "bi-heart-pulse",
        description: "These flowers bring cheer and hope during recovery:",
        flowers: ["Daisies", "Daffodils", "Peonies", "Gerberas", "Sunflowers"],
        images: ["getwell1.png", "getwell2.png"]
    },
    {
        title: "Congratulations",
        icon: "bi-trophy",
        description: "Celebratory arrangements to mark achievements and successes:",
        flowers: ["Stargazer Lilies", "Yellow Roses", "Sunflowers", "Iris", "Alstroemeria"],
        images: ["congratulations1.png", "congratulations2.png"]
    }
];

// ─── Render functions ──────────────────────────────────────────────────────────
function renderBloomCards() {
    console.log("🚀 renderBloomCards()");
    let html = "";
    bloomsData.forEach(b => {
        const badgeHtml = b.badge
            ? `<span class="bloom-badge badge ${b.badge.class}">${b.badge.text}</span>`
            : "";
        const occsHtml = b.occasions.map(o => `<li>${o}</li>`).join("");
        html += `
      <div class="col-md-4 mb-4">
        <div class="card bloom-card">
          <div class="bloom-img-container">
            <img src="/static/images/blooms/${b.image}" alt="${b.name}">
            ${badgeHtml}
          </div>
          <div class="card-body">
            <h5 class="bloom-title">${b.name}</h5>
            <p class="bloom-meaning">${b.meaning}</p>
            <ul class="bloom-occasions">${occsHtml}</ul>
          </div>
        </div>
      </div>`;
    });
    $("#bloom-cards-container").html(html);
}

function renderOccasionCards() {
    console.log("🚀 renderOccasionCards()");
    let html = "";
    occasionsData.forEach(o => {
        const flowersHtml = o.flowers.map(f => `<span class="flower-tag">${f}</span>`).join("");
        const imgsHtml = o.images
            .map(img => `<img src="/static/images/occasions/${img}" class="occasion-img me-2 mb-2">`)
            .join("");
        html += `
      <div class="col-md-4 mb-4">
        <div class="occasion-card">
          <span class="occasion-icon"><i class="bi ${o.icon}"></i></span>
          <h4 class="occasion-title">${o.title}</h4>
          <div class="occasion-images mb-3">${imgsHtml}</div>
          <p>${o.description}</p>
          <div>${flowersHtml}</div>
        </div>
      </div>`;
    });
    $("#occasion-cards-container").html(html);
}

// ─── Auto-invoke on DOMReady ──────────────────────────────────────────────────
$(document).ready(function () {
    const path = window.location.pathname;
    console.log("🔍 DOM ready", path);
    if (path === "/blooms" && $("#bloom-cards-container").length) {
        renderBloomCards();
    }
    if (path === "/occasions" && $("#occasion-cards-container").length) {
        renderOccasionCards();
    }
});
