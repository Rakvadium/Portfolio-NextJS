import type { Site } from "@/app/data/site";
import { mapNonEmpty } from "@/lib/non-empty";
import { RoleAccordion } from "./role-accordion";
import { RoleDetail, RoleSummary } from "./role-detail";
import { RoleExplorer } from "./role-explorer";

export function Experience({ roles }: { roles: Site["roles"] }) {
  const explorerItems = mapNonEmpty(roles, (role) => ({
    id: role.id,
    tab: <RoleSummary role={role} variant="tab" />,
    panel: <RoleDetail role={role} />,
  }));
  const accordionItems = mapNonEmpty(roles, (role) => ({
    id: role.id,
    summary: <RoleSummary role={role} variant="summary" />,
    body: <RoleDetail role={role} compact />,
  }));
  return (
    <>
      <div className="hidden lg:block">
        <RoleExplorer items={explorerItems} />
      </div>
      <div className="lg:hidden">
        <RoleAccordion items={accordionItems} />
      </div>
    </>
  );
}
