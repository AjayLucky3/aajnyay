import http.server
import socketserver
import json
import sqlite3
import hashlib
import secrets
import os
import mimetypes
from urllib.parse import urlparse, parse_qs
from http.cookies import SimpleCookie

# Override sqlite3.connect to automatically inject timeout=10.0 for multithreaded requests
_original_connect = sqlite3.connect
def custom_connect(*args, **kwargs):
    if len(args) > 0 and args[0] == DB_FILE:
        kwargs.setdefault('timeout', 10.0)
    return _original_connect(*args, **kwargs)
sqlite3.connect = custom_connect


PORT = 8000
DB_FILE = 'aajnyay.db'
SESSIONS = {}  # session_token -> user_id (in-memory session store)

# --- DATABASE SETUP ---
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    # Create Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            language TEXT DEFAULT 'en',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create Legal Journeys Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS journeys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            case_id TEXT NOT NULL,
            title TEXT NOT NULL,
            answers_json TEXT NOT NULL,
            plan_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'Active',
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)
    
    # Create Bookmarks Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            item_id TEXT NOT NULL,
            item_type TEXT NOT NULL,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)
    
    # Create Voice Assistant History Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS voice_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            transcript TEXT NOT NULL,
            response_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)
    
    conn.commit()
    conn.close()

# --- PASSWORD HASHING ---
def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    hash_bytes = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}:{hash_bytes.hex()}"

def verify_password(password, stored_hash):
    try:
        salt, hashed = stored_hash.split(':')
        test_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
        return test_hash == hashed
    except ValueError:
        return False

