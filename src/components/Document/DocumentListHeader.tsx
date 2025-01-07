export type DocumentListHeaderProps = {
  heading: string;
};

export function DocumentListHeader({ heading }: DocumentListHeaderProps) {
  return (
    <h2 className="text-3xl md:text-3xl mt-6 mb-5 capitalize tracking-tight">
      {heading}
    </h2>
  );
}
