const API = 'http://localhost:8080/api';

let items = [];
let categories = [];
let ingredients = [];

let menuFilter = 'all';
let invFilter = 'all';
let ingFilter = 'all';


async function sendRequest(path, method, body) {
    if (!method) method = 'GET';

    const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(API + path, options);

    if (!response.ok) {
        throw new Error('Request failed: ' + response.status);
    }

    if (method === 'DELETE') return null;

    return response.json();
}


async function loadAll() {
    try {
        items = await sendRequest('/items');
        categories = await sendRequest('/categories');
        ingredients = await sendRequest('/ingredients');
    } catch (e) {
        alert('Could not connect to the backend. Make sure the server is running on port 8080.');
    }
}


async function showPage(page, clickedLink) {
    const navLinks = document.querySelectorAll('.nav-item');
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
    }
    clickedLink.classList.add('active');

    const allPages = document.querySelectorAll('.page');
    for (let i = 0; i < allPages.length; i++) {
        allPages[i].classList.remove('active');
    }
    document.getElementById('page-' + page).classList.add('active');

    if (page === 'dashboard') document.getElementById('page-title').textContent = 'Dashboard';
    if (page === 'menu') document.getElementById('page-title').textContent = 'Menu Items';
    if (page === 'inventory') document.getElementById('page-title').textContent = 'Inventory';
    if (page === 'ingredients') document.getElementById('page-title').textContent = 'Ingredients';

    document.getElementById('add-btn').style.display = (page === 'menu') ? 'inline-flex' : 'none';
    document.getElementById('add-ing-btn').style.display = (page === 'ingredients') ? 'inline-flex' : 'none';

    await loadAll();
    updateBadges();

    if (page === 'dashboard') renderDashboard();
    if (page === 'menu') renderMenu();
    if (page === 'inventory') renderInventory();
    if (page === 'ingredients') renderIngredients();
}


function updateBadges() {
    let outCount = 0;
    let lowCount = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].stock === 0) outCount++;
        if (items[i].stock > 0 && items[i].stock < items[i].threshold) lowCount++;
    }

    let ingIssues = 0;
    for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].quantity < ingredients[i].threshold) ingIssues++;
    }

    const b1 = document.getElementById('badge-oos');
    const b2 = document.getElementById('badge-low');
    const b3 = document.getElementById('badge-ing');

    b1.textContent = outCount;
    b2.textContent = lowCount;
    b3.textContent = ingIssues;

    if (outCount > 0) b1.classList.add('show'); else b1.classList.remove('show');
    if (lowCount > 0) b2.classList.add('show'); else b2.classList.remove('show');
    if (ingIssues > 0) b3.classList.add('show'); else b3.classList.remove('show');
}


async function renderDashboard() {
    let dash;
    try {
        dash = await sendRequest('/dashboard');
    } catch (e) {
        console.log('Could not load dashboard stats');
        return;
    }

    document.getElementById('s-total').textContent = dash.totalItems;
    document.getElementById('s-avail').textContent = dash.available;
    document.getElementById('s-oos').textContent = dash.outOfStock;
    document.getElementById('s-ing-total').textContent = dash.totalIngredients;
    document.getElementById('s-ings').textContent = dash.lowIngredients;

    const tbody = document.getElementById('dash-items');
    tbody.innerHTML = '';
    const recent = items.slice(-6).reverse();

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No items yet.</td></tr>';
    } else {
        for (let i = 0; i < recent.length; i++) {
            const item = recent[i];
            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + item.name + '</td>' +
                '<td>' + getCategoryName(item.category) + '</td>' +
                '<td>$' + item.price.toFixed(2) + '</td>' +
                '<td>' + getStatusText(item.stock, item.threshold) + '</td>';
            tbody.appendChild(tr);
        }
    }

    const catsDiv = document.getElementById('dash-cats');
    catsDiv.innerHTML = '';
    for (let i = 0; i < dash.categories.length; i++) {
        const cat = dash.categories[i];
        const div = document.createElement('div');
        div.className = 'cat-row';
        div.innerHTML =
            '<div style="flex:1">' +
                '<div class="cat-name">' + cat.name + '</div>' +
                '<div class="cat-sub">' + cat.count + ' items</div>' +
            '</div>';
        catsDiv.appendChild(div);
    }

    const ingTbody = document.getElementById('dash-ings');
    ingTbody.innerHTML = '';
    if (ingredients.length === 0) {
        ingTbody.innerHTML = '<tr><td colspan="4">No ingredients yet.</td></tr>';
    } else {
        for (let i = 0; i < ingredients.length; i++) {
            const ing = ingredients[i];
            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + ing.name + '</td>' +
                '<td>' + ing.unit + '</td>' +
                '<td>' + ing.quantity + '</td>' +
                '<td>' + getStatusText(ing.quantity, ing.threshold) + '</td>';
            ingTbody.appendChild(tr);
        }
    }
}

