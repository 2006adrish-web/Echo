from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from flask import redirect

app = Flask(__name__)
CORS(app)
DB = "pulse.db"

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    
    c.execute("""
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        user TEXT NOT NULL
    )
    """)
    
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def home():
    return redirect("http://127.0.0.1:5500") 

@app.route("/post", methods=["POST"])
def add_post():
    data = request.json
    text = data.get("text","").strip()
    user = data.get("user","anomyous").strip()

    if not text:
        return jsonify({"error":"empty post"}),400

    conn = sqlite3.connect(DB)
    c = conn.cursor()

    c.execute(
        "INSERT INTO posts (text, user) VALUES (?, ?)",
        (text, user)
    )

    conn.commit()
    conn.close()

    return jsonify({"status": "ok"})

@app.route("/posts", methods=["GET"])
def get_posts():
    conn = sqlite3.connect(DB)
    c = conn.cursor()

    c.execute("SELECT * FROM posts ORDER BY id DESC")
    rows = c.fetchall()

    conn.close()
    return jsonify(rows)


        
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)



