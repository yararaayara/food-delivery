/* ======================================================== */
/* FUNGSI ADMIN MODE (ADMIN.HTML)                        */
/* ======================================================== */

function initAdminMode() {
    checkAdminSession();
    // Expose fungsi global untuk admin.html
    window.adminLogin = adminLogin;
    window.adminLogout = adminLogout;
    window.switchTab = switchTab;
    window.toggleInput = toggleInput;
    window.addMenu = addMenu;
    window.delMenu = delMenu;
    window.openEditModal = openEditModal;
    window.closeEditModal = closeEditModal;
    window.saveEditMenu = saveEditMenu;
    window.updStatus = updStatus;
    window.delOrder = delOrder;
}

function checkAdminSession() {
    if(sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        if(document.getElementById('loginOverlay')) document.getElementById('loginOverlay').style.display = 'none';
        if(document.getElementById('adminPanel')) document.getElementById('adminPanel').style.display = 'block';
        initAdminListeners();
    }
}

function initAdminListeners() {
    listenOrders();
    listenMenu();
    switchTab('orders'); // Default tab: Pesanan Aktif
}

// --- ADMIN LOGIN & LOGOUT ---
function adminLogin() {
    const u = document.getElementById('admUser').value;
    const p = document.getElementById('admPass').value;
    const errMsg = document.getElementById('errMsg');

    if(u === 'admin' && p === '12345') {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        if (errMsg) {
            errMsg.style.display = 'block';
            setTimeout(() => errMsg.style.display = 'none', 3000);
        }
    }
}

function adminLogout() {
    sessionStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'index.html';
}

// --- ADMIN NAVIGASI & UTILS ---
function switchTab(tab) {
    const tabOrders = document.getElementById('tabOrders');
    const tabHistory = document.getElementById('tabHistory'); // Tab Riwayat Selesai
    const tabAdd = document.getElementById('tabAdd');
    const tabManage = document.getElementById('tabManage');

    if(tabOrders) tabOrders.style.display = 'none';
    if(tabHistory) tabHistory.style.display = 'none';
    if(tabAdd) tabAdd.style.display = 'none';
    if(tabManage) tabManage.style.display = 'none';

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    let buttonIndex = -1;
    let targetTab = null;

    if(tab === 'orders') {
        targetTab = tabOrders;
        buttonIndex = 0;
    } else if(tab === 'history') {
        targetTab = tabHistory;
        buttonIndex = 1;
    } else if(tab === 'add') {
        targetTab = tabAdd;
        buttonIndex = 2;
    } else if (tab === 'manage') {
        targetTab = tabManage;
        buttonIndex = 3;
    }

    if (targetTab) targetTab.style.display = 'block';
    if (buttonIndex !== -1 && document.querySelectorAll('.tab-btn')[buttonIndex]) {
        document.querySelectorAll('.tab-btn')[buttonIndex].classList.add('active');
    }
}

function toggleInput(type, mode) {
    const fileGroup = document.getElementById('inputGroupFile'+mode);
    const emojiGroup = document.getElementById('inputGroupEmoji'+mode);
    if(fileGroup) fileGroup.style.display = (type === 'file') ? 'block' : 'none';
    if(emojiGroup) emojiGroup.style.display = (type === 'emoji') ? 'block' : 'none';
}


