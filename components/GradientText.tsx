export default function GradientText({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`bg-gradient-to-r from-brand-accent to-brand-accent2 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  )
}
