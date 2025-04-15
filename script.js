document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const flashcardsContainer = document.getElementById('flashcards-container');
    const termInput = document.getElementById('term');
    const definitionInput = document.getElementById('definition');
    const addCardBtn = document.getElementById('add-card');
    const showFormBtn = document.getElementById('show-form');
    const cancelFormBtn = document.getElementById('cancel-form');
    const formContainer = document.getElementById('form-container');
    const cardCountElement = document.getElementById('card-count');
    const streakCountElement = document.getElementById('streak-count');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Load flashcards from localStorage
    loadFlashcards();
    
    // Initialize theme
    initTheme();
    
    // Event Listeners
    addCardBtn.addEventListener('click', addFlashcard);
    showFormBtn.addEventListener('click', showForm);
    cancelFormBtn.addEventListener('click', hideForm);
    themeToggle.addEventListener('change', toggleTheme);
    
    // Functions
    function showForm() {
        formContainer.style.display = 'block';
        termInput.focus();
    }
    
    function hideForm() {
        formContainer.style.display = 'none';
        termInput.value = '';
        definitionInput.value = '';
    }
    
    function addFlashcard() {
        const term = termInput.value.trim();
        const definition = definitionInput.value.trim();
        
        if (!term || !definition) {
            alert('Please enter both term and definition');
            return;
        }
        
        // Create flashcard object
        const flashcard = {
            id: Date.now(),
            term,
            definition
        };
        
        // Get existing flashcards
        let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
        
        // Add new flashcard
        flashcards.push(flashcard);
        
        // Save to localStorage
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        
        // Clear inputs and hide form
        hideForm();
        
        // Refresh display
        loadFlashcards();
        
        // Show success animation
        showSuccessAnimation();
    }
    
    function loadFlashcards() {
        // Clear container
        flashcardsContainer.innerHTML = '';
        
        // Get flashcards from localStorage
        const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
        
        // Update card count
        cardCountElement.textContent = flashcards.length;
        
        // Update streak (simple implementation - can be enhanced)
        updateStreak();
        
        if (flashcards.length === 0) {
            flashcardsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <h3>No flashcards yet</h3>
                    <p>Create your first flashcard to get started</p>
                </div>
            `;
            return;
        }
        
        // Create flashcard elements
        flashcards.forEach(flashcard => {
            const flashcardElement = document.createElement('div');
            flashcardElement.className = 'flashcard';
            flashcardElement.dataset.id = flashcard.id;
            
            flashcardElement.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <div class="flashcard-content">
                            <div class="flashcard-term">${flashcard.term}</div>
                            <div class="hint-text">Click to flip</div>
                        </div>
                    </div>
                    <div class="flashcard-back">
                        <div class="flashcard-content">
                            <div class="flashcard-definition">${flashcard.definition}</div>
                            <div class="hint-text">Double-click to return</div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add click event for flipping
            flashcardElement.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
            
            // Add double click event to reset
            flashcardElement.addEventListener('dblclick', function(e) {
                e.stopPropagation();
                this.classList.remove('flipped');
            });
            
            flashcardsContainer.appendChild(flashcardElement);
        });
    }
    
    function updateStreak() {
        // Simple streak implementation - can be enhanced with actual date tracking
        const lastVisit = localStorage.getItem('lastVisit');
        const currentDate = new Date().toDateString();
        let streak = parseInt(localStorage.getItem('streak')) || 0;
        
        if (lastVisit !== currentDate) {
            // Check if it's consecutive day
            if (lastVisit && new Date(currentDate) - new Date(lastVisit) === 86400000) {
                streak += 1;
            } else if (!lastVisit) {
                streak = 1;
            } else {
                streak = 1; // Reset if not consecutive
            }
            
            localStorage.setItem('streak', streak);
            localStorage.setItem('lastVisit', currentDate);
        }
        
        streakCountElement.textContent = streak;
    }
    
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
    }
    
    function toggleTheme() {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    function showSuccessAnimation() {
        const successElement = document.createElement('div');
        successElement.className = 'success-animation';
        successElement.innerHTML = '<i class="fas fa-check-circle"></i> Card added!';
        document.body.appendChild(successElement);
        
        setTimeout(() => {
            successElement.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            successElement.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(successElement);
            }, 300);
        }, 2000);
    }
});