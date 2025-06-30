function Inspectable({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center text-center z-50 bg-inspect-background"
      onClick={onClose}
    >
      <div
        className="flex gap-8 p-6 rounded-xl max-w-[80%] max-h-[80%] overflow-hidden bg-inspect"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Inspectable;
