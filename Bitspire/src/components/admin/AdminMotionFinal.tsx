import type { ReactNode } from "react";

interface AdminMotionFinalProps {
  children: ReactNode;
}

export function AdminMotionFinal({ children }: AdminMotionFinalProps) {
  return (
    <div className="admin-motion-final" data-admin-motion-final="true">
      {children}
    </div>
  );
}
