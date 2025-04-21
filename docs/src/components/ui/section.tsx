import { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, title, children, className = "" }: SectionProps) {
  return (
    <section className={`mb-16 ${className}`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-6" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

type SubsectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Subsection({
  id,
  title,
  children,
  className = "",
}: SubsectionProps) {
  return (
    <div className={`mb-10 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 my-4" id={id}>
        {title}
      </h3>
      {children}
    </div>
  );
}

type FeatureProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function Feature({ title, description, icon }: FeatureProps) {
  return (
    <div className="flex flex-col md:flex-row items-start p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      {icon && <div className="flex-shrink-0 mr-4">{icon}</div>}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
