const PageHeader = ({ title, description, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
    <div className="flex-1 min-w-0">
      <h1 className="text-xl font-semibold tracking-tight text-fg">{title}</h1>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}
    </div>
    {actions}
  </div>
);

export default PageHeader;
