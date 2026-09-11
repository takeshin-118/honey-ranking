from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

PORT = 8000
ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

print("ハニーポイントランキングを起動しました")
print(f"ランキング: http://localhost:{PORT}/")
print(f"編集画面:   http://localhost:{PORT}/add-player/")
print("終了するときは Ctrl+C")

ThreadingHTTPServer(("127.0.0.1", PORT), SimpleHTTPRequestHandler).serve_forever()
