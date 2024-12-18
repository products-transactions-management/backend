# Products and Transactions Management Backend API

## Deskripsi Project
Backend services ini dikembangkan untuk mendukung pengelolaan data produk dan transaksi dengan fitur CRUD (Create, Read, Update, Delete) dilengkapi dengan searching, sorting, dan filtering.

### Fitur Utama
1. **CRUD untuk Produk (Products)**
   - Tambah, baca, ubah, dan hapus produk.
   - Pencarian produk berdasarkan nama dan tipe.
   - Sorting nama produk (ascending dan descending).

2. **CRUD untuk Transaksi (Transactions)**
   - Tambah, baca, ubah, dan hapus transaksi.
   - Sorting transaksi berdasarkan tanggal dan kuantitas (ascending dan descending).
   - Filter transaksi berdasarkan rentang tanggal dan jumlah kuantitas.

3. **Validasi Data**
   - Semua input data divalidasi menggunakan library `zod` untuk memastikan integritas data.

4. **Logging dan Middleware**
   - Logging akses API menggunakan `morgan`.
   - Konfigurasi CORS untuk mendukung frontend dari domain lain.

5. **ORM**
   - Menggunakan Prisma ORM untuk integrasi database MySQL.

---

## Teknologi yang Digunakan
- **Bahasa**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Middleware**:
  - `cors`: Mengatur akses lintas domain.
  - `morgan`: Logging HTTP requests.
  - `zod`: Validasi data.

---

## Database Design
### ER Diagram
![ER Diagram](/assets/images/erd.png)

Relation:
- Tabel `products` dan `transactions` memiliki relasi `one-to-many`.

## Instalasi dan Konfigurasi

### Prasyarat
1. **Node.js** v18 atau lebih baru.
2. **MySQL** v8 atau lebih baru.
3. **Prisma CLI** (opsional untuk migrasi manual).

### Langkah Instalasi
1. Clone repository ini:
   ```bash
   git clone https://github.com/products-transactions-management/backend.git
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Membuat database, pastikan MySQL sudah terinstal dan berjalan pada port 3306:
   ```bash
   # masukkan password anda jika diminta (default kosong/ tidak ada password)
   mysql -uroot -p

   create database database_name;

   exit;
   ```

4. Copy file `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

   Kemudian, konfigurasikan database di `.env`:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   ```

5. Jalankan migrasi database:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Jalankan server:
   ```bash
   npm run dev
   ```

7. Server akan berjalan di base URL `http://localhost:3000/api`.

---

## Dokumentasi API
Untuk lebih detail, buka [API Documentation with Postman](https://documenter.getpostman.com/view/22324443/2sAYJ1m2rt).

- **Products Endpoints**:
  - `GET /products` - Ambil semua produk (dengan filtering/sorting menggunakan query parameter).
  - `GET /products/:id` - Ambil detail product.
  - `POST /products` - Tambahkan produk baru.
  - `PUT /products/:id` - Update data produk.
  - `DELETE /products/:id` - Hapus data produk.

- **Transactions Endpoints**:
  - `GET /transactions` - Ambil semua transaksi (dengan filtering/sorting menggunakan query parameter).
  - `GET /transactions/:id` - Ambil detail transaction.
  - `POST /transactions` - Tambahkan transaksi baru.
  - `PUT /transactions/:id` - Update data transaksi.
  - `DELETE /transactions/:id` - Hapus data transaksi.

#### Query Parameters (Optional)
- `sort`: Sorting transaksi berdasarkan `transaction_date` atau `quantity` (`asc` atau `desc`).
- `filter_start` & `filter_end`: Filter berdasarkan rentang tanggal transaksi.
- `quantity_min` & `quantity_max`: Filter berdasarkan rentang kuantitas.

---

## Kontak
- **Pengembang**: Mohammad Lukman Aqib
- **Email**: mohammadlukmanaqib@gmail.com
- **GitHub**: [GitHub](https://github.com/mazzlookman)
