// Section body for #experience. Renders both layouts and CSS picks one: the two-pane explorer at lg+,
// the accordion below. display:none takes the other out of the accessibility tree.
// All role markup is rendered here, on the server, and handed to the client islands as slots.
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
