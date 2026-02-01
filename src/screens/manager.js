// Manager screen - Recipe management
import { db } from '../firebase.js';
import { state } from '../state.js';

const recipesList = document.getElementById('recipesList');

export function renderRecipes() {
    if (state.recipes.length === 0) {
        recipesList.innerHTML = '<p class="no-messages">還沒有食譜，新增一個吧！</p>';
        return;
    }

    recipesList.innerHTML = state.recipes.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-card-header">
                <div>
                    <div class="recipe-name">${recipe.name}</div>
                    <div class="recipe-english">${recipe.englishName || ''}</div>
                </div>
                <div class="recipe-actions">
                    <button class="btn btn-small btn-danger" onclick="deleteRecipe('${recipe.id}')">刪除</button>
                </div>
            </div>
            <div class="recipe-ingredients">🥬 ${recipe.ingredients?.join(', ') || 'No ingredients'}</div>
        </div>
    `).join('');
}

export async function addRecipe() {
    const name = document.getElementById('recipeName').value.trim();
    const englishName = document.getElementById('recipeEnglish').value.trim();
    const ingredientsRaw = document.getElementById('recipeIngredients').value.trim();

    if (!name) {
        alert('請輸入菜名');
        return;
    }

    const ingredients = ingredientsRaw.split(/[,，]/).map(i => i.trim()).filter(i => i);

    try {
        await db.collection('recipes').add({
            name,
            englishName,
            ingredients,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear form
        document.getElementById('recipeName').value = '';
        document.getElementById('recipeEnglish').value = '';
        document.getElementById('recipeIngredients').value = '';

        alert('食譜已新增！');
    } catch (error) {
        console.error('Error adding recipe:', error);
        alert('新增失敗');
    }
}

export async function deleteRecipe(recipeId) {
    if (!confirm('確定要刪除這個食譜嗎？')) return;

    try {
        await db.collection('recipes').doc(recipeId).delete();
    } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('刪除失敗');
    }
}

// Export for onclick handlers
window.addRecipe = addRecipe;
window.deleteRecipe = deleteRecipe;
