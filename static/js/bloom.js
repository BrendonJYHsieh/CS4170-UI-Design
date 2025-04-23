$(document).ready(function () {

    // Bloom Card Data
    const bloomsData = [
        {
            name: "Roses",
            image: "rose.jpg",
            badge: {
                text: "Most Popular",
                class: "bg-danger"
            },
            meaning: "Love, respect, courage (varies by color)",
            occasions: [
                "Romantic occasions",
                "Anniversaries",
                "Weddings"
            ]
        },
        {
            name: "Lilies",
            image: "lily.jpg",
            meaning: "Purity, rebirth, elegance",
            occasions: [
                "Sympathy arrangements",
                "Easter celebrations",
                "Weddings"
            ]
        },
        {
            name: "Tulips",
            image: "tulip.jpg",
            meaning: "Perfect love, new beginnings",
            occasions: [
                "Spring celebrations",
                "Birthdays",
                "New home gifts"
            ]
        },
        {
            name: "Sunflowers",
            image: "sunflower.jpg",
            meaning: "Adoration, loyalty, longevity",
            occasions: [
                "Summer celebrations",
                "Congratulations",
                "Friendship gestures"
            ]
        },
        {
            name: "Daisies",
            image: "daisy.jpg",
            meaning: "Innocence, purity, loyal love",
            occasions: [
                "New baby arrangements",
                "Children's celebrations",
                "Cheerful get-well bouquets"
            ]
        },
        {
            name: "Orchids",
            image: "orchid.jpg",
            badge: {
                text: "Elegant",
                class: "bg-info"
            },
            meaning: "Luxury, beauty, strength",
            occasions: [
                "Sophisticated gifts",
                "Housewarmings",
                "Business arrangements"
            ]
        }
    ];

    // Occasion Card Data
    const occasionsData = [
        {
            title: "Weddings",
            icon: "bi-ring",
            description: "Traditional wedding flowers symbolize love, purity, and new beginnings:",
            flowers: ["Roses", "Peonies", "Lilies", "Stephanotis", "Hydrangeas"]
        },
        {
            title: "Sympathy",
            icon: "bi-heart",
            description: "Flowers for sympathy arrangements convey respect, remembrance, and comfort:",
            flowers: ["White Lilies", "Chrysanthemums", "Carnations", "Gladioli", "White Roses"]
        },
        {
            title: "Birthdays",
            icon: "bi-gift",
            description: "Birthday flowers should be vibrant and celebratory, reflecting the recipient's personality:",
            flowers: ["Gerbera Daisies", "Sunflowers", "Tulips", "Carnations", "Birthday Month Flower"]
        },
        {
            title: "Anniversaries",
            icon: "bi-calendar-heart",
            description: "Different wedding anniversaries have traditional flower associations:",
            flowers: ["1st: Carnations", "5th: Daisies", "10th: Daffodils", "25th: Iris", "50th: Yellow Roses"]
        },
        {
            title: "Get Well",
            icon: "bi-heart-pulse",
            description: "These flowers bring cheer and hope during recovery:",
            flowers: ["Daisies", "Daffodils", "Peonies", "Gerberas", "Sunflowers"]
        },
        {
            title: "Congratulations",
            icon: "bi-trophy",
            description: "Celebratory arrangements to mark achievements and successes:",
            flowers: ["Stargazer Lilies", "Yellow Roses", "Sunflowers", "Iris", "Alstroemeria"]
        }
    ];

    // Quiz Data
    const quizData = [
        {
            question: "Which flower symbolizes purity and rebirth?",
            options: ["Rose", "Lily", "Daisy", "Tulip"],
            answer: 1
        },
        {
            question: "What flowers are traditionally associated with 50th wedding anniversaries?",
            options: ["Red Roses", "Daisies", "Yellow Roses", "Orchids"],
            answer: 2
        },
        {
            question: "Which flower is most appropriate for sympathy arrangements?",
            options: ["Sunflowers", "White Lilies", "Gerbera Daisies", "Tulips"],
            answer: 1
        },
        {
            question: "What do sunflowers primarily symbolize?",
            options: ["Grief", "Adoration and loyalty", "Purity", "Wealth"],
            answer: 1
        }
    ];

    // Render Bloom Cards
    function renderBloomCards() {
        let html = '';

        bloomsData.forEach(bloom => {
            let badgeHtml = bloom.badge ?
                `<span class="bloom-badge badge ${bloom.badge.class}">${bloom.badge.text}</span>` : '';

            let occasionsHtml = bloom.occasions.map(occ => `<li>${occ}</li>`).join('');

            html += `
            <div class="col-md-4 mb-4">
                <div class="card bloom-card">
                    <div class="bloom-img-container">
                        <img src="/static/images/blooms/${bloom.image}" alt="${bloom.name}">
                        ${badgeHtml}
                    </div>
                    <div class="card-body">
                        <h5 class="bloom-title">${bloom.name}</h5>
                        <p class="bloom-meaning">${bloom.meaning}</p>
                        <div class="bloom-occasions">
                            <strong>Perfect for:</strong>
                            <ul>${occasionsHtml}</ul>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        $('#bloom-cards-container').html(html);
    }

    // Render Occasion Cards
    function renderOccasionCards() {
        let html = '';

        occasionsData.forEach(occasion => {
            let flowersHtml = occasion.flowers.map(flower =>
                `<span class="flower-tag">${flower}</span>`).join('');

            html += `
            <div class="col-md-4 mb-4">
                <div class="occasion-card">
                    <span class="occasion-icon"><i class="bi ${occasion.icon}"></i></span>
                    <h4 class="occasion-title">${occasion.title}</h4>
                    <p>${occasion.description}</p>
                    <div>${flowersHtml}</div>
                </div>
            </div>`;
        });

        $('#occasion-cards-container').html(html);
    }

    // Render Quiz
    function renderQuiz() {
        let html = `<div class="bloom-quiz">`;

        quizData.forEach((q, qi) => {
            let optionsHtml = '';

            q.options.forEach((opt, oi) => {
                optionsHtml += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="q${qi}" id="q${qi}o${oi}" value="${oi}">
                    <label class="form-check-label" for="q${qi}o${oi}">${opt}</label>
                </div>`;
            });

            html += `
            <div class="quiz-question">
                <p><strong>Q${qi + 1}. ${q.question}</strong></p>
                ${optionsHtml}
                <div class="feedback" id="feedback-q${qi}"></div>
            </div>`;
        });

        html += `</div>`;

        $('#bloom-quiz-container').html(html);
    }

    // Check Quiz Answers
    $('#check-answers-btn').on('click', function () {
        let correctCount = 0;
        let allAnswered = true;

        quizData.forEach((q, qi) => {
            const selected = $(`input[name="q${qi}"]:checked`).val();

            if (selected === undefined) {
                allAnswered = false;
                return;
            }

            const isCorrect = parseInt(selected) === q.answer;

            if (isCorrect) {
                correctCount++;
                $(`#feedback-q${qi}`).html('<span class="feedback-correct"><i class="bi bi-check-circle"></i> Correct!</span>');
            } else {
                $(`#feedback-q${qi}`).html('<span class="feedback-incorrect"><i class="bi bi-x-circle"></i> Incorrect. Try again.</span>');
            }
        });

        if (!allAnswered) {
            alert('Please answer all questions.');
            return;
        }

        const score = Math.round((correctCount / quizData.length) * 100);

        if (score >= 75) {
            $('#quiz-result').html(`
                <div class="alert alert-success">
                    Score: ${correctCount}/${quizData.length} (${score}%)
                    <p>Great job! You're ready to move on to arrangement techniques.</p>
                </div>
            `);

            $('#next-lesson-btn').show();
            $(this).hide();
        } else {
            $('#quiz-result').html(`
                <div class="alert alert-warning">
                    Score: ${correctCount}/${quizData.length} (${score}%)
                    <p>Review the material and try again.</p>
                </div>
            `);
        }
    });

    // Card Hover Effects
    $(document).on('mouseenter', '.bloom-card', function () {
        $(this).find('.bloom-img-container img').css('transform', 'scale(1.1)');
    }).on('mouseleave', '.bloom-card', function () {
        $(this).find('.bloom-img-container img').css('transform', 'scale(1)');
    });

    // Initialize
    renderBloomCards();
    renderOccasionCards();
    renderQuiz();
});