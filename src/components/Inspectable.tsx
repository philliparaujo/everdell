import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function Inspectable({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center text-center z-50 bg-inspect-background"
      onClick={onClose}
    >
      <div
        className="flex gap-8 p-6 rounded-xl max-w-[80%] max-h-[80%] overflow-x-auto bg-inspect"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}

export default Inspectable;