function getCategoryName(category) {
    if (!category) return '--';
    return category.name;
}

function getStatusText(quantity, threshold) {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < threshold) return 'Low Stock';
    return 'In Stock';
}

function getStatusClass(quantity, threshold) {
    if (quantity === 0) return 'b-out';
    if (quantity < threshold) return 'b-low';
    return 'b-ok';
}


function setMenuFilter(filter, btn) {
    menuFilter = filter;
    const tabs = document.querySelectorAll('#page-menu .ftab');
    for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    btn.classList.add('active');
    renderMenu();
}

function renderMenu() {
    const search = document.getElementById('menu-search').value.toLowerCase();
    const tbody = document.getElementById('menu-tbody');
    tbody.innerHTML = '';
    let count = 0;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (menuFilter === 'available' && item.stock === 0) continue;
        if (menuFilter === 'out' && item.stock !== 0) continue;
        if (search !== '' && !item.name.toLowerCase().includes(search)) continue;

        count++;

        let ingNames = 'None';
        if (item.ingredients && item.ingredients.length > 0) {
            ingNames = '';
            for (let j = 0; j < item.ingredients.length; j++) {
                if (j > 0) ingNames += ', ';
                ingNames += item.ingredients[j].name;
            }
        }

        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + item.name + '<br><small>' + (item.allergens || 'No allergens') + '</small></td>' +
            '<td>' + getCategoryName(item.category) + '</td>' +
            '<td>' + ingNames + '</td>' +
            '<td>$' + item.price.toFixed(2) + '</td>' +
            '<td><span class="badge ' + getStatusClass(item.stock, item.threshold) + '">' + getStatusText(item.stock, item.threshold) + '</span></td>' +
            '<td>' +
                '<button class="btn-ghost" onclick="openEditModal(' + item.id + ')">Edit</button> ' +
                '<button class="btn-danger" onclick="deleteItem(' + item.id + ')">Delete</button>' +
            '</td>';
        tbody.appendChild(tr);
    }

    document.getElementById('menu-count').textContent = count + ' of ' + items.length + ' items';
}


function setInvFilter(filter, btn) {
    invFilter = filter;
    const tabs = document.querySelectorAll('#page-inventory .ftab');
    for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    btn.classList.add('active');
    renderInventory();
}

function renderInventory() {
    const search = document.getElementById('inv-search').value.toLowerCase();
    const tbody = document.getElementById('inv-tbody');
    tbody.innerHTML = '';

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (invFilter === 'low' && !(item.stock > 0 && item.stock < item.threshold)) continue;
        if (invFilter === 'out' && item.stock !== 0) continue;
        if (search !== '' && !item.name.toLowerCase().includes(search)) continue;

        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + item.name + '</td>' +
            '<td>' + getCategoryName(item.category) + '</td>' +
            '<td>' +
                '<button class="qty-btn" onclick="changeStock(' + item.id + ', -1)">-</button> ' +
                '<input type="number" value="' + item.stock + '" min="0" style="width:60px;text-align:center" onchange="saveStock(' + item.id + ', this.value)"/> ' +
                '<button class="qty-btn" onclick="changeStock(' + item.id + ', 1)">+</button>' +
            '</td>' +
            '<td><input type="number" value="' + item.threshold + '" min="1" style="width:60px;text-align:center" onchange="saveThreshold(' + item.id + ', this.value)"/></td>' +
            '<td><span class="badge ' + getStatusClass(item.stock, item.threshold) + '">' + getStatusText(item.stock, item.threshold) + '</span></td>';
        tbody.appendChild(tr);
    }
}

async function changeStock(id, delta) {
    const item = findById(items, id);
    if (!item) return;
    const newVal = Math.max(0, item.stock + delta);
    await saveStock(id, newVal);
}

