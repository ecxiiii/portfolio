export function SectionWrapper({ children, id, gradient, className = '' }) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 lg:py-32 ${className}`}
      style={{ backgroundColor: gradient }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {children}
      </div>
    </section>
  );
}