# --- CUSTOM REQUEST HANDLER ---
class AajNyayRequestHandler(http.server.BaseHTTPRequestHandler):
    
    # helper for sending JSON responses
    def send_json(self, status, data, headers=None):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        if headers:
            for key, val in headers.items():
                self.send_header(key, val)
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
        
    def get_current_user_id(self):
        cookie_header = self.headers.get('Cookie')
        if not cookie_header:
            return None
        cookie = SimpleCookie()
        cookie.load(cookie_header)
        if 'session' not in cookie:
            return None
        session_token = cookie['session'].value
        return SESSIONS.get(session_token)

    def do_POST(self):
        url = urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        # Parse JSON payload
        try:
            payload = json.loads(post_data) if post_data else {}
        except json.JSONDecodeError:
            return self.send_json(400, {"success": False, "error": "Invalid JSON payload"})
            
        # --- API: Auth Register ---
        if url.path == '/api/auth/register':
            name = payload.get('name')
            email = payload.get('email')
            password = payload.get('password')
            
            if not name or not email or not password:
                return self.send_json(400, {"success": False, "error": "All fields are required"})
                
            if len(password) < 6:
                return self.send_json(400, {"success": False, "error": "Password must be at least 6 characters"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            try:
                p_hash = hash_password(password)
                cursor.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", (name, email.lower(), p_hash))
                conn.commit()
                return self.send_json(201, {"success": True, "message": "User registered successfully"})
            except sqlite3.IntegrityError:
                return self.send_json(400, {"success": False, "error": "Email address already exists"})
            finally:
                conn.close()
                
        # --- API: Auth Login ---
        elif url.path == '/api/auth/login':
            email = payload.get('email')
            password = payload.get('password')
            
            if not email or not password:
                return self.send_json(400, {"success": False, "error": "Email and password are required"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, password_hash FROM users WHERE email = ?", (email.lower(),))
            user = cursor.fetchone()
            conn.close()
            
            if user and verify_password(password, user[2]):
                # Create session
                session_token = secrets.token_hex(32)
                SESSIONS[session_token] = user[0]
                
                # Send session cookie
                cookie = SimpleCookie()
                cookie['session'] = session_token
                cookie['session']['path'] = '/'
                cookie['session']['httponly'] = True
                cookie['session']['samesite'] = 'Strict'
                
                cookie_str = cookie.output(header='').strip()
                return self.send_json(200, {
                    "success": True, 
                    "user": {"id": user[0], "name": user[1], "email": email}
                }, {"Set-Cookie": cookie_str})
            else:
                return self.send_json(401, {"success": False, "error": "Invalid email or password"})
                
        # --- API: Auth Logout ---
        elif url.path == '/api/auth/logout':
            cookie_header = self.headers.get('Cookie')
            if cookie_header:
                cookie = SimpleCookie()
                cookie.load(cookie_header)
                if 'session' in cookie:
                    session_token = cookie['session'].value
                    if session_token in SESSIONS:
                        del SESSIONS[session_token]
            
            # Expire session cookie
            cookie = SimpleCookie()
            cookie['session'] = ''
            cookie['session']['path'] = '/'
            cookie['session']['httponly'] = True
            cookie['session']['expires'] = 'Thu, 01 Jan 1970 00:00:00 GMT'
            
            return self.send_json(200, {"success": True}, {"Set-Cookie": cookie.output(header='').strip()})

        # --- API: Save Legal Journey ---
        elif url.path == '/api/journeys':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(401, {"success": False, "error": "Unauthorized"})
                
            case_id = payload.get('case_id')
            title = payload.get('title')
            answers = payload.get('answers')
            plan = payload.get('plan')
            
            if not case_id or not title or not answers or not plan:
                return self.send_json(400, {"success": False, "error": "Missing journey data"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO journeys (user_id, case_id, title, answers_json, plan_json)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, case_id, title, json.dumps(answers), json.dumps(plan)))
            conn.commit()
            conn.close()
            
            return self.send_json(201, {"success": True, "message": "Legal journey saved successfully"})
            
        # --- API: Add Bookmark ---
        elif url.path == '/api/bookmarks':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(401, {"success": False, "error": "Unauthorized"})
                
            item_id = payload.get('item_id')
            item_type = payload.get('item_type')
            title = payload.get('title')
            
            if not item_id or not item_type or not title:
                return self.send_json(400, {"success": False, "error": "Missing bookmark parameters"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            # Check if already bookmarked
            cursor.execute("SELECT id FROM bookmarks WHERE user_id = ? AND item_id = ? AND item_type = ?", (user_id, item_id, item_type))
            if cursor.fetchone():
                conn.close()
                return self.send_json(200, {"success": True, "message": "Already bookmarked"})
                
            cursor.execute("""
                INSERT INTO bookmarks (user_id, item_id, item_type, title)
                VALUES (?, ?, ?, ?)
            """, (user_id, item_id, item_type, title))
            conn.commit()
            conn.close()
            
            return self.send_json(201, {"success": True, "message": "Bookmark added"})
            
        # --- API: Add Voice History ---
        elif url.path == '/api/voice':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(401, {"success": False, "error": "Unauthorized"})
                
            transcript = payload.get('transcript')
            response_text = payload.get('response_text')
            
            if not transcript or not response_text:
                return self.send_json(400, {"success": False, "error": "Missing parameters"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("INSERT INTO voice_history (user_id, transcript, response_text) VALUES (?, ?, ?)", (user_id, transcript, response_text))
            conn.commit()
            conn.close()
            
            return self.send_json(201, {"success": True})
            
        # --- API: Update Profile Language / Name ---
        elif url.path == '/api/profile/update':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(401, {"success": False, "error": "Unauthorized"})
                
            name = payload.get('name')
            lang = payload.get('language')
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            if name:
                cursor.execute("UPDATE users SET name = ? WHERE id = ?", (name, user_id))
            if lang:
                cursor.execute("UPDATE users SET language = ? WHERE id = ?", (lang, user_id))
            conn.commit()
            conn.close()
            
            return self.send_json(200, {"success": True})

        else:
            return self.send_json(404, {"success": False, "error": "Not Found"})

    def do_GET(self):
        url = urlparse(self.path)
        
        # --- API: Get Auth Profile State ---
        if url.path == '/api/auth/state':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(200, {"authenticated": False})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT name, email, language FROM users WHERE id = ?", (user_id,))
            user = cursor.fetchone()
            conn.close()
            
            if user:
                return self.send_json(200, {
                    "authenticated": True,
                    "user": {"name": user[0], "email": user[1], "language": user[2]}
                })
            else:
                return self.send_json(200, {"authenticated": False})
                
        # --- API: Get User Profile Data ---
        elif url.path == '/api/profile':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(401, {"success": False, "error": "Unauthorized"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT name, email, language, created_at FROM users WHERE id = ?", (user_id,))
            user = cursor.fetchone()
            conn.close()
            
            return self.send_json(200, {
                "success": True,
                "user": {"name": user[0], "email": user[1], "language": user[2], "joined": user[3]}
            })

        # --- API: Get Legal Journeys ---
        elif url.path == '/api/journeys':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(401, {"success": False, "error": "Unauthorized"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT id, case_id, title, answers_json, plan_json, created_at, status FROM journeys WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            rows = cursor.fetchall()
            conn.close()
            
            journeys = []
            for row in rows:
                journeys.append({
                    "id": row[0],
                    "case_id": row[1],
                    "title": row[2],
                    "answers": json.loads(row[3]),
                    "plan": json.loads(row[4]),
                    "created_at": row[5],
                    "status": row[6]
                })
            return self.send_json(200, {"success": True, "journeys": journeys})
            
        # --- API: Get Bookmarks ---
        elif url.path == '/api/bookmarks':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(401, {"success": False, "error": "Unauthorized"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT id, item_id, item_type, title, created_at FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            rows = cursor.fetchall()
            conn.close()
            
            bookmarks = []
            for row in rows:
                bookmarks.append({
                    "id": row[0],
                    "item_id": row[1],
                    "item_type": row[2],
                    "title": row[3],
                    "created_at": row[4]
                })
            return self.send_json(200, {"success": True, "bookmarks": bookmarks})
            
        # --- API: Get Voice History ---
        elif url.path == '/api/voice':
            user_id = self.get_current_user_id()
            if not user_id:
                return self.send_json(401, {"success": False, "error": "Unauthorized"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT id, transcript, response_text, created_at FROM voice_history WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            rows = cursor.fetchall()
            conn.close()
            
            history = []
            for row in rows:
                history.append({
                    "id": row[0],
                    "transcript": row[1],
                    "response_text": row[2],
                    "created_at": row[3]
                })
            return self.send_json(200, {"success": True, "history": history})

        # --- API: Admin Logs Panel ---
        elif url.path == '/api/admin/users':
            user_id = self.get_current_user_id()
            # Basic authorization check: verify user ID == 1 is the first registered admin user
            if user_id != 1:
                return self.send_json(403, {"success": False, "error": "Forbidden: Admin access only"})
                
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, email, language, created_at FROM users")
            rows = cursor.fetchall()
            conn.close()
            
            users = []
            for row in rows:
                users.append({
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "language": row[3],
                    "joined": row[4]
                })
            return self.send_json(200, {"success": True, "users": users})

        # --- STATIC FILE ROUTING ---
        else:
            # Default to index.html if pointing to root path
            clean_path = url.path
            if clean_path == '/':
                clean_path = '/index.html'
                
            # Strip leading slash
            relative_path = clean_path.lstrip('/')
            
            # Verify file exists
            if os.path.exists(relative_path) and os.path.isfile(relative_path):
                # Guess correct content mime type
                mime_type, _ = mimetypes.guess_type(relative_path)
                if not mime_type:
                    mime_type = 'application/octet-stream'
                
                # Send file binary response
                self.send_response(200)
                self.send_header('Content-Type', mime_type)
                # Cache CSS/JS/Images for local speed, don't cache HTML files
                if relative_path.endswith('.html'):
                    self.send_header('Cache-Control', 'no-store, must-revalidate')
                else:
                    self.send_header('Cache-Control', 'max-age=3600')
                self.end_headers()
                
                with open(relative_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                # 404 Response HTML layout
                self.send_response(404)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(b"<h1>404 - Document Not Found</h1><p>AajNyay workspace could not locate this static path.</p>")

    def do_DELETE(self):
        url = urlparse(self.path)
        user_id = self.get_current_user_id()
        if not user_id:
            return self.send_json(401, {"success": False, "error": "Unauthorized"})
            
        # Parse query params for ID
        query = parse_qs(url.query)
        target_id = query.get('id', [None])[0]
        
        if not target_id:
            return self.send_json(400, {"success": False, "error": "Missing target ID"})
            
        # --- API: Delete saved journey ---
        if url.path == '/api/journeys':
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM journeys WHERE id = ? AND user_id = ?", (target_id, user_id))
            conn.commit()
            conn.close()
            return self.send_json(200, {"success": True, "message": "Legal journey deleted"})
            
        # --- API: Delete bookmark ---
        elif url.path == '/api/bookmarks':
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM bookmarks WHERE id = ? AND user_id = ?", (target_id, user_id))
            conn.commit()
            conn.close()
            return self.send_json(200, {"success": True, "message": "Bookmark removed"})
            
        else:
            return self.send_json(404, {"success": False, "error": "Not Found"})

# --- START THE WEB SERVER ---
if __name__ == '__main__':
    print("Initializing AajNyay Database...")
    init_db()
    
    # Configure custom request handler socket server
    handler = AajNyayRequestHandler
    # Allow port reuse
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    
    with socketserver.ThreadingTCPServer(("", PORT), handler) as httpd:
        print(f"AajNyay Platform Active at: http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.shutdown()