// --- 6. ADMIN ORDER MANAGEMENT (DIPISAHKAN DI TAB BERBEDA) ---
function listenOrders() {
    db.ref('orders').on('value', snap => {
        const data = snap.val();

        // Kontainer Tab Pesanan Aktif
        const activeDiv = document.getElementById('ordersListActive');
        // Kontainer Tab Riwayat Selesai
        const completedDiv = document.getElementById('ordersListCompleted');

        if(activeDiv) activeDiv.innerHTML = '';
        if(completedDiv) completedDiv.innerHTML = '';

        let activeOrdersCount = 0;
        let completedOrdersCount = 0;

        if(data) {
            const orders = Object.keys(data).map(k => ({id: k, ...data[k]})).reverse();

            let activeHTML = '';
            let completedHTML = '';

            orders.forEach(o => {
                const isCompleted = o.status === 'Selesai';

                let items = (o.items || []).map(i => `<div>${i.quantity || i.qty}x ${i.name}</div>`).join('');

                // --- Logic Styling Status ---
                let statusStyle = `background:#FFC107; color:#333; border: 1px solid #FFC107;`;
                let cardBorderColor = '#FFC107';

                if(o.status === 'Diproses' || o.status === 'Sedang Diantar') {
                    statusStyle = `background:var(--color-primary); color:var(--color-text); border: 1px solid var(--color-primary);`;
                    cardBorderColor = 'var(--color-primary)';
                }
                if(o.status === 'Selesai') {
                    statusStyle = `background:var(--color-secondary); color:var(--color-text); border: 1px solid var(--color-secondary);`;
                    cardBorderColor = 'var(--color-secondary)';
                }
                // --- End Styling ---

                const orderCardHTML = `
                    <div class="order-card" style="border-left-color: ${cardBorderColor};">
                        <div class="order-header">
                            <div>
                                <div style="font-weight:bold; color:var(--color-text); font-size:1.1rem;">${o.buyerName}</div>
                                <div style="font-size:0.8rem; color:var(--color-text-light);">${o.dateReadable || 'Baru saja'}</div>
                                <div style="font-size:0.9rem; color:var(--color-text-light); margin-top:5px;">📍 ${o.address}</div>
                            </div>
                            <div class="order-status" style="${statusStyle}">${o.status}</div>
                        </div>
                        <div style="margin-bottom:15px; color:var(--color-text); border-bottom:1px dashed var(--color-border); padding-bottom:10px;">
                            ${items}
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div style="font-weight:800; color:var(--color-primary); font-size:1.3rem;">Rp ${o.total ? o.total.toLocaleString('id-ID') : 0}</div>
                            <div class="manage-actions">
                                ${!isCompleted ?
                                    (o.status === 'Menunggu Konfirmasi' ? `<button class="btn btn-primary btn-sm" onclick="updStatus('${o.id}','Diproses')">Terima</button>` : '') +
                                    (o.status !== 'Selesai' ? `<button class="btn btn-secondary btn-sm" onclick="updStatus('${o.id}','Selesai')">Selesai</button>` : '')
                                    :
                                    `<button class="btn btn-danger btn-sm" onclick="delOrder('${o.id}')">Hapus</button>`
                                }
                            </div>
                        </div>
                    </div>
                `;

                if (isCompleted) {
                    completedHTML += orderCardHTML;
                    completedOrdersCount++;
                } else {
                    activeHTML += orderCardHTML;
                    activeOrdersCount++;
                }
            });

            if (activeDiv) {
                if (activeOrdersCount > 0) {
                    activeDiv.innerHTML = activeHTML;
                } else {
                    activeDiv.innerHTML = '<div class="empty-state">🎉 Tidak ada pesanan yang sedang diproses. Santai sejenak!</div>';
                }
            }

            if (completedDiv) {
                if (completedOrdersCount > 0) {
                    completedDiv.innerHTML = completedHTML;
                } else {
                    completedDiv.innerHTML = '<div class="empty-state">Belum ada riwayat pesanan selesai.</div>';
                }
            }

        } else {
            if(activeDiv) activeDiv.innerHTML = '<div class="empty-state">🍽️ Belum ada pesanan masuk.</div>';
            if(completedDiv) completedDiv.innerHTML = '<div class="empty-state">Belum ada riwayat pesanan selesai.</div>';
        }
    });
}

function updStatus(id, s) {
    db.ref('orders/'+id).update({status: s});
}

function delOrder(id) {
    if(confirm('Yakin ingin menghapus riwayat pesanan ini? Tindakan ini tidak dapat dibatalkan.')) {
        db.ref('orders/'+id).remove();
    }
}

// --- 7. ADMIN MENU MANAGEMENT ---
function addMenu(e) {
    e.preventDefault();
    const btn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');
    const type = document.querySelector('input[name="imgType"]:checked').value;

    btn.disabled = true; btn.textContent = "Memproses Data...";
    if (statusDiv) statusDiv.textContent = "";

    if (type === 'file') {
        const file = document.getElementById('mImgFile').files[0];
        if(!file) { alert("Pilih foto dulu!"); btn.disabled=false; btn.textContent="Simpan Menu Baru"; return; }
        if(file.size > 700000) { alert("❌ Foto terlalu besar! Max 700KB."); btn.disabled=false; btn.textContent="Simpan Menu Baru"; return; }

        const reader = new FileReader();
        reader.onload = function(evt) { saveToDb(evt.target.result); };
        reader.readAsDataURL(file);
    } else {
        const emoji = document.getElementById('mEmojiTxt').value.trim();
        if(!emoji) { alert("Isi emoji!"); btn.disabled=false; btn.textContent="Simpan Menu Baru"; return; }
        saveToDb(emoji);
    }

    function saveToDb(img) {
        const data = {
            name: document.getElementById('mName').value,
            price: parseInt(document.getElementById('mPrice').value),
            category: document.getElementById('mCat').value,
            description: document.getElementById('mDesc').value,
            image: img,
            rating: 5.0, deliveryTime: '20m'
        };
        db.ref('menu_items').push(data).then(() => {
            if(statusDiv) {
                statusDiv.textContent = "✅ Menu Berhasil Ditambahkan!";
                statusDiv.style.color = "var(--color-secondary)";
            }
            const form = document.querySelector('#tabAdd form');
            if(form) form.reset();
            btn.disabled = false; btn.textContent = "Simpan Menu Baru";
            setTimeout(() => switchTab('manage'), 1000);
        }).catch(err => {
            if(statusDiv) {
                statusDiv.textContent = `❌ Gagal: ${err.message}`;
                statusDiv.style.color = "var(--color-danger)";
            }
            btn.disabled = false; btn.textContent = "Simpan Menu Baru";
        });
    }
}

