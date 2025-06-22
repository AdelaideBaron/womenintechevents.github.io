# [womenintechevents.github.io](https://adelaidebaron.github.io/womenintechevents.github.io/)

A simple webpage for showcasing opportunities for all in tech — events, courses, programs, and more — all in one place. Highlighting events targeted at women. 

<details>
  <summary>Includes opportunities like:</summary>

- Online and global events
- Regional/local meetups
- Tech courses and upskilling programs
- Mentorship opportunities
- Grants, bursaries & scholarships
- Online resources
- Community and networking events

</details>

---

## ✨ Submitting an Event or Course

I use **Google Forms** to collect new events and learning opportunities.

- 👉 [Submit an event](https://docs.google.com/forms/d/1ddbjShFsWmDSXdW9e_uVGQllfLwNbXxrRkOkH818sa8/viewform)
- 👉 [Submit a course or learning opportunity](https://forms.gle/5NernY5jdfXjhpaFA)

All submissions are reviewed and automatically published once approved.

Thank you for contributing to the community! 💛

---

## 🔄 How This Page Updates

This site uses a GitHub Action to pull new events and courses submitted through Google Forms every day at midnight UTC.

Scripts are located in the `/cloud_integration` directory and handle:

- Fetching data from Google Sheets
- Appending valid entries to `events.json` and `courses.json`
- Committing updates to this repo

If you're curious about how it works, check the [GitHub Actions workflow](.github/workflows/get-event-course-submissions.yml)

---

## 🧑‍💻 Contributing to the Codebase

If you'd like to contribute to the code (not just course/event data), feel free to:

1. Fork this repo
2. Create a branch in your fork
3. Make your changes
4. Open a pull request back to this repo  
   _(Request @adelaidebaron as a reviewer)_

---

# Development

## 🖥 Local Development

To preview or develop locally, recommended VS Code extensions:

- Live Server (by Ritwick Dey)
- Prettier – Code formatter (by Prettier)

---

## ☁️ Google Cloud Integration

The `/cloud_integration` directory contains scripts for syncing event/course submissions from Google Sheets via service account authentication.

---

**_Made by [@codeaddi](https://www.instagram.com/codeaddi/)_**
