export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            dotfiles
          </span>
          <span className="text-gray-600">·</span>
          <span className="text-sm text-gray-500">Paranjay</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a
            href="https://github.com/Paranjayy/dotfiles"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            GitHub
          </a>
          <span>Built with Next.js + Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
