"use client";

import { useState } from "react";
import { FileText, UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DOCUMENT_STATUS } from "@/lib/labels";
import { expiryState } from "@/lib/domain/documents";
import { formatDate } from "@/lib/utils";
import type { DocumentRequirement, DocumentStatus, SupplierDocument } from "@/types";

interface FileUploadCardProps {
  requirement: DocumentRequirement;
  document?: SupplierDocument;
}

/**
 * A single document requirement card. Upload is mocked (no backend yet) but
 * the interaction is real: it transitions status and surfaces expiry state.
 */
export function FileUploadCard({ requirement, document }: FileUploadCardProps) {
  const [status, setStatus] = useState<DocumentStatus>(
    document?.status ?? "NOT_UPLOADED",
  );
  const [fileName, setFileName] = useState<string | undefined>(
    document?.versions.find((v) => v.isCurrent)?.fileName,
  );
  const [busy, setBusy] = useState(false);

  const meta = DOCUMENT_STATUS[status];
  const expiry = expiryState(document?.expiryDate);

  function handleUpload() {
    setBusy(true);
    // Simulated upload — replace with storage.upload() when backend lands.
    setTimeout(() => {
      setFileName(`${requirement.docKey}.pdf`);
      setStatus("UPLOADED");
      setBusy(false);
    }, 900);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">{requirement.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{requirement.description}</p>
          </div>
        </div>
        <Badge variant={requirement.isMandatory ? "destructive" : "muted"}>
          {requirement.isMandatory ? "Mandatory" : "Optional"}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={meta.variant}>{meta.label}</Badge>
          {fileName ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {fileName}
            </span>
          ) : null}
          {requirement.hasExpiry && document?.expiryDate ? (
            <span
              className={
                expiry === "EXPIRED"
                  ? "text-xs font-medium text-destructive"
                  : expiry === "EXPIRING_SOON"
                    ? "text-xs font-medium text-warning-foreground"
                    : "text-xs text-muted-foreground"
              }
            >
              Expires {formatDate(document.expiryDate)}
            </span>
          ) : null}
        </div>
        <Button size="sm" variant="outline" onClick={handleUpload} disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          {fileName ? "Replace" : "Upload"}
        </Button>
      </div>
    </div>
  );
}
