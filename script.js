document.addEventListener('DOMContentLoaded', () => {
    // Large master bank of brain teasers & lateral thinking puzzles
    const masterRiddles = [
        {
            question: "A doctor is walking down the road with a boy. While the boy is the doctor's son, the doctor is not the boy's father. Who is the doctor to the boy?",
            clue: "Pay close attention to titles and unspoken professional assumptions.",
            acceptedKeywords: ["mother", "mom", "mum"],
            explanation: "The doctor is the boy's mother!"
        },
        {
            question: "The more of this there is, the less you see. What is it?",
            clue: "Consider what happens to light when it ceases to exist in a space.",
            acceptedKeywords: ["darkness", "dark"],
            explanation: "Darkness—the more darkness surrounds you, the less you can see."
        },
        {
            question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
            clue: "It repeats your exact words back to you, but it has no voice of its own.",
            acceptedKeywords: ["echo"],
            explanation: "An echo bounces sound waves back without having a physical body."
        },
        {
            question: "A man pushes his car to a hotel and immediately tells the owner he is bankrupt. Why?",
            clue: "The journey wasn't on a highway, and the hotel wasn't real estate in the physical world.",
            acceptedKeywords: ["monopoly"],
            explanation: "He is playing Monopoly and landed on a property with a hotel he couldn't afford!"
        },
        {
            question: "What has keys that open no locks, space without room, and allows you to enter without going inside?",
            clue: "Look right down at your hands while typing code or text.",
            acceptedKeywords: ["keyboard"],
            explanation: "A computer keyboard has keys, a Space bar, and an Enter key."
        },
        {
            question: "Two fathers and two sons go fishing together. Each of them catches one fish, yet they only bring home three fish in total. How is that possible?",
            clue: "One man in the family tree wears multiple hats across generations.",
            acceptedKeywords: ["grandfather", "three people", "3 people", "generations"],
            explanation: "There are only three people: a grandfather, his son (who is also a father), and his grandson."
        },
        {
            question: "What belongs to you, yet everyone else uses it far more than you do?",
            clue: "It’s uniquely yours, yet you are almost the last person who needs to say it out loud.",
            acceptedKeywords: ["name"],
            explanation: "Your name belongs to you, but other people say it constantly when addressing you."
        },
        {
            question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
            clue: "Travelers and navigators use me to plan routes across the globe.",
            acceptedKeywords: ["map"],
            explanation: "A map represents cities, mountains, and oceans visually without physical objects."
        },
        {
            question: "What has to be broken before you can use it?",
            clue: "Think about breakfast preparations in the morning kitchen.",
            acceptedKeywords: ["egg", "eggs"],
            explanation: "An egg must be cracked open before you can cook or use it."
        },
        {
            question: "I am full of holes, yet I still hold water. What am I?",
            clue: "You might use me to clean dishes or wash a dusty car surface.",
            acceptedKeywords: ["sponge"],
            explanation: "A sponge has porous microscopic cavities that absorb and hold liquid."
        },
        {
            question: "What gets wetter the more it dries?",
            clue: "You reach for it right after stepping out of a refreshing shower.",
            acceptedKeywords: ["towel"],
            explanation: "A towel absorbs moisture, getting wetter as it dries your skin."
        },
        {
            question: "If you're running in a race and you pass the person in second place, what place are you in?",
            clue: "Think carefully about whose exact position you just took over.",
            acceptedKeywords: ["second", "2nd"],
            explanation: "You are in second place because you took over the person who was in second!"
        },
        {
            question: "What building has the most stories?",
            clue: "It doesn't have elevators or residential apartments, but it holds millions of tales.",
            acceptedKeywords: ["library"],
            explanation: "A library contains thousands of books, and every book is filled with stories."
        },
        {
            question: "What has a head and a tail but no body?",
            clue: "Flip it high in the air to make a quick decision between two options.",
            acceptedKeywords: ["coin", "penny", "quarter", "nickel", "dime"],
            explanation: "A coin has a 'heads' side and a 'tails' side, but no torso."
        },
        {
            question: "What goes up and down, but never moves?",
            clue: "It connects floors in a multi-story building without ever taking a single step.",
            acceptedKeywords: ["stairs", "staircase"],
            explanation: "Stairs stay fixed in place while people walk up and down them."
        }
    ];

    let sessionRiddles = [];
    let currentIndex = 0;
    let score = 0;
    let isTransitioning = false;

    const riddleText = document.getElementById('riddle-text');
    const clueBox = document.getElementById('clue-box');
    const clueText = document.getElementById('clue-text');
    const feedbackLog = document.getElementById('feedback-log');
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('answer-input');
    const questionProgress = document.getElementById('question-progress');
    const scoreDisplay = document.getElementById('score-display');
    const clueBtn = document.getElementById('clue-btn');
    const skipBtn = document.getElementById('skip-btn');
    const helperControls = document.getElementById('helper-controls');
    const actionContainer = document.getElementById('action-container');
    const restartBtn = document.getElementById('restart-btn');

    // Shuffle master bank and pick a fresh set of 10 for the session
    function getFreshSessionRiddles() {
        const shuffled = [...masterRiddles];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        // Take 10 nodes for this session (or total if less than 10)
        return shuffled.slice(0, 10);
    }

    function initGame() {
        sessionRiddles = getFreshSessionRiddles();
        currentIndex = 0;
        score = 0;
        isTransitioning = false;
        scoreDisplay.textContent = score;
        answerForm.classList.remove('hidden');
        helperControls.classList.remove('hidden');
        actionContainer.classList.add('hidden');
        loadRiddle();
    }

    function loadRiddle() {
        isTransitioning = false;
        const current = sessionRiddles[currentIndex];
        questionProgress.textContent = `${currentIndex + 1} / ${sessionRiddles.length}`;
        riddleText.textContent = current.question;
        clueText.textContent = current.clue;
        clueBox.classList.add('hidden');
        clueBtn.disabled = false;
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();
        setFeedback('system-msg', '> Analyze the prompt carefully. Request a clue only if truly stuck.');
    }

    function setFeedback(className, message) {
        feedbackLog.innerHTML = `<div class="log-entry ${className}">${message}</div>`;
    }

    answerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isTransitioning) return;

        const userGuess = answerInput.value.trim().toLowerCase();
        if (!userGuess) return;

        const current = sessionRiddles[currentIndex];
        const isCorrect = current.acceptedKeywords.some(keyword => userGuess.includes(keyword));

        if (isCorrect) {
            score++;
            scoreDisplay.textContent = score;
            setFeedback('success-msg', `> CORRECT! ${current.explanation} Loading next node...`);
            advanceAfterDelay(5500); // 5.5s to read explanation
        } else {
            setFeedback('error-msg', `> ACCESS DENIED: "${answerInput.value.trim()}" is not correct. Think deeper!`);
            answerInput.value = '';
            answerInput.focus();
        }
    });

    clueBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        clueBox.classList.remove('hidden');
        clueBtn.disabled = true;
        answerInput.focus();
    });

    skipBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        const current = sessionRiddles[currentIndex];
        setFeedback('system-msg', `> NODE SKIPPED. Solution: ${current.explanation}`);
        advanceAfterDelay(5000); // 5s to read skipped solution
    });

    function advanceAfterDelay(delay) {
        isTransitioning = true;
        answerInput.disabled = true;
        setTimeout(() => {
            currentIndex++;
            if (currentIndex < sessionRiddles.length) {
                loadRiddle();
            } else {
                endSession();
            }
        }, delay);
    }

    function endSession() {
        riddleText.textContent = `SESSION COMPLETE — You cracked ${score} out of ${sessionRiddles.length} cognitive challenges!`;
        clueBox.classList.add('hidden');
        answerForm.classList.add('hidden');
        helperControls.classList.add('hidden');
        actionContainer.classList.remove('hidden');
        setFeedback('success-msg', '> All nodes processed. Click reboot to initialize a fresh set of riddles.');
    }

    restartBtn.addEventListener('click', initGame);

    initGame();
});