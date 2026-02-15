"use client";

import AranzmaniEditor from "../../../components/aranzmani-editor";
import { useSitePreferences } from "../../../components/site-preferences-provider";

export default function AdminAranzmaniPage() {
  const { language } = useSitePreferences();

  return (
    <AranzmaniEditor
      title={language === "sr" ? "Aranzmani Editor" : "Arrangements Editor"}
      description={
        language === "sr"
          ? "Uredjivanje hero slajdova i prikaza za stranicu Aranzmani. Svaka izmena ide direktno u live Convex bazu."
          : "Manage hero slides and presentation for the Arrangements page. Every save writes directly to the live Convex database."
      }
    />
  );
}
