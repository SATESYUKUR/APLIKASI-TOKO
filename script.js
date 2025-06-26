// Daftarkan Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/APLIKASI-TOKO/sw.js') // PASTIKAN PATH INI BENAR
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
// ... sisa kode JavaScript Anda ...
// Data Menu Produk (Anda bisa menambahkan lebih banyak!)
const menu = [
    { id: 1, name: 'Minas ayam', price: 18000, image: '/APLIKASI-TOKO/images/minas-ayam.png' },
    { id: 2, name: 'Minas sate', price: 14000, image: '/APLIKASI-TOKO/images/minas-sate.png' },
    { id: 3, name: 'Minas telor', price: 14000, image: '/APLIKASI-TOKO/images/minas-telor.png' },
    { id: 4, name: 'Aneka Minuman', price: 5000, image: '/APLIKASI-TOKO/images/minuman.png' }
    // Anda bisa menambahkan menu lain di sini dengan ID unik (misal: id: 5, id: 6, dst.)
];

// Keranjang Belanja (akan menyimpan item yang dipilih)
let cart = [];

// Elemen DOM (Document Object Model) yang akan kita manipulasi
const menuItemsContainer = document.getElementById('menu-items');
const cartItemsContainer = document.getElementById('cart-items');
const grandTotalElement = document.getElementById('grandTotal');
const checkoutButton = document.getElementById('checkoutButton');
const customerNameInput = document.getElementById('customerName');

// --- FUNGSI UTAMA ---

// 1. Menampilkan Daftar Menu
function displayMenuItems() {
    menuItemsContainer.innerHTML = ''; // Kosongkan kontainer menu dulu
    menu.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('menu-item');
        menuItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">Rp ${item.price.toLocaleString('id-ID')}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Tambah ke Keranjang</button>
        `;
        menuItemsContainer.appendChild(menuItemDiv);
    });

    // Tambahkan event listener ke tombol "Tambah ke Keranjang"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// 2. Menambah Item ke Keranjang
function addToCart(event) {
    const itemId = parseInt(event.target.dataset.id);
    const selectedItem = menu.find(item => item.id === itemId);

    if (selectedItem) {
        const existingCartItem = cart.find(item => item.id === itemId);
        if (existingCartItem) {
            existingCartItem.quantity++;
        } else {
            cart.push({ ...selectedItem, quantity: 1 });
        }
        updateCartDisplay();
    }
}

// 3. Mengupdate Tampilan Keranjang
function updateCartDisplay() {
    cartItemsContainer.innerHTML = ''; // Kosongkan tampilan keranjang
    let grandTotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cart-message">Keranjang Anda kosong.</td>
            </tr>
        `;
        checkoutButton.disabled = true; // Nonaktifkan tombol checkout jika keranjang kosong
        grandTotalElement.textContent = `Rp 0`;
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        const cartItemRow = document.createElement('tr');
        cartItemRow.innerHTML = `
            <td>${item.name}</td>
            <td>Rp ${item.price.toLocaleString('id-ID')}</td>
            <td class="cart-item-quantity">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            </td>
            <td>Rp ${itemTotal.toLocaleString('id-ID')}</td>
            <td class="cart-item-actions">
                <button class="remove-btn" data-id="${item.id}">Batal</button>
            </td>
        `;
        cartItemsContainer.appendChild(cartItemRow);
    });

    grandTotalElement.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
    checkoutButton.disabled = false; // Aktifkan tombol checkout jika ada item di keranjang

    // Tambahkan event listener untuk tombol quantity dan remove
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeItemFromCart);
    });
}

// 4. Mengubah Jumlah Item di Keranjang (Tambah/Kurang)
function handleQuantityChange(event) {
    const itemId = parseInt(event.target.dataset.id);
    const action = event.target.dataset.action;
    const cartItem = cart.find(item => item.id === itemId);

    if (cartItem) {
        if (action === 'increase') {
            cartItem.quantity++;
        } else if (action === 'decrease') {
            cartItem.quantity--;
            if (cartItem.quantity <= 0) {
                // Jika kuantitas 0 atau kurang, hapus item dari keranjang
                cart = cart.filter(item => item.id !== itemId);
            }
        }
        updateCartDisplay();
    }
}

// 5. Menghapus Item dari Keranjang
function removeItemFromCart(event) {
    const itemId = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== itemId); // Filter array, buang item dengan ID ini
    updateCartDisplay();
}

// 6. Fungsi Checkout (Membuat Struk PDF)
async function checkout() {
    const customerName = customerNameInput.value.trim();

    if (!customerName) {
        alert('Mohon masukkan nama pelanggan terlebih dahulu!');
        customerNameInput.focus();
        return;
    }

    if (cart.length === 0) {
        alert('Keranjang belanja Anda kosong. Silakan pilih menu terlebih dahulu.');
        return;
    }

    // Menggunakan library jsPDF untuk membuat PDF
    // Pastikan Anda sudah mengimpornya di index.html jika ingin menggunakan CDN
    // Atau bisa menggunakan html2pdf.js yang lebih mudah untuk mengubah HTML ke PDF

    // Untuk simplicity dan kemudahan tanpa library eksternal yang kompleks
    // Kita akan membuat tampilan struk HTML sederhana dan kemudian meminta browser untuk mencetaknya ke PDF

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const currentDate = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });

    let receiptContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #333;">Struk Belanja Toko Saya</h2>
            <p style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 15px;">
                <strong>Tanggal:</strong> ${currentDate}<br>
                <strong>Pelanggan:</strong> ${customerName}
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Menu</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Harga</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
    `;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        receiptContent += `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Rp ${item.price.toLocaleString('id-ID')}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Rp ${itemTotal.toLocaleString('id-ID')}</td>
            </tr>
        `;
    });

    receiptContent += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Total Akhir:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Rp ${totalAmount.toLocaleString('id-ID')}</strong></td>
                    </tr>
                </tfoot>
            </table>
            <p style="text-align: center; font-size: 0.9em; color: #555;">Terima kasih atas kunjungan Anda!</p>
            <p style="text-align: center; font-size: 0.8em; color: #777;">Struk ini adalah bukti pembayaran digital.</p>
        </div>
    `;

    // Buka jendela baru dan tampilkan struk
    const newWindow = window.open('', '_blank');
    newWindow.document.write(receiptContent);
    newWindow.document.title = `Struk Belanja - ${customerName}`;
    newWindow.document.close();

    // Beri sedikit jeda sebelum mencetak agar konten termuat sempurna
    setTimeout(() => {
        newWindow.print(); // Membuka dialog cetak browser
    }, 500);

    // Reset keranjang setelah checkout
    cart = [];
    updateCartDisplay();
    customerNameInput.value = ''; // Kosongkan nama pelanggan
}

// --- EVENT LISTENERS ---

// Event listener untuk tombol Checkout
checkoutButton.addEventListener('click', checkout);

// Inisialisasi: Tampilkan menu saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    displayMenuItems();
    updateCartDisplay(); // Pastikan keranjang kosong saat awal
});

// Event listener untuk memastikan tombol checkout aktif/nonaktif
// berdasarkan apakah ada nama pelanggan dan keranjang tidak kosong
customerNameInput.addEventListener('input', () => {
    if (customerNameInput.value.trim() !== '' && cart.length > 0) {
        checkoutButton.disabled = false;
    } else {
        checkoutButton.disabled = true;
    }
});