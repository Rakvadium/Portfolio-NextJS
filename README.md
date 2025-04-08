# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features include dark mode support, smooth animations, and a mobile-friendly design.

## Features

- 🎨 Modern and clean design
- 🌓 Dark mode support
- 📱 Fully responsive
- ⚡ Smooth animations with Framer Motion
- 🎯 SEO optimized
- 🚀 Fast performance with Next.js

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Profile Information

Update your profile information in `app/page.tsx`:
- Profile picture
- Name and title
- Professional summary
- Skills
- Experience
- Projects

### Projects

Add your projects in the `projects` array in `app/page.tsx`:
```typescript
const projects = [
  {
    title: "Your Project",
    description: "Project description",
    technologies: ["React", "TypeScript", "Node.js"],
    imageUrl: "/project-image.jpg",
    projectUrl: "https://your-project.com",
    githubUrl: "https://github.com/yourusername/project",
  },
  // Add more projects...
];
```

### Theme

The website supports both light and dark themes. The theme toggle is available in the navigation bar, and the user's preference is saved in localStorage.

### Styling

The website uses Tailwind CSS for styling. You can customize the colors, spacing, and other design elements in the `tailwind.config.js` file.

## Deployment

The website can be easily deployed to Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy!

## Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React](https://reactjs.org/)

## License

This project is open source and available under the [MIT License](LICENSE).
