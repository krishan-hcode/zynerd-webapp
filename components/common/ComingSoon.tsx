interface ComingSoonProps {
  title?: string;
}

export default function ComingSoon({title = 'Coming Soon'}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h2 className="text-2xl font-semibold text-primary-dark mb-2">{title}</h2>
      <p className="text-customGray-60 text-center">Is coming soon</p>
    </div>
  );
}
