import {
  Palette,
  Code2,
  Share2,
  MousePointerClick,
  BarChart3,
  Search,
  Target,
  MessageSquare,
  LayoutTemplate,
  TrendingUp,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Palette,
  Code2,
  Share2,
  MousePointerClick,
  BarChart3,
  Search,
  Target,
  MessageSquare,
  LayoutTemplate,
  TrendingUp,
};

export default function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = map[name] ?? CheckCircle2;
  return <Cmp className={className} />;
}
