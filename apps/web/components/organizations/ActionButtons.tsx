type Props = {
  id: string;
};

export default function ActionButtons({ id }: Props) {
  return (
    <div className="flex gap-2">
      <button
        className="rounded-lg bg-blue-600 px-3 py-1 text-sm hover:bg-blue-500"
      >
        Edit
      </button>

      <button
        className="rounded-lg bg-red-600 px-3 py-1 text-sm hover:bg-red-500"
      >
        Delete
      </button>
    </div>
  );
}
