import { PageFrame } from "@/components/layout/PageFrame";
import { CompareWorkspace } from "./CompareWorkspace";

export default function ComparePage() {
  return (
    <PageFrame
      eyebrow="Compare"
      title="Side by side"
      description="Hold up to four residences or projects together. Comparison works without an account — sign in to keep it."
    >
      <CompareWorkspace />
    </PageFrame>
  );
}
