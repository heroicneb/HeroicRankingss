#!/usr/bin/env python3
"""Generate ambient loops of the About-section columns with Higgsfield (Kling 2.5 turbo).

Usage:
  HF_KEY="$(grep '^HF_KEY=' .env.local | cut -d= -f2- | tr -d '"')" python3 scripts/media/higgsfield-about-loops.py submit
  HF_KEY=... python3 scripts/media/higgsfield-about-loops.py poll      # downloads finished clips

The source image is transparent, so it is flattened onto the light (#fff) and dark (#000)
page backgrounds and one clip is generated per theme. Outputs land in scripts/media/out/.
Requires Pillow. Costs Higgsfield credits per clip.
"""
import json, os, pathlib, sys, time, urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).resolve().parent / "out"
OUT.mkdir(exist_ok=True)
JOBS = OUT / "jobs.json"
API = "https://api.higgsfield.ai"
MODEL = "/kling-video/v2.5-turbo/standard/image-to-video"
KEY = os.environ.get("HF_KEY", "")
if not KEY or ":" not in KEY:
    sys.exit("HF_KEY (key_id:key_secret) must be set in the environment")

PROMPT = (
    "Static locked-off shot of three broken white marble Ionic column fragments suspended in place on a plain solid background. "
    "Extremely subtle, slow motion only: a gentle slow camera push-in, soft studio light drifting slowly across the marble surfaces, "
    "a few faint dust motes drifting in the air. The columns stay perfectly still and keep their exact shape and position. "
    "Nothing new appears. The background stays a perfectly flat solid color. Elegant, calm, premium."
)
NEGATIVE = (
    "morphing, warping, deformation, new objects, extra columns, text, watermark, flicker, fast motion, "
    "camera shake, people, hands, background gradient, background texture, color shift"
)
VARIANTS = {"light": (255, 255, 255), "dark": (0, 0, 0)}


def call(method, url, data=None, headers=None, raw=None, auth=True):
    # WHY: Cloudflare in front of the API rejects Python's default User-Agent (error 1010).
    h = {"User-Agent": "curl/8.7.1", "Accept": "*/*"}
    if auth:
        h["Authorization"] = f"Key {KEY}"
    h.update(headers or {})
    body = raw if raw is not None else (json.dumps(data).encode() if data is not None else None)
    if data is not None:
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=body, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            t = r.read()
            return r.status, (json.loads(t) if t.strip().startswith(b"{") else t)
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:500]


def flatten(name, rgb):
    src = Image.open(ROOT / "public/figma/about/about-main.webp").convert("RGBA")
    flat = Image.new("RGB", src.size, rgb)
    flat.paste(src, mask=src.getchannel("A"))
    path = OUT / f"about-columns-{name}.png"
    flat.save(path, optimize=True)
    return path


def upload(path):
    st, up = call("POST", f"{API}/files/generate-upload-url", {"content_type": "image/png"})
    assert st in (200, 201), (st, up)
    # WHY: the presigned S3 PUT must carry only the headers it was signed with — no API auth header.
    st2, body = call("PUT", up["upload_url"], headers=dict(up["upload_headers"]), raw=path.read_bytes(), auth=False)
    assert st2 in (200, 201, 204), (st2, body)
    return up["public_url"]


def submit():
    jobs = json.loads(JOBS.read_text()) if JOBS.exists() else {}
    for name, rgb in VARIANTS.items():
        image_url = upload(flatten(name, rgb))
        st, res = call("POST", f"{API}{MODEL}", {
            "prompt": PROMPT, "image_url": image_url, "duration": 5, "cfg_scale": 0.5, "negative_prompt": NEGATIVE,
        })
        if st >= 300:
            print(name, "submit failed:", st, res)
            continue
        jobs[name] = {"request_id": res["request_id"], "status_url": res.get("status_url"), "image_url": image_url}
        print(name, "queued", res["request_id"])
    JOBS.write_text(json.dumps(jobs, indent=2))


def poll():
    jobs = json.loads(JOBS.read_text())
    while True:
        pending = False
        for name, job in jobs.items():
            if job.get("file"):
                continue
            st, res = call("GET", f"{API}/requests/{job['request_id']}/status")
            status = res.get("status") if isinstance(res, dict) else res
            print(name, st, status)
            if status == "completed":
                media = (res.get("videos") or res.get("video") or res.get("images") or [])
                if isinstance(media, dict):
                    media = [media]
                url = media[0]["url"] if media else None
                if not url:
                    print(name, "completed but no url in", res)
                    continue
                target = OUT / f"about-columns-{name}.mp4"
                with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "curl/8.7.1"})) as r:
                    target.write_bytes(r.read())
                job["file"] = str(target)
                print(name, "saved", target, target.stat().st_size // 1024, "KB")
            elif status in ("failed", "nsfw", "canceled"):
                print(name, "terminal:", res)
                job["file"] = None
            else:
                pending = True
        JOBS.write_text(json.dumps(jobs, indent=2))
        if not pending:
            break
        time.sleep(10)


if __name__ == "__main__":
    {"submit": submit, "poll": poll}[sys.argv[1] if len(sys.argv) > 1 else "submit"]()
