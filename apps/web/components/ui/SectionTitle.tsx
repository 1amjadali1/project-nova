type Props = {
  title: string;
};

export default function SectionTitle({ title }: Props) {
  return (
    <h2 className="mb-4 text-xl font-semibold text-white">
      {title}
    </h2>
  );
}
