type Props = { title: string; subtitle?: string };

export function PageHero({ title, subtitle }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
        {subtitle && <p className="text-blue-200 text-lg max-w-xl mx-auto">{subtitle}</p>}
      </div>
    </div>
  );
}
