"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, ImagePlus, MessageSquare, Pencil, Trash2, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

import {
  DesignCommentResponse,
  DesignVersionResponse,
  addDesignComment,
  approveDesign,
  deleteDesignComment,
  designFileUrl,
  editDesignComment,
  listDesignComments,
  listDesignVersions,
  requestDesignRevision,
  uploadDesignVersion,
} from "@/lib/api";
import type { ViewerRole } from "./JobDetailView";

export default function JobDesignsCard({
  jobId,
  viewerRole,
  canManage,
}: {
  jobId: number;
  viewerRole: ViewerRole;
  canManage: boolean;
}) {
  const { showToast } = useToast();
  const [versions, setVersions] = useState<DesignVersionResponse[]>([]);
  const [comments, setComments] = useState<DesignCommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [actionError, setActionError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const latestVersion = versions[versions.length - 1] ?? null;

  const refetch = useCallback(async () => {
    setError("");
    try {
      const versionList = await listDesignVersions(jobId);
      setVersions(versionList);

      const latest = versionList[versionList.length - 1];
      if (latest) {
        const commentList = await listDesignComments(latest.id);
        setComments(commentList);
      } else {
        setComments([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load designs.");
    }
  }, [jobId]);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setPendingFile(file);
  }

  async function handleUpload(applyWatermark: boolean) {
    if (!pendingFile) return;

    setIsUploading(true);
    setActionError("");

    try {
      await uploadDesignVersion(jobId, pendingFile, applyWatermark);
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleApprove() {
    if (!latestVersion) return;
    setActionError("");
    try {
      await approveDesign(latestVersion.id);
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to approve design.");
    }
  }

  async function handleAddComment(isRevisionRequest: boolean) {
    if (!latestVersion || !commentText.trim()) return;

    setIsSubmittingComment(true);
    setActionError("");

    try {
      if (isRevisionRequest) {
        await requestDesignRevision(latestVersion.id, commentText.trim());
      } else {
        await addDesignComment(latestVersion.id, commentText.trim());
      }
      setCommentText("");
      await refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to submit comment."
      );
    } finally {
      setIsSubmittingComment(false);
    }
  }

  function startEdit(comment: DesignCommentResponse) {
    setEditingId(comment.id);
    setEditingText(comment.comment);
  }

  async function saveEdit(commentId: number) {
    try {
      await editDesignComment(commentId, editingText.trim());
      setEditingId(null);
      await refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to update comment.", "error");
    }
  }

  async function handleDeleteComment(commentId: number) {
    try {
      await deleteDesignComment(commentId);
      showToast("Comment deleted.");
      await refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to delete comment.", "error");
    }
  }

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Design Versions
          </h2>

          {canManage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.pdf"
                className="hidden"
                onChange={handleFileSelected}
              />
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#0F172A] hover:bg-[#1E293B]"
              >
                <ImagePlus size={16} className="mr-2" />
                {isUploading ? "Uploading..." : "Upload New Version"}
              </Button>
            </>
          )}
        </div>

        {loading && (
          <p className="mt-4 text-sm text-[#94A3B8]">Loading designs...</p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && versions.length === 0 && (
          <p className="mt-4 text-sm text-[#94A3B8]">No design versions yet.</p>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {versions.map((version) => (
            <div
              key={version.id}
              className="rounded-xl border border-[#EAEAEA] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#0F172A]">
                  Version {version.version_number}
                </p>
                <StatusBadge status={version.status} />
              </div>

              <p className="mt-1 text-xs text-[#94A3B8]">
                Uploaded by {version.uploaded_by_name} on{" "}
                {new Date(version.uploaded_at).toLocaleDateString()}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={designFileUrl(version.id, "watermarked")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[#FF6B00] hover:underline"
                >
                  View Preview
                </a>

                {version.has_original_access && (
                  <a
                    href={designFileUrl(version.id, "original")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#0F172A] hover:underline"
                  >
                    <Download size={12} />
                    Final File
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {actionError && (
          <p className="mt-4 text-sm text-red-600">{actionError}</p>
        )}

        {latestVersion && (
          <div className="mt-6 border-t border-[#F1F5F9] pt-5">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#94A3B8]" />
              <p className="text-sm font-semibold text-[#0F172A]">
                Comments & Feedback — Version {latestVersion.version_number}
              </p>
            </div>

            <div className="mt-3 space-y-3">
              {comments.length === 0 && (
                <p className="text-sm text-[#94A3B8]">No comments yet.</p>
              )}

              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg bg-[#FAFBFC] px-4 py-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[#0F172A]">
                      {comment.user_name}{" "}
                      <span className="ml-1 rounded bg-[#EAEAEA] px-1.5 py-0.5 text-[10px] font-medium uppercase text-[#64748B]">
                        {comment.user_role}
                      </span>
                      {comment.is_revision_request && (
                        <span className="ml-2 text-[10px] font-medium uppercase text-[#DC2626]">
                          Revision Request
                        </span>
                      )}
                      {comment.updated_at && (
                        <span className="ml-2 text-[10px] italic text-[#94A3B8]">
                          (edited)
                        </span>
                      )}
                    </p>

                    {editingId !== comment.id && (comment.can_edit || comment.can_delete) && (
                      <div className="flex shrink-0 items-center gap-1">
                        {comment.can_edit && (
                          <button
                            type="button"
                            onClick={() => startEdit(comment)}
                            className="rounded p-1 hover:bg-[#EAEAEA]"
                            aria-label="Edit comment"
                          >
                            <Pencil size={13} className="text-[#64748B]" />
                          </button>
                        )}
                        {comment.can_delete && (
                          <ConfirmDialog
                            trigger={
                              <button
                                type="button"
                                className="rounded p-1 hover:bg-red-50"
                                aria-label="Delete comment"
                              >
                                <Trash2 size={13} className="text-red-500" />
                              </button>
                            }
                            title="Delete this comment?"
                            description="This cannot be undone."
                            confirmLabel="Delete"
                            onConfirm={() => handleDeleteComment(comment.id)}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {editingId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        className="h-9 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(comment.id)}>
                          <Check size={13} className="mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          <X size={13} className="mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-[#334155]">{comment.comment}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                className="min-h-20"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddComment(false)}
                  disabled={isSubmittingComment || !commentText.trim()}
                >
                  Send Comment
                </Button>

                {viewerRole === "client" &&
                  latestVersion.status !== "Approved" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAddComment(true)}
                        disabled={isSubmittingComment || !commentText.trim()}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Request Revision
                      </Button>

                      <Button
                        size="sm"
                        onClick={handleApprove}
                        className="bg-[#16A34A] hover:bg-[#15803D]"
                      >
                        Approve Design
                      </Button>
                    </>
                  )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={!!pendingFile} onOpenChange={(open) => !open && setPendingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Watermark to Preview?</DialogTitle>
            <DialogDescription>
              The client will always see the preview version first. Choose whether it should
              carry a watermark, or be shown as-is until the client has fully paid.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleUpload(false)} disabled={isUploading}>
              No Watermark
            </Button>
            <Button
              onClick={() => handleUpload(true)}
              disabled={isUploading}
              className="bg-[#FF6B00] hover:bg-[#E65C00]"
            >
              {isUploading ? "Uploading..." : "Apply Watermark"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
