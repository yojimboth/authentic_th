interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ${className}`}>
      {title && <h3 className="mb-3 text-base font-medium text-zinc-800">{title}</h3>}
      {children}
    </div>
  );
}