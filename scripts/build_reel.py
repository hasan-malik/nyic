#!/usr/bin/env python3
"""Build ichooseny-app-reel.mp4 — a cinematic screen-capture reel of the live app.
Ken Burns zoom over hi-res stills + crossfades + branded title/end cards. No Runway needed."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio.v2 as imageio

OUT_W, OUT_H = 1280, 720
FPS = 24
OV = 12  # crossfade frames (0.5s)
ASPECT = OUT_W / OUT_H

NAVY = (13, 27, 76)
INK = (10, 19, 48)
GOLD = (240, 180, 41)
WHITE = (245, 247, 251)
EMER = (52, 211, 153)
GREY = (150, 165, 195)

FONT_PATHS_BOLD = [
    "/Library/Fonts/SF-Compact-Display-Black.otf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Unicode.ttf",
]
FONT_PATHS_REG = [
    "/Library/Fonts/SF-Compact-Display-Medium.otf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial Unicode.ttf",
]


def font(size, bold=True):
    for p in (FONT_PATHS_BOLD if bold else FONT_PATHS_REG):
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


def center_text(d, cx, y, txt, f, fill):
    bb = d.textbbox((0, 0), txt, font=f)
    w = bb[2] - bb[0]
    d.text((cx - w / 2, y), txt, font=f, fill=fill)
    return bb[3] - bb[1]


def card(lines):
    """lines: list of (text, size, color, bold). Returns a navy card PIL image."""
    img = Image.new("RGB", (OUT_W, OUT_H), NAVY)
    d = ImageDraw.Draw(img)
    # gold rule
    total_h = sum(s + 18 for (_, s, _, _) in lines)
    y = (OUT_H - total_h) / 2
    for (txt, s, color, bold) in lines:
        h = center_text(d, OUT_W / 2, y, txt, font(s, bold), color)
        y += s + 18
    return img


def lower_third(frame_img, txt):
    if not txt:
        return frame_img
    d = ImageDraw.Draw(frame_img, "RGBA")
    f = font(34, True)
    bb = d.textbbox((0, 0), txt, font=f)
    w = bb[2] - bb[0]
    pad = 22
    bx0 = OUT_W / 2 - w / 2 - pad
    by0 = OUT_H - 96
    d.rounded_rectangle([bx0, by0, OUT_W / 2 + w / 2 + pad, by0 + 56], radius=12,
                        fill=(10, 19, 48, 205))
    d.text((OUT_W / 2 - w / 2, by0 + 8), txt, font=f, fill=GOLD)
    return frame_img


def kb_frames(src, fx, fy, z0, z1, dur, caption=None):
    """Yield np frames: Ken Burns zoom on a still cropped to output aspect."""
    sw, sh = src.size
    # base crop (aspect-correct) at zoom 1
    if sw / sh > ASPECT:
        base_h = sh
        base_w = sh * ASPECT
    else:
        base_w = sw
        base_h = sw / ASPECT
    n = max(1, int(dur * FPS))
    out = []
    for i in range(n):
        t = i / max(1, n - 1)
        z = z0 + (z1 - z0) * t
        cw, ch = base_w / z, base_h / z
        cx, cy = fx * sw, fy * sh
        x0 = min(max(cx - cw / 2, 0), sw - cw)
        y0 = min(max(cy - ch / 2, 0), sh - ch)
        crop = src.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch)))
        frame = crop.resize((OUT_W, OUT_H), Image.LANCZOS)
        frame = lower_third(frame, caption)
        out.append(np.asarray(frame.convert("RGB")))
    return out


R = "/tmp/reel-{}.png"
# (image, focal_x, focal_y, z0, z1, dur, caption)  — cards passed as PIL imgs
title = card([
    ("#IChooseNY", 88, GOLD, True),
    ("#IChooseYou", 44, WHITE, True),
    ("Belonging isn't a transaction.", 30, GREY, True),
])
endcard = card([
    ("3,700+ voices · 120+ countries · 20 languages", 30, WHITE, True),
    ("#IChooseNY", 80, GOLD, True),
    ("ichooseny.netlify.app", 30, EMER, True),
])

segments = [
    (title, 0.5, 0.5, 1.0, 1.08, 2.4, None),
    (Image.open(R.format("home")).convert("RGB"), 0.35, 0.45, 1.05, 1.18, 2.6, None),
    (Image.open(R.format("origins")).convert("RGB"), 0.30, 0.55, 1.0, 1.22, 3.0, "120+ countries.  One city."),
    (Image.open(R.format("statewide")).convert("RGB"), 0.45, 0.55, 1.18, 1.0, 2.6, "All of New York — Buffalo to Long Island."),
    (Image.open(R.format("threads")).convert("RGB"), 0.5, 0.6, 1.05, 1.2, 2.6, "AI-drawn kinship between every story."),
    (Image.open(R.format("detail")).convert("RGB"), 0.4, 0.4, 1.0, 1.12, 2.6, "Every voice — fully consented."),
    (Image.open(R.format("dash")).convert("RGB"), 0.45, 0.4, 1.12, 1.0, 2.6, "A living archive — and a needs-assessment."),
    (Image.open(R.format("cost")).convert("RGB"), 0.4, 0.45, 1.0, 1.14, 2.4, "The entire AI pipeline: about $79."),
    (endcard, 0.5, 0.5, 1.08, 1.0, 3.0, None),
]

out = "/Users/hasanmalik/Desktop/nyic/ichooseny-app-reel.mp4"
writer = imageio.get_writer(out, fps=FPS, codec="libx264", quality=8,
                            macro_block_size=None, ffmpeg_params=["-pix_fmt", "yuv420p"])

tail = None
for idx, (src, fx, fy, z0, z1, dur, cap) in enumerate(segments):
    cur = kb_frames(src, fx, fy, z0, z1, dur, cap)
    if tail is None:
        for f in cur[:-OV]:
            writer.append_data(f)
    else:
        for k in range(OV):
            a = tail[k].astype(np.float32)
            b = cur[k].astype(np.float32)
            alpha = (k + 1) / (OV + 1)
            writer.append_data((a * (1 - alpha) + b * alpha).astype(np.uint8))
        for f in cur[OV:-OV]:
            writer.append_data(f)
    tail = cur[-OV:]
for f in tail:
    writer.append_data(f)
writer.close()
print("saved", out)
