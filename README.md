# Django + React Blogging Site

A full-stack blogging website with a Django REST backend and React.js frontend.

## Folder Structure

```
Bloging_site/
├── backend/
│   ├── config/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── blog_api/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── db.sqlite3 (generated at runtime)
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── BlogCard.js
    │   │   ├── Header.js
    │   │   └── Footer.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   └── PostDetail.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── App.css
    └── package.json
```

## Backend (Django) Setup

Prereqs: Python 3.8+.

1. Create venv, install deps, run migrations, and start server

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Backend endpoints:
- `GET /api/posts/` – Fetches posts (pulls from JSONPlaceholder, caches in DB)
- `POST /api/posts/` – Create a post (in local DB)
- `GET /api/posts/<id>/` – Get single post
- `PUT /api/posts/<id>/` – Update post
- `DELETE /api/posts/<id>/` – Delete post

CORS is enabled for development in `backend/config/settings.py`.

## Frontend (React) Setup

Prereqs: Node 16+ (Create React App used). If you’re on Node 16, we pinned `react-router-dom@^6`.

1. Install dependencies

```bash
cd frontend
npm install
```

2. Start dev server

```bash
npm start
```

The frontend expects the backend at `http://localhost:8000`. API base URL is set in `frontend/src/services/api.js`.

## Tech Stack
- Backend: Django 4.2, Django REST Framework, django-cors-headers, requests
- Frontend: React, React Router, Bootstrap 5, React-Bootstrap, Framer Motion

## Notes
- Images are placeholders via Picsum.
- Animations: Framer Motion used for card and heading transitions.
- For production, restrict CORS and configure environment variables.