async function saveStock(id, val) {
    const item = findById(items, id);
    if (!item) return;
    item.stock = Math.max(0, parseInt(val) || 0);
    try {
        await sendRequest('/items/' + id + '/stock', 'PATCH', { stock: item.stock, threshold: item.threshold });
        renderInventory();
        updateBadges();
    } catch (e) {
        alert('Failed to save stock.');
    }
}

async function saveThreshold(id, val) {
    const item = findById(items, id);
    if (!item) return;
    item.threshold = Math.max(1, parseInt(val) || 1);
    try {
        await sendRequest('/items/' + id + '/stock', 'PATCH', { stock: item.stock, threshold: item.threshold });
        renderInventory();
    } catch (e) {
        alert('Failed to save threshold.');
    }
}


function setIngFilter(filter, btn) {
    ingFilter = filter;
    const tabs = document.querySelectorAll('#page-ingredients .ftab');
    for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    btn.classList.add('active');
    renderIngredients();
}

function renderIngredients() {
    const search = document.getElementById('ing-search').value.toLowerCase();
    const tbody = document.getElementById('ing-tbody');
    tbody.innerHTML = '';
    let count = 0;

    for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];

        if (ingFilter === 'low' && !(ing.quantity > 0 && ing.quantity < ing.threshold)) continue;
        if (ingFilter === 'out' && ing.quantity !== 0) continue;
        if (search !== '' && !ing.name.toLowerCase().includes(search)) continue;

        count++;

        // figure out which menu items use this ingredient
        let usedIn = '';
        for (let j = 0; j < items.length; j++) {
            if (!items[j].ingredients) continue;
            for (let k = 0; k < items[j].ingredients.length; k++) {
                if (items[j].ingredients[k].id === ing.id) {
                    if (usedIn !== '') usedIn += ', ';
                    usedIn += items[j].name;
                    break;
                }
            }
        }
        if (usedIn === '') usedIn = 'Not used';

        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + ing.name + '</td>' +
            '<td>' + ing.unit + '</td>' +
            '<td>' +
                '<button class="qty-btn" onclick="changeIngQty(' + ing.id + ', -1)">-</button> ' +
                '<input type="number" value="' + ing.quantity + '" min="0" step="0.01" style="width:70px;text-align:center" onchange="saveIngQty(' + ing.id + ', this.value)"/> ' +
                '<button class="qty-btn" onclick="changeIngQty(' + ing.id + ', 1)">+</button>' +
            '</td>' +
            '<td><input type="number" value="' + ing.threshold + '" min="0" step="0.01" style="width:70px;text-align:center" onchange="saveIngThreshold(' + ing.id + ', this.value)"/></td>' +
            '<td><span class="badge ' + getStatusClass(ing.quantity, ing.threshold) + '">' + getStatusText(ing.quantity, ing.threshold) + '</span></td>' +
            '<td>' + usedIn + '</td>' +
            '<td>' +
                '<button class="btn-ghost" onclick="openEditIngModal(' + ing.id + ')">Edit</button> ' +
                '<button class="btn-danger" onclick="deleteIngredient(' + ing.id + ')">Delete</button>' +
            '</td>';
        tbody.appendChild(tr);
    }

    document.getElementById('ing-count').textContent = count + ' of ' + ingredients.length + ' ingredients';
}

async function changeIngQty(id, delta) {
    const ing = findById(ingredients, id);
    if (!ing) return;
    const newVal = Math.max(0, ing.quantity + delta);
    await saveIngQty(id, newVal);
}

async function saveIngQty(id, val) {
    const ing = findById(ingredients, id);
    if (!ing) return;
    ing.quantity = Math.max(0, parseFloat(val) || 0);
    try {
        await sendRequest('/ingredients/' + id + '/quantity', 'PATCH', { quantity: ing.quantity, threshold: ing.threshold });
        renderIngredients();
        updateBadges();
    } catch (e) {
        alert('Failed to save quantity.');
    }
}

async function saveIngThreshold(id, val) {
    const ing = findById(ingredients, id);
    if (!ing) return;
    ing.threshold = Math.max(0, parseFloat(val) || 0);
    try {
        await sendRequest('/ingredients/' + id + '/quantity', 'PATCH', { quantity: ing.quantity, threshold: ing.threshold });
        renderIngredients();
    } catch (e) {
        alert('Failed to save threshold.');
    }
}


