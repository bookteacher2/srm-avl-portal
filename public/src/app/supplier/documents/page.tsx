"use client";

import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { FileUploadCard } from "@/components/shared/file-upload-card";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { applicationService, configService, documentService, supplierService } from "@/lib/services";
import type { DocumentSection } from "@/types";

const SECTION_META: Record<DocumentSection, { title: string; description: string }> = {
  MANDATORY: {
    title: "Required Documents",
    description: "Requested now that you are qualified — please upload each item.",
  },
  AVL_EVALUATION: {
    title: "AVL Evaluation Documents",
    description: "Strengthen your qualification and scoring.",
  },
  SUPPORTING: {
    title: "Supporting Documents",
    description: "Optional evidence of experience and capability.",
  },
};

// Documents are only collected after a Qualified decision (Revision 1.1).
const DOCUMENT_STAGES = ["DOCUMENT_UPLOAD", "DOCUMENT_VERIFICATION", "AVL_APPROVED"];

export default function DocumentsPage() {
  const { user } = useAuth();
  const supplierId = user?.supplierId ?? "";

  const { data, loading, error } = useAsync(async () => {
    const supplier = await supplierService.getById(supplierId);
    if (!supplier) return null;
    const application = await applicationService.currentForSupplier(supplierId);
    const unlocked =
      !!application && DOCUMENT_STAGES.includes(application.currentStage);
    if (!unlocked) return { unlocked: false as const, requirements: [], byReq: new Map() };
    const [requirements, docs] = await Promise.all([
      configService.documentRequirements(supplier.supplierTypeId),
      documentService.listBySupplier(supplierId),
    ]);
    const byReq = new Map(docs.map((d) => [d.requirementId, d]));
    return { unlocked: true as const, requirements, byReq };
  }, [supplierId]);

  const sections: DocumentSection[] = ["MANDATORY", "AVL_EVALUATION", "SUPPORTING"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Documents are requested after your presentation and a Qualified decision. Expiring items are flagged 90 days ahead."
      />
      <DataState loading={loading} error={error}>
        {data && !data.unlocked ? (
          <EmptyState
            icon={Lock}
            title="Documents not required yet"
            description="You will be asked to upload documents once you have presented and been qualified by the committee. Track your progress on the Application page."
          />
        ) : null}
        {data && data.unlocked ? (
          <div className="space-y-6">
            {sections.map((section) => {
              const reqs = data.requirements.filter((r) => r.section === section);
              if (!reqs.length) return null;
              return (
                <Card key={section}>
                  <CardHeader>
                    <CardTitle>{SECTION_META[section].title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{SECTION_META[section].description}</p>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    {reqs.map((req) => (
                      <FileUploadCard key={req.id} requirement={req} document={data.byReq.get(req.id)} />
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}
      </DataState>
    </div>
  );
}
