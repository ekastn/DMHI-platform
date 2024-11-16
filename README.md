# DMHI Platform

## Dependencies

- Python 3.8+
- Node.js 14+
- PostgreSQL

## Setup

### 1. Python

1. Membuat virtual environment:
    ```sh
    python3 -m venv .venv
    ```

2. Aktifkan virtual environment:
    - Windows:
        ```sh
        .venv\Scripts\activate
        ```
    - macOS/Linux:
        ```sh
        source .venv/bin/activate
        ```

3. Install Python dependencies:
    ```sh
    pip install -r requirements.txt
    ```

### 2. Node.js

1. Install Node.js dependencies:
    ```sh
    npm install
    ```

### 3. Database Setup dan Migrasi

1. Setup database URL di `.env` file:
    ```sh
    DATABASE_URL=postgresql://username:password@localhost/namadb
    ```

3. Jalankan migrasi database:
    ```sh
    flask db upgrade
    ```

### 4. Konfigurasi Environment

1. Copy `.env.example` file ke `.env`:
    ```sh
    cp .env.example .env
    ```

2. Lengkapi variabel di `.env` file

## Menjalankan aplikasi

```sh
# Developmen
npm run dev

# Production
npm start
```


