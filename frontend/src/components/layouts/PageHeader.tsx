type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-2">

      <h1 className="text-[58px] font-bold leading-none tracking-[-0.03em] text-[#0F172A]">

        {title}

      </h1>

      {description && (

        <p className="mt-3 text-xl text-[#64748B]">

          {description}

        </p>

      )}

    </div>
  );
}