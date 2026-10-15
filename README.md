# CogniFlow AI — Startup Landing Page & Claude Setup Guide

This directory contains the complete production-ready setup for your AI startup:
1. **Interactive AI Landing Page:** (`index.html`, `style.css`, `script.js`)
2. **Claude for Startups Application Kit:** (`CLAUDE_STARTUP_APPLICATION_PITCH.md`)

---

## 🌐 1. Local Preview
Aap is website ko apne computer par double click karke `index.html` open kar sakte ho kisi bhi browser me, ya Python simple server chala sakte ho:
```bash
python -m http.server 3000
```
Phir browser me open karo: `http://localhost:3000`

---

## 🚀 2. Free 1-Click Deployment (Vercel ya GitHub Pages)

### Option A: Vercel (Sabse easy)
1. [vercel.com](https://vercel.com) par jao aur apne GitHub se login karo.
2. **"Add New Project"** click karo aur is folder/repo ko import kar do.
3. **Deploy** button daba do — 30 seconds me live URL mil jayega (e.g. `cogniflow.vercel.app`).
4. Jab aapko Namecheap/Name.com se free domain mil jaye, toh Vercel Settings -> Domains me jakar apna domain connect kar dena.

---

## 📬 3. Zoho Free Business Email DNS Settings

Jab aap Namecheap/Name.com se free domain le loge, toh Zoho Mail par account banate waqt DNS records add karne honge:

### MX Records (Emails receive karne ke liye):
| Type | Host / Name | Value / Destination | Priority |
|---|---|---|---|
| MX | @ | `mx.zoho.in` (ya `mx.zoho.com`) | 10 |
| MX | @ | `mx2.zoho.in` (ya `mx2.zoho.com`) | 20 |
| MX | @ | `mx3.zoho.in` (ya `mx3.zoho.com`) | 50 |

### TXT Records (Domain verification & Anti-spam):
| Type | Host / Name | Value |
|---|---|---|
| TXT | @ | `v=spf1 include:zoho.in ~all` (ya `include:zoho.com ~all`) |

---

## 📝 4. Applying to Claude for Startups
Open `CLAUDE_STARTUP_APPLICATION_PITCH.md` in this directory to get pre-written answers for the application form!