function openIngModal() {
    document.getElementById('ing-modal-title').textContent = 'Add Ingredient';
    document.getElementById('ing-id').value = '';
    document.getElementById('ing-name').value = '';
    document.getElementById('ing-qty').value = '';
    document.getElementById('ing-unit').value = 'g';
    document.getElementById('ing-threshold').value = '';
    document.getElementById('ing-error').classList.remove('show');
    document.getElementById('ing-modal').classList.add('open');
    document.getElementById('ing-name').focus();
}

function openEditIngModal(id) {
    const ing = findById(ingredients, id);
    if (!ing) return;

    document.getElementById('ing-modal-title').textContent = 'Edit Ingredient';
    document.getElementById('ing-id').value = ing.id;
    document.getElementById('ing-name').value = ing.name;
    document.getElementById('ing-qty').value = ing.quantity;
    document.getElementById('ing-unit').value = ing.unit;
    document.getElementById('ing-threshold').value = ing.threshold;
    document.getElementById('ing-error').classList.remove('show');
    document.getElementById('ing-modal').classList.add('open');
}

function closeIngModal() {
    document.getElementById('ing-modal').classList.remove('open');
}

async function saveIngredient() {
    const id = document.getElementById('ing-id').value;
    const name = document.getElementById('ing-name').value.trim();
    const quantity = parseFloat(document.getElementById('ing-qty').value);
    const unit = document.getElementById('ing-unit').value;
    const threshold = parseFloat(document.getElementById('ing-threshold').value) || 0;

    if (!name || isNaN(quantity) || !unit) {
        document.getElementById('ing-error').classList.add('show');
        return;
    }

    const data = { name: name, quantity: quantity, unit: unit, threshold: threshold };

    try {
        if (!id) {
            const created = await sendRequest('/ingredients', 'POST', data);
            ingredients.push(created);
        } else {
            const updated = await sendRequest('/ingredients/' + id, 'PUT', data);
            for (let i = 0; i < ingredients.length; i++) {
                if (ingredients[i].id === parseInt(id)) {
                    ingredients[i] = updated;
                    break;
                }
            }
        }
        closeIngModal();
        renderIngredients();
        updateBadges();
    } catch (e) {
        alert('Save failed.');
    }
}

async function deleteIngredient(id) {
    const ing = findById(ingredients, id);
    if (!ing) return;
    if (!confirm('Delete "' + ing.name + '"?')) return;

    try {
        await sendRequest('/ingredients/' + id, 'DELETE');
        ingredients = removeById(ingredients, id);
        renderIngredients();
        updateBadges();
    } catch (e) {
        alert('Delete failed.');
    }
}


function openAddModal() {
    document.getElementById('item-modal-title').textContent = 'Add Menu Item';
    document.getElementById('f-id').value = '';
    document.getElementById('f-name').value = '';
    document.getElementById('f-price').value = '';
    document.getElementById('f-allergens').value = '';
    document.getElementById('f-image').value = '';
    document.getElementById('f-stock').value = '20';
    document.getElementById('f-threshold').value = '5';
    document.getElementById('item-error').classList.remove('show');
    fillCategoryDropdown(null);
    fillIngredientChecklist([]);
    document.getElementById('item-modal').classList.add('open');
    document.getElementById('f-name').focus();
}

function openEditModal(id) {
    const item = findById(items, id);
    if (!item) return;

    document.getElementById('item-modal-title').textContent = 'Edit Menu Item';
    document.getElementById('f-id').value = item.id;
    document.getElementById('f-name').value = item.name;
    document.getElementById('f-price').value = item.price;
    document.getElementById('f-allergens').value = item.allergens || '';
    document.getElementById('f-image').value = item.image || '';
    document.getElementById('f-stock').value = item.stock;
    document.getElementById('f-threshold').value = item.threshold;
    document.getElementById('item-error').classList.remove('show');

    const catId = item.category ? item.category.id : null;
    fillCategoryDropdown(catId);

    const selectedIds = [];
    if (item.ingredients) {
        for (let i = 0; i < item.ingredients.length; i++) {
            selectedIds.push(item.ingredients[i].id);
        }
    }
    fillIngredientChecklist(selectedIds);

    document.getElementById('item-modal').classList.add('open');
}

