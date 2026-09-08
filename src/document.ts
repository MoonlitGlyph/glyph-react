import { useEffect } from "react";

/** Set a browser title, optionally qualified by an application name. */
export function useDocumentTitle(pageTitle?: string, siteName = "") {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = pageTitle
      ? siteName
        ? `${pageTitle} | ${siteName}`
        : pageTitle
      : siteName;
  }, [pageTitle, siteName]);
}
