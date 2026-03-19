export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-brass)] px-6 py-8 text-center text-sm text-[var(--color-foreground)]/80">
      © {new Date().getFullYear()} waste a dollar.
    </footer>
  );
}