function closeItemModal() {
    document.getElementById('item-modal').classList.remove('open');
}

function fillCategoryDropdown(selectedId) {
    const select = document.getElementById('f-category');
    select.innerHTML = '<option value="">-- Select Category --</option>';
    for (let i = 0; i < categories.length; i++) {
        const opt = document.createElement('option');
        opt.value = categories[i].id;
        opt.textContent = categories[i].name;
        if (categories[i].id === selectedId) opt.selected = true;
        select.appendChild(opt);
    }
}

function fillIngredientChecklist(selectedIds) {
    const list = document.getElementById('ing-checklist');
    list.innerHTML = '';

    if (ingredients.length === 0) {
        list.innerHTML = '<div style="padding:10px;color:#94a3b8;font-size:12px">No ingredients yet</div>';
        return;
    }

    for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        const isChecked = selectedIds.includes(ing.id);
        const label = document.createElement('label');
        label.className = 'ing-check-row';
        label.innerHTML =
            '<input type="checkbox" value="' + ing.id + '" ' + (isChecked ? 'checked' : '') + ' onchange="updateSelectedTags()"/> ' +
            ing.name + ' (' + ing.unit + ')';
        list.appendChild(label);
    }

    updateSelectedTags();
}

function filterIngSelector(searchText) {
    const rows = document.querySelectorAll('#ing-checklist .ing-check-row');
    for (let i = 0; i < rows.length; i++) {
        const match = rows[i].textContent.toLowerCase().includes(searchText.toLowerCase());
        rows[i].style.display = match ? '' : 'none';
    }
}

function updateSelectedTags() {
    const checked = document.querySelectorAll('#ing-checklist input:checked');
    const tagsDiv = document.getElementById('ing-selected-tags');
    tagsDiv.innerHTML = '';

    if (checked.length === 0) {
        tagsDiv.innerHTML = '<span style="color:#94a3b8;font-size:12px">None selected</span>';
        return;
    }

    for (let i = 0; i < checked.length; i++) {
        const ing = findById(ingredients, parseInt(checked[i].value));
        if (ing) {
            const tag = document.createElement('span');
            tag.className = 'ing-tag';
            tag.textContent = ing.name;
            tagsDiv.appendChild(tag);
        }
    }
}

async function saveItem() {
    const id = document.getElementById('f-id').value;
    const name = document.getElementById('f-name').value.trim();
    const price = parseFloat(document.getElementById('f-price').value);
    const catId = parseInt(document.getElementById('f-category').value);
    const allergens = document.getElementById('f-allergens').value.trim();
    const image = document.getElementById('f-image').value.trim();
    const stock = parseInt(document.getElementById('f-stock').value) || 20;
    const threshold = parseInt(document.getElementById('f-threshold').value) || 5;

    if (!name || isNaN(price) || !catId) {
        document.getElementById('item-error').classList.add('show');
        return;
    }

    const ingredientIds = [];
    const boxes = document.querySelectorAll('#ing-checklist input:checked');
    for (let i = 0; i < boxes.length; i++) {
        ingredientIds.push(parseInt(boxes[i].value));
    }

    const data = {
        name: name,
        price: price,
        allergens: allergens,
        image: image,
        stock: stock,
        threshold: threshold,
        categoryId: catId,
        ingredientIds: ingredientIds
    };

    try {
        if (!id) {
            const created = await sendRequest('/items', 'POST', data);
            items.push(created);
        } else {
            const updated = await sendRequest('/items/' + id, 'PUT', data);
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === parseInt(id)) {
                    items[i] = updated;
                    break;
                }
            }
        }
        closeItemModal();
        renderMenu();
        updateBadges();
    } catch (e) {
        alert('Save failed.');
    }
}

async function deleteItem(id) {
    const item = findById(items, id);
    if (!item) return;
    if (!confirm('Delete "' + item.name + '"?')) return;

    try {
        await sendRequest('/items/' + id, 'DELETE');
        items = removeById(items, id);
        renderMenu();
        updateBadges();
    } catch (e) {
        alert('Delete failed.');
    }
}


function findById(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) return arr[i];
    }
    return null;
}

function removeById(arr, id) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id !== id) result.push(arr[i]);
    }
    return result;
}


document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeItemModal();
        closeIngModal();
    }
});


async function init() {
    await loadAll();
    updateBadges();
    renderDashboard();
}

init();