function listenMenu() {
    if(!document.getElementById('manageList')) return;
    db.ref('menu_items').on('value', snap => {
        const data = snap.val();
        menuCache = data || {};
        const div = document.getElementById('manageList');
        div.innerHTML = '';

        if(data) {
            Object.keys(data).forEach(k => {
                const m = data[k];
                let thumb = (m.image && (m.image.startsWith('data:') || m.image.startsWith('http')))
                    ? `<img src="${m.image}" class="manage-thumb" alt="${m.name}">`
                    : `<div class="manage-thumb">${m.image || '🍽️'}</div>`;

                div.innerHTML += `
                    <div class="manage-item">
                        ${thumb}
                        <div class="manage-info">
                            <div style="font-weight:bold; color:var(--color-text); font-size: 1.1rem;">${m.name}</div>
                            <div style="font-size:0.9rem; color:var(--color-text-light);">Rp ${m.price ? m.price.toLocaleString() : 0} | ${m.category}</div>
                        </div>
                        <div class="manage-actions">
                            <button class="btn btn-secondary btn-sm" onclick="openEditModal('${k}')">✏️ Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="delMenu('${k}', '${m.name}')">🗑️ Hapus</button>
                        </div>
                    </div>`;
            });
        } else { div.innerHTML = '<div class="empty-state">Menu kosong. Tambahkan menu baru!</div>'; }
    });
}
function delMenu(id, name) {
    if(confirm(`Yakin ingin menghapus menu "${name}"?`)) {
        db.ref('menu_items/'+id).remove();
    }
}

function openEditModal(id) {
    const item = menuCache[id];
    if(!item) return;
    if(document.getElementById('editId')) document.getElementById('editId').value = id;
    if(document.getElementById('editName')) document.getElementById('editName').value = item.name;
    if(document.getElementById('editPrice')) document.getElementById('editPrice').value = item.price;
    if(document.getElementById('editCat')) document.getElementById('editCat').value = item.category;
    if(document.getElementById('editDesc')) document.getElementById('editDesc').value = item.description;

    const isFile = (item.image && (item.image.startsWith('data:') || item.image.startsWith('http')));

    if(document.getElementById('inputGroupFileEdit')) document.getElementById('inputGroupFileEdit').style.display = isFile ? 'block' : 'none';
    if(document.getElementById('inputGroupEmojiEdit')) document.getElementById('inputGroupEmojiEdit').style.display = !isFile ? 'block' : 'none';

    if (!isFile) {
        if(document.getElementById('editEmojiTxt')) document.getElementById('editEmojiTxt').value = item.image || '';
        if(document.querySelector('input[name="editImgType"][value="emoji"]')) document.querySelector('input[name="editImgType"][value="emoji"]').checked = true;
    } else {
        if(document.getElementById('editEmojiTxt')) document.getElementById('editEmojiTxt').value = '';
        if(document.querySelector('input[name="editImgType"][value="file"]')) document.querySelector('input[name="editImgType"][value="file"]').checked = true;
    }

    if(document.getElementById('editModal')) document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    if(document.getElementById('editModal')) document.getElementById('editModal').classList.remove('active');
}

function saveEditMenu(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const btn = document.getElementById('editSaveBtn');
    const type = document.querySelector('input[name="editImgType"]:checked').value;
    const file = document.getElementById('editImgFile').files[0];
    const emoji = document.getElementById('editEmojiTxt').value;

    btn.disabled = true; btn.textContent = "Updating...";

    let updates = {
        name: document.getElementById('editName').value,
        price: parseInt(document.getElementById('editPrice').value),
        category: document.getElementById('editCat').value,
        description: document.getElementById('editDesc').value
    };

    if (type === 'file' && file) {
        if(file.size > 700000) { alert("Foto terlalu besar! Max 700KB."); btn.disabled=false; btn.textContent="Update Menu"; return; }
        const reader = new FileReader();
        reader.onload = function(evt) { updates.image = evt.target.result; pushUpdate(id, updates, btn); };
        reader.readAsDataURL(file);
    } else if (type === 'emoji' && emoji) {
        updates.image = emoji; pushUpdate(id, updates, btn);
    } else {
        pushUpdate(id, updates, btn);
    }
}

function pushUpdate(id, data, btn) {
    db.ref('menu_items/' + id).update(data).then(() => {
        alert("✅ Menu Berhasil Diupdate!");
        closeEditModal();
        btn.disabled = false; btn.textContent = "Update Menu";
    }).catch(err => {
         alert(`❌ Gagal Update: ${err.message}`);
         btn.disabled = false; btn.textContent = "Update Menu";
    });
}
