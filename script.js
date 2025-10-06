// Get a reference to the container where recipes will be displayed
const recipeContainer = document.getElementById('recipe-container');
// API Endpoint to fetch Chicken recipes (as specified in the project brief)
const API_ENDPOINT = 'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken';

// ----------------------------------
// Helper Function for Truncation
// ----------------------------------

// Function to truncate long instruction text to a manageable length
function truncateInstructions(text, wordLimit) {
    // Check if text is valid
    if (!text) return '';
    // Split the text into an array of words
    const words = text.split(' ');
    // If the word count exceeds the limit
    if (words.length > wordLimit) {
        // Join the words up to the limit and add ellipsis (...)
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    // Otherwise, return the original text
    return text;
}

// ----------------------------------
// Main Data Fetching Function
// ----------------------------------

// Asynchronous function to handle the API call
async function fetchRecipeData() {
    try {
        // Fetch data from the API endpoint
        const response = await fetch(API_ENDPOINT);
        
        // Check if the response status is OK (200-299)
        if (!response.ok) {
            // Throw an error if the network response was not successful
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON data from the response body
        const data = await response.json();
        
        // Clear the initial 'Loading recipes...' message
        recipeContainer.innerHTML = ''; 

        // Check if the 'meals' array exists and contains data
        if (data.meals) {
            // Loop through each meal object in the array
            data.meals.forEach(meal => {
                // Call the function to display the current meal
                displayMeal(meal); 
            });
        } else {
            // Display a message if no meals were returned
            recipeContainer.innerHTML = '<p class="loading-message">No meals found for this search term.</p>';
        }

    } catch (error) {
        // Log any errors that occurred during the fetch process
        console.error('Could not fetch meal data:', error);
        // Display a user-friendly error message on the page
        recipeContainer.innerHTML = '<p class="loading-message error">Error loading recipes. Please try again.</p>';
    }
}

// ----------------------------------
// DOM Manipulation Function
// ----------------------------------

// Function to take a meal object and create/inject the HTML card
function displayMeal(meal) {
    // 1. Create the main card container element
    const mealCard = document.createElement('article');
    // Add the class for CSS styling
    mealCard.classList.add('meal-card'); 

    // 2. Extract common data points
    const title = meal.strMeal;
    const image = meal.strMealThumb;
    const youtubeLink = meal.strYoutube;
    
    // Truncate instructions (showing first 25 words) to match the image style
    const truncatedInstructions = truncateInstructions(meal.strInstructions, 25);

    // 3. Process Ingredients (List top 5 only, as per requirements)
    let ingredientsHtml = '';
    let ingredientCount = 0;
    
    // Loop through the ingredient/measure pairs (max 20 fields available in API)
    for (let i = 1; i <= 20 && ingredientCount < 5; i++) {
        // Use template literal access for dynamic field names (strIngredient1, strMeasure1, etc.)
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        // Check if the ingredient field is not empty or null
        if (ingredient && ingredient.trim() !== "") {
            // Create a span element containing "Ingredient - Measure"
            ingredientsHtml += `<span>${ingredient} - ${measure}</span>`;
            // Increment the counter to stop after 5 ingredients
            ingredientCount++; 
        }
    }

    // 4. Inject all dynamic content into the card's inner HTML
    mealCard.innerHTML = `
        <div class="meal-image-wrapper">
            <img src="${image}" alt="${title}" class="meal-image">
        </div>
        
        <h2 class="meal-title">${title}</h2>

        <p class="meal-instructions">${truncatedInstructions}</p>
        
        <div class="meal-ingredients">
            ${ingredientsHtml} </div>

        <a href="${youtubeLink}" target="_blank" class="watch-video-btn">Watch Video</a>
    `;

    // 5. Append the newly created card to the main container
    recipeContainer.appendChild(mealCard);
}

// ----------------------------------
// Initialization
// ----------------------------------

// Execute the main fetch function when the script runs (i.e., when the page loads)
fetchRecipeData();