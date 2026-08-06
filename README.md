# Ankit Pandey | Personal Portfolio 🚀

Welcome to the source code of my personal portfolio! This is an interactive, cinematic 3D web experience built to showcase my work as a full-stack developer and software engineering student.

You can check out the live site here: **[ankitpandey19.vercel.app](https://ankitpandey19.vercel.app)**

---

## 🛠️ Tech Stack

I kept the stack modern, fast, and completely focused on the frontend experience:
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Framer Motion (for smooth UI animations)
- **3D Graphics:** React Three Fiber & Three.js (for the interactive solar system)
- **Emails:** Resend (for handling contact forms and quote requests without needing a database)

---

## ✨ Features

- **Interactive 3D Solar System:** A fully navigable 3D galaxy on the home page.
- **Minimalist Resume:** A clean, Apple-inspired bento-box layout for my professional experience.
- **Serverless Contact Forms:** Visitors can send me emails or project quote requests directly from the site.
- **100% Static & Lightweight:** Completely stripped of heavy backend databases or docker containers for maximum performance on Vercel.

---

## 💻 How to Run Locally

If you want to clone this and run it on your own machine, it's super simple. 

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
   Create a `.env.local` file in the root directory and add your Resend API key if you want the contact forms to work:
   ```env
   RESEND_API_KEY=your_api_key_here
   NOTIFICATION_EMAIL_RECIPIENT=your_email@example.com
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open it up:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser to see the site in action!

---

## 📜 License

Feel free to take inspiration from the UI or code structure, but please don't straight-up copy my personal information or projects.
