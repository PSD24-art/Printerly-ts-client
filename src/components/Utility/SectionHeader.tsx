import Badge from "./Badge";
interface sectionItems {
  title?: string;
  subtitle?: string;
  centered?: boolean;
  badge?: string;
}
const SectionHeader = ({ title, subtitle, centered = true, badge }: sectionItems) => (
  <div className={`mb-12 ${centered ? "text-center flex flex-col items-center" : "max-w-2xl"}`}>
    {badge && (
      <Badge variant="blue" className="mb-4">
        {badge}
      </Badge>
    )}
    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">{subtitle}</p>}
  </div>
);

export default SectionHeader;
