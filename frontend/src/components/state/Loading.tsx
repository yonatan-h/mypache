import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Loading({
  isLoading,
  className = "",
}: {
  isLoading: boolean;
  className?: string;
}) {
  if (!isLoading) return null;
  return <AiOutlineLoading3Quarters className={`animate-spin ${className}`} />;
}
