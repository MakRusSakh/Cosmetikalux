interface CountryFlagProps {
  countryCode: string;
  showLabel?: boolean;
  className?: string;
}

const countries: Record<string, { emoji: string; label: string }> = {
  KR: { emoji: '🇰🇷', label: 'Корея' },
  JP: { emoji: '🇯🇵', label: 'Япония' },
  CN: { emoji: '🇨🇳', label: 'Китай' },
  US: { emoji: '🇺🇸', label: 'США' },
};

const fallback = { emoji: '🌍', label: '' };

export default function CountryFlag({
  countryCode,
  showLabel = true,
  className = '',
}: CountryFlagProps) {
  const country = countries[countryCode.toUpperCase()] ?? fallback;

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm text-text-tertiary ${className}`}>
      <span className="text-base">{country.emoji}</span>
      {showLabel && country.label ? <span>{country.label}</span> : null}
    </span>
  );
}
