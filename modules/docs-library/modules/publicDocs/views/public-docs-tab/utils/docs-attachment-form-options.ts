/**
 * Shared options for public-docs create folder / file forms when reused
 * from the library vs. project attachments (`projectId` from context).
 */

/** Hide optional password fields in project attachments; library keeps them visible. */
export function hidePasswordFieldForProjectScopedView(
  projectId?: string,
): boolean {
  return Boolean(projectId);
}

/** Library shows branch filter chips; project attachments tab does not. */
export function hideBranchesSectionForProjectScopedView(
  projectId?: string,
): boolean {
  return Boolean(projectId);
}
