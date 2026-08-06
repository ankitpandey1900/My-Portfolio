<div align="center">
  <h1>🌌 Ankit Pandey | 3D Interactive Portfolio</h1>
  <p>A cinematic, fully interactive 3D web experience built to showcase my work as a full-stack developer and software engineering student.</p>

  <a href="https://ankitpandey19.vercel.app"><strong>View Live Site »</strong></a>
  
  <br />
  <br />

  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
</div>

---

## ✨ What makes this special?

This isn't just a standard scrolling website. It's built to be an **experience**. 

- 🪐 **Interactive 3D Solar System:** The home page features a fully navigable, WebGL-powered 3D galaxy where planets and orbits are dynamically rendered.
- 📱 **Apple-Inspired Bento Grids:** The `/resume` and `/freelance` pages use a beautifully minimalist, ultra-clean bento box layout that feels highly premium.
- ⚡ **Lightning Fast & Static:** I stripped out heavy backend databases. The site is 100% statically generated and lightning fast. 
- 📬 **Serverless Emails:** The contact forms and quote estimators use Resend to deliver messages directly to my inbox instantly without a database.

---

## 🛠️ The Tech Stack

I kept the stack modern and completely focused on delivering a buttery-smooth frontend experience:

- **Core:** Next.js (App Router) & React
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Framer Motion (for those smooth layout transitions)
- **3D Graphics:** React Three Fiber (R3F) & Drei
- **Infrastructure:** Hosted on Vercel, Emails by Resend

---

## 💻 Run it locally

Want to run this on your own machine? It's super simple. 

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ankitpandey1900/My-Portfolio.git
   cd My-Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Resend API key (if you want the contact forms to work):
   ```env
   RESEND_API_KEY=your_api_key_here
   NOTIFICATION_EMAIL_RECIPIENT=your_email@example.com
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` in your browser to see the 3D canvas spin up!

---

## 📜 License

Feel free to draw inspiration from the UI, animations, or 3D code structure! However, please do not directly copy my personal information, projects, or branding.
