# Chatbot page MCP tools extension
_Exported on 3/26/2026 at 16:58:57 GMT+8 from Cursor (2.6.21)_

---

**User**

check @productspecs/Specification/AIAgent-MCP.md doc, extend current @chatbotpage/src/Components/Functions/CFunctionsPage.tsx add MCP tools to the functions table, add manage MCP proviers feature, reference @chatbotpage/design docs 
follow @chatbotpage/.cursor/rules/comm100-framework-ui.mdc rules
1. list out all features need add
2. list out all pages/drawers need to change or create
3. design details of each page/drawer list out all components need to use

---

**Cursor**

I’m reviewing the MCP specification, the current functions page implementation, and the relevant design docs first so I can turn this into a concrete feature/page design plan without guessing.

I’ve confirmed the current Functions area is a full-page list/form hybrid, while the MCP spec introduces a unified table plus server-management drawers. There’s one scope ambiguity I need to pin down before I can produce an accurate plan.

**Clarify MCP Scope**

> **When you say `manage MCP providers`, which product surface do you want the plan to target?**
> - Manage agent-connected MCP servers/connections inside the AI Agent UI (matches the spec’s server-management flow) ✔
> - Manage the global MCP provider catalog itself as a separate admin surface
> - Include both server management and provider-catalog management

> **How broad should this plan be?**
> - Only the Functions area: unified functions table + MCP connect/manage flows needed directly from that page ✔
> - Functions area plus adjacent dependent surfaces called out by the spec, like Overview counts and Topic function/server selection
> - Map the broader v1 MCP UI from the spec, even beyond the Functions area

I’ve narrowed the scope to the existing Functions surface plus the MCP connection/tool management flows launched from it. I’m pulling the exact code and design references now so the plan can point to the right page and drawer patterns.

I have the scope pinned down: keep this inside the existing Functions host, add MCP connection/server management there, and treat provider selection as part of the connect flow rather than a separate admin page. I’m packaging that into a concrete implementation/design plan now.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (76) what is Reconnect action?

---

**Cursor**

I’m checking the exact spec language around `Reconnect` so I can define it precisely in the plan context rather than hand-wave it.

The plan file line marker looks off, but I found the actual `Reconnect` requirement in the MCP spec and it’s specific enough to define the intended behavior.

In this plan, `Reconnect` means:

Re-establish the connection for an already-added MCP server that has gone into a `Disconnected` state. It is not “add a new provider/server again,” and it is not the same as a normal `Sync`.

Per [`productspecs/Specification/AIAgent-MCP.md`](c:/Users/roy/src/productspecs/Specification/AIAgent-MCP.md), when a server is disconnected:
- the server still appears in `Manage MCP Servers`
- its MCP functions still stay in the unified functions table
- those functions are marked unavailable / not callable
- the UI should show a `Reconnect` action

The intended behavior should be:
- `Reconnect` is shown for disconnected MCP servers in the `Manage MCP Servers` drawer
- clicking it resumes the existing connection record instead of creating a duplicate one
- for a prebuilt provider connection, it re-runs the auth flow for that provider
- for a custom MCP server, it retries or reopens the existing endpoint + credential setup, ideally prefilled
- after success, the server returns to connected status and a sync refreshes tool/function availability

The simplest product definition is:

`Sync` = refresh tools for a healthy connection  
`Reconnect` = repair a broken/disconnected connection  
`Add Functions via MCP` = create a brand new MCP server connection

If you want, I can tighten the plan wording and explicitly define `Reconnect` as `Reconnect existing disconnected MCP server connection` so it is less ambiguous.

---

**User**

so reconnect and sync will not display for the same server at the same time?

---

**Cursor**

Correct. In the design, `Sync` and `Reconnect` should be mutually exclusive for a given server state.

The clean mapping is:
- `Connected` server: show `Sync`
- `Disconnected` server: show `Reconnect`

That matches the spec’s state guidance in [`productspecs/Specification/AIAgent-MCP.md`](c:/Users/roy/src/productspecs/Specification/AIAgent-MCP.md), which calls out:
- disconnected server -> show `Reconnect`
- healthy connected server management -> `Sync`

So I would not display both on the same server row at the same time, because:
- `Sync` means refresh tools for an already working connection
- `Reconnect` means repair a broken connection first

One nuance: if a server is technically still connected but the last sync failed, the UI could still show `Sync` plus an error/retry message. Even in that case, I still would not show `Reconnect` unless the connection itself is actually disconnected or auth-invalid.

---

**User**

update the plan for that

---

**Cursor**

I’m updating the saved plan to make the server action rule explicit: `Sync` only for connected servers, `Reconnect` only for disconnected servers.

I’ve pinpointed the plan sections that mention server actions, and I’m tightening them so the status-based rule is explicit in the saved plan.

I updated the plan to make that explicit in `mcp_functions_ui_6664dd30.plan.md`.

It now states that:
- `Sync` shows only for connected servers
- `Reconnect` shows only for disconnected servers
- they never appear together on the same server row
- `Disconnect` remains the separate destructive action

I also tightened the `Manage MCP Servers` drawer section so the row-action behavior is unambiguous.

---

**User**

 @mcp_functions_ui_6664dd30.plan.md (145-154) do not use A or B, list out concrete component you are going to use

---

**Cursor**

I’m checking the actual component inventory and nearby patterns so I can replace those vague “A or B” plan lines with specific components that exist in this codebase.

I found the likely list-page references. I’m reading those now to pin the plan to specific components instead of generic placeholders.

I found a concrete search component already used in a sibling AI Agent list. I’m verifying the badge/chip component too so the plan only names components that exist.

I didn’t find a chip component already used in `chatbotpage`, so I’m checking the `framework` workspace directly before I lock that part of the plan.

I’ve got a concrete set now. I’m rewriting that Functions page section to use exact component names, including the specific new wrapper/cell components the page will introduce.

I updated that section in `mcp_functions_ui_6664dd30.plan.md` to use exact component names.

The Functions page section now names:
- `CFunctionNewButton`
- `CMcpAddFunctionsButton`
- `CMcpManageServersButton`
- `CKeywordSearch`
- `CSelect`
- `CDataTable`
- `CFunctionsNameTableCell`
- `CFunctionsTypeTableCell`
- `CFunctionsSourceTableCell`
- `CFunctionsStatusTableCell`
- `CFunctionsUsedinTopicsTableCell`
- `CTableBodyOperationEdit`
- `CTableBodyOperationDelete`
- `CMcpFunctionManageOperation`

I also made the rendering rules explicit:
- `CFunctionsNameTableCell` uses `CTopicTableBodyCellLinkButton` for custom rows and `CFunctionsTableBodyCellText` for MCP rows
- `CFunctionsTypeTableCell` and `CFunctionsStatusTableCell` use `CChip`
- `CMcpFunctionManageOperation` uses `CIconButton` to open the server drawer

If you want, I can do the same cleanup for the drawer sections so every planned surface has a fully concrete component list too.

---

**User**

update reset design too @mcp_functions_ui_6664dd30.plan.md (172-217) do not use "A or B" in design

---

**Cursor**

I’m replacing the drawer sections with exact components as well, so I’m checking the existing drawer wrapper, form primitives, empty/loading states, and nested-drawer patterns before I rewrite that part of the plan.

I’ve identified the likely product drawer wrapper. I’m reading the actual drawer and form implementations now so the rewritten plan names the exact drawer shell, form inputs, and empty/loading components.

I didn’t find a shared empty/loading component by those names, so I’m checking a couple of existing drawer/table implementations to see which concrete components they actually use for empty and loading states.

I have the form primitives. I’m checking link and sub-drawer support next so the plan can use exact components for the credential jump and nested tools drawer too.

I’ve got enough to make those drawer sections specific. I’m rewriting them now with exact framework components plus the concrete new local components the implementation will introduce.

I’m doing one quick check for the timestamp component, then I’ll patch the plan with a fully concrete drawer design.

I’ve got the exact framework building blocks now. I’m patching the plan so those drawer sections name the specific drawer shell, table/form primitives, and the concrete new local components.

I updated `mcp_functions_ui_6664dd30.plan.md` so those drawer sections no longer use vague `A or B` wording.

The plan now names exact components for each surface:
- `Add Functions via MCP` drawer now uses `CDrawerPage`, `CForm`, `CFormControl`, `CSelect`, `CInput`, `CLinkButton`, `CFormActionSubmitButton`, `CFormActionCancelButton`, `CFormSkeleton`, `CProgress`, and specific new local components like `CMcpProviderCatalogTable` and `CMcpCustomServerForm`.
- `Manage MCP Servers` drawer now uses `CDrawerPage`, `CDataTable`, `CTableSkeleton`, `CLocalTime`, `CChip`, `CIconButton`, `CButton`, and explicit local components like `CMcpServersTable`, `CMcpServerStatusTableCell`, and `CMcpServerReconnectOperation`.
- `MCP Server Tools` child drawer now uses `CDrawerPage`, `CDataTable`, `CTableSkeleton`, `CSwitch`, `CFormAction`, `CFormActionCancelButton`, and explicit local components like `CMcpServerToolsTable` and `CMcpToolEnabledSwitchCell`.

I also made the design behavior concrete:
- `Add Functions via MCP` is explicitly a `CDrawerPage size="large"`.
- `Manage MCP Servers` is explicitly a `CDrawerPage size="large"`.
- `MCP Server Tools` is explicitly a nested `CDrawerPage size="small"` that renders as a `CSubDrawer`.

If you want, I can do one more cleanup pass on the rest of the plan and replace any remaining abstract names with exact local component names too.

---

**User**

sketch out component hierarchy for each page/drawer

---

**Cursor**

I have enough context to add hierarchy sketches, but I’m checking the existing function form page once so the page tree lines up with the current hybrid structure instead of inventing a sibling route layout.

I’m adding a dedicated hierarchy-sketch section to the plan now so each page/drawer has a concrete tree instead of only flat component lists.

---

**User**

use jsx-ish syntax

---

**Cursor**

I’m updating the saved plan with JSX-like hierarchy trees for the Functions host, the custom function form page, and each MCP drawer.

I updated `mcp_functions_ui_6664dd30.plan.md` with a new `Component Hierarchy Sketches` section in JSX-ish syntax.

It now includes trees for:
- `Functions & MCP` page
- custom function full-page form
- `Add Functions via MCP` drawer
- `Manage MCP Servers` drawer
- `MCP Server Tools` child drawer

The hierarchies are written as component trees rather than prose so it’s easier to visualize the actual composition.

---

**User**

put Component Hierarchy Sketches into each page/drawer

---

**Cursor**

I’m restructuring the plan so each page/drawer section includes its own JSX hierarchy sketch instead of keeping all sketches in one combined section.

I found the split point: the plan still has one standalone hierarchy section. I’m moving those JSX sketches under the corresponding page/drawer sections and adding the custom function form as its own design section.

I’m folding each JSX sketch into its matching design section and removing the standalone hierarchy section at the bottom so the plan reads page-by-page.

I updated `mcp_functions_ui_6664dd30.plan.md` so the JSX hierarchy is now embedded inside each corresponding section instead of living in one separate `Component Hierarchy Sketches` block.

The plan now has:
- `Functions & MCP page` with its own hierarchy sketch
- `Custom function full-page form` as its own design section with its own hierarchy sketch
- `Add Functions via MCP drawer` with its own hierarchy sketch
- `Manage MCP Servers drawer` with its own hierarchy sketch
- `MCP Server Tools child drawer` with its own hierarchy sketch

I also removed the standalone bottom hierarchy section so the plan reads page-by-page.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (193-197) keyword search should be the right most filter

---

**Cursor**

I’m adjusting the Functions page sketch so the search box sits at the far right of the filter row, and I’ll make the layout rule explicit in the design notes too.

I found the filter cluster in the Functions page section. I’m reordering it so `CKeywordSearch` is the right-most control and noting that explicitly in the design details.

I updated `mcp_functions_ui_6664dd30.plan.md` so the Functions page filter cluster is now ordered as:

```jsx
<CSelect name="typeFilter" />
<CSelect name="sourceFilter" />
<CKeywordSearch />
```

I also added a design note making it explicit that `CKeywordSearch` should be the right-most filter control.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (193-198) use CTableFilter and CTableFilterControl for table filters, check how to use them and update the plan

---

**Cursor**

I’m checking the existing `CTableFilter` / `CTableFilterControl` pattern first so the plan uses the real table-filter composition instead of ad hoc controls in the header sketch.

I found several real usages in `chatbotpage`. I’m reading those examples plus the framework helper itself so the plan can mirror the actual wrapper/field pattern.

I confirmed the pattern: `CTableFilter` owns `initialValues` and `onFilter`, and each control is wrapped in `CTableFilterControl component={...}`. I’m updating the Functions page section and JSX sketch to use that exact structure.

I confirmed the exact usage pattern from `CBookedMeetingsContent.tsx` and `CBotLearnComplete.tsx`: `CTableFilter` wraps the filter group, and each field is a `CTableFilterControl component={...}`. I’m updating the Functions page section to match that pattern instead of rendering raw controls directly.

I updated the plan to use the real table-filter pattern.

The Functions page section now explicitly uses:
- `CTableFilter`
- `CTableFilterControl`
- `CSelect`
- `CKeywordSearch`

And the sketch now shows:

```jsx
<CTableFilter initialValues={filterValues} onFilter={handleFilter}>
  <CTableFilterControl
    name="typeFilter"
    component={CSelect}
    options={typeFilterOptions}
    placeholder="Type"
    clearable
  />
  <CTableFilterControl
    name="sourceFilter"
    component={CSelect}
    options={sourceFilterOptions}
    placeholder="Source"
    clearable
  />
  <CTableFilterControl
    name="keywords"
    component={CKeywordSearch}
    placeholder={t("AIAgent_Functions_Search")}
  />
</CTableFilter>
```

I also added a design note that this follows the existing usage pattern from `CBookedMeetingsContent.tsx` and `CBotLearnComplete.tsx`.

---

**User**

is this the existing edit function form: @mcp_functions_ui_6664dd30.plan.md (261-262) 


---

**Cursor**

Yes. In the plan, `Custom function full-page form` refers to the existing custom-function create/edit surface, not a new MCP-specific page.

Today that flow is:
- `CFunctionsPage` switches to the form when `action !== ""`
- `CFunctionFormPage` is the existing full-page host
- `CFunctionForm` is the existing edit/create form body

Relevant files:
- `src/Components/Functions/CFunctionsPage.tsx`
- `src/Components/Functions/CFunctionFormPage.tsx`
- `src/Components/Functions/CFunctionForm.tsx`
- `src/Components/Application/Functions/FunctionsApp.ts`

So:
- custom API/LLM function `new` -> uses this form
- custom API/LLM function `edit` -> uses this same form
- MCP functions do not use this form; they go through the MCP drawers

If you want, I can rename that plan section to `Existing custom function create/edit full-page form` to make it unambiguous.

---

**User**

 you don't need to add it to design, it does not change, remove it from design

---

**Cursor**

That `Custom function full-page form` section was describing the existing `CFunctionFormPage`/`CFunctionForm` flow, not a new MCP surface. I’m removing it from the design section and leaving it only as unchanged existing behavior.

I’m removing the dedicated `Custom function full-page form` design subsection and keeping it only as existing unchanged behavior of the current hybrid page.

Yes, that was the existing custom function edit/new form flow.

I removed the dedicated `Custom function full-page form` section from `mcp_functions_ui_6664dd30.plan.md` so the design section now focuses only on the MCP-related surfaces that are changing. The existing `CFunctionFormPage`/`CFunctionForm` flow is now treated as unchanged background behavior of the current hybrid page.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (301) use the CSegmentGroup component for switch between prebuilt or custom server

---

**Cursor**

I’m checking how `CSegmentGroup` is actually used in this codebase so I can update the plan with the right component pattern instead of just swapping the name.

I confirmed `CSegmentGroup` exists as a field component. I’m checking one real usage now so I can update the Add Functions drawer section with the correct `CFormControl component={CSegmentGroup}` pattern.

I found a concrete in-form usage: `CFormControl component={CSegmentGroup} name="formSource" options={...}`. I’m updating the Add Functions drawer section to use that same pattern for the prebuilt/custom switch.

I updated the plan so the `Add Functions via MCP` drawer now uses `CSegmentGroup` for switching between prebuilt and custom server.

The changes in `mcp_functions_ui_6664dd30.plan.md` are:
- added `CSegmentGroup` to the drawer’s component list
- changed the design note from `CFormControl component={CSelect}` to `CFormControl component={CSegmentGroup}`
- updated the JSX sketch to:

```jsx
<CFormControl
  component={CSegmentGroup}
  name="connectionType"
  options={connectionTypeOptions}
/>
```

The credential selector inside the custom server form still uses `CSelect`, which is appropriate for picking a saved credential.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (352-354) no need to have dedicate success panel, close the drawer and show success message

---

**Cursor**

I’m updating the Add Functions drawer plan to remove the dedicated success panel and switch to the standard close-and-toast success behavior.

I found the exact success-message pattern already used in the repo via `dispatchSuccessfullEvent(...)`. I’m updating the plan to remove the success panel and use close-plus-toast instead.

I updated the plan to remove the dedicated success panel from the `Add Functions via MCP` drawer.

It now says the success behavior should be:
- call `dispatchSuccessfullEvent(...)`
- refresh the unified functions table
- close the drawer immediately

I also removed `CMcpConnectSuccessPanel` from both the component list and the JSX hierarchy sketch.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (474-475) what is the content of CMcpToolsNotice

---

**Cursor**

I’m checking the spec wording so I can answer with the exact intended notice content, not just a paraphrase.

`CMcpToolsNotice` is a proposed local wrapper component, not an existing shared component. Its intended content is the spec banner from `productspecs/Specification/AIAgent-MCP.md`:

`Disabled tools cannot be referenced in Topics and will be blocked at runtime.`

So in practical terms it would just render something like:

```jsx
<CMcpToolsNotice>
  <CHtmlText content="Disabled tools cannot be referenced in Topics and will be blocked at runtime." />
</CMcpToolsNotice>
```

If you prefer, I can update the plan to remove `CMcpToolsNotice` entirely and inline that `CHtmlText` directly in the drawer sketch.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (438-478) use Form here, edit McpServer form, and tools list is a nested CFormTable inside it

---

**Cursor**

I’m checking the existing `CFormTable` pattern so I can reshape the `MCP Server Tools` section into an edit form with a nested form table instead of a plain data table.

I’m checking one real `CFormTable` usage before I rewrite that drawer section, so the nested-tool list follows the existing form-table pattern instead of inventing a new structure.

I’m checking whether `CFormTable` is usually mounted directly or via a form field wrapper, so the child drawer sketch matches the repo’s form composition style.

I have enough to rewrite that child drawer as a server edit form with a nested `CFormTable`. I’m pulling the exact current section so I can patch it cleanly.

I’ve got the current child-drawer section and the relevant `CFormTable` examples. I’m rewriting that section as a server edit form with a nested `CFormTable` for tools.

The child drawer section is updated. I’m doing one quick consistency pass for stale names like `CMcpServerToolsDrawer` or `CMcpToolsNotice` elsewhere in the plan.

There are two stale references left: the “Create” section title and the parent drawer sketch still say `CMcpServerToolsDrawer`. I’m aligning those names with the new server-form drawer.

The naming is consistent now. I’m doing one last readback of the updated section so I can summarize the exact plan change cleanly.

Updated `mcp_functions_ui_6664dd30.plan.md`.

That child drawer is now planned as an `MCP Server form child drawer`, not a tools-only drawer:
- it uses `CMcpServerForm` + `CForm`
- the top of the drawer edits MCP server fields like `displayName`, and for custom servers also `endpointUrl` and `authorizationCredentialId`
- the tools list is now a nested `CMcpServerToolsFormTable` wrapping `CFormTable`
- tool enablement uses `CTableBodyCellSwitch` inside the nested form table
- the footer is now a normal form footer with `CFormActionSubmitButton` and `CFormActionCancelButton`

I also updated the parent manage-servers sketch so it opens `CMcpServerFormDrawer` instead of the old `CMcpServerToolsDrawer`.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (230) what will display in status cell when type is not MCP

---

**Cursor**

I’m checking the unified functions table section and the MCP spec so I can answer based on the current plan rather than guessing.

I found the current plan only says the status cell uses `CChip`, while the spec only defines MCP-specific states like `Disconnected`. I’m checking the exact unified-list requirements so I can answer whether custom rows should be blank or use a fallback label.

For non-MCP rows, `CFunctionsStatusTableCell` should display an empty cell, not a chip.

Reason:
- the status column is only meaningful for MCP-backed rows, where it can show MCP-specific state such as `Disconnected` and possibly enabled/disabled runtime state
- custom functions do not have MCP connection status, so showing a chip there would imply a state that does not exist

So the intended behavior is:
- `type === MCP`: render a `CChip`
- `type !== MCP`: render nothing / plain empty cell

If you want, I can update the plan text to state that explicitly for `CFunctionsStatusTableCell`.

---

**User**

yes update the plan

---

**Cursor**

I’m updating the unified functions table section to state that the status cell is empty for non-MCP rows and only renders a chip for MCP rows.

I’m making the status-cell rule explicit in both the design notes and the hierarchy sketch so the plan doesn’t imply a chip for custom functions.

The plan is updated. I’m reading back the edited lines once so I can confirm the wording is precise.

Updated the plan.

It now explicitly says:
- `CFunctionsTypeTableCell` always renders `CChip`
- `CFunctionsStatusTableCell` renders `CChip` only for MCP rows
- custom-function rows render an empty status cell

I also updated the hierarchy sketch to show:

```jsx
<CFunctionsStatusTableCell>
  {isMcpRow && <CChip />}
</CFunctionsStatusTableCell>
```

---

**User**

list out all language texts you need to add

---

**Cursor**

I’m auditing the MCP functions plan against the existing localization files so I can separate truly new texts from labels we can reuse.

I need one pass over the localization tree and current keys to avoid listing strings that already exist and can be reused.

I’ve located the override language files; now I’m checking the English pack for existing keys so I can keep the add-list tight.

I’m checking whether common labels like `Sync`, `Disconnect`, `Type`, and `Source` are already reused elsewhere, so I can separate new MCP copy from existing shared text.

I’ve confirmed `Credential` and `Authorization Credentials` already exist, so I’m pulling the MCP spec’s exact labels and states to identify the remaining net-new texts.

I’m reading the requirement tables directly now; the rg snippets weren’t enough to capture all the MCP labels and states cleanly.

I want to check the current Functions page description hook before I finalize the list, because the rename may also require description copy updates, not just button labels.

I’ve confirmed the page description is driven by `AIAgent_Functions_Description`, so that’s likely an existing copy update. I’m doing one last scan for missing labels like `LLM`, `MCP`, `Status`, and `Last Sync` before I list the texts.

I’m checking existing success-toast patterns so I don’t overcount generic messages that the repo already reuses.

I’m doing a final sanity check on generic labels like `Name`, `Description`, and `Connect` so I can split “new MCP-specific keys” from shared copy we can reuse.

Based on the current plan, the net-new MCP copy I would add is this.

## New Texts To Add
- `AIAgent_Functions_AddViaMcp`: `Add Functions via MCP`
- `AIAgent_Functions_ManageMcpServers`: `Manage MCP Servers`
- `AIAgent_Functions_Search`: `Search functions`
- `AIAgent_Mcp_AddDescription`: `Connect a prebuilt MCP provider or a custom MCP server to sync tools into this AI Agent.`
- `AIAgent_Mcp_ManageServersDescription`: `View connected MCP servers, sync tools, reconnect authentication, disconnect servers, and manage tool availability.`
- `AIAgent_Mcp_ManageCredentialsLink`: `Click here to manage Credentials`
- `AIAgent_Mcp_EmptyServersDescription`: `Connect an MCP server to sync tools into this AI Agent.`
- `AIAgent_Mcp_ToolsNotice`: `Disabled tools cannot be referenced in Topics and will be blocked at runtime.`
- `AIAgent_Functions_EmptyFilteredDescription`: `No functions match the current filters. Adjust the filters and try again.`
- `AIAgent_Mcp_Error_InvalidEndpointUrl`: `Please enter a valid endpoint URL.`
- `AIAgent_Mcp_Error_Unreachable`: `Could not reach the endpoint. Check the URL and try again.`
- `AIAgent_Mcp_Error_UnsupportedProtocol`: `This server uses an unsupported MCP protocol version.`
- `AIAgent_Mcp_Error_ConnectFailed`: `Could not establish a connection. Verify the server supports the MCP protocol.`

## Existing Texts To Update
- `AIAgent_Functions`: change copy from `Functions` to `Functions & MCP`
- `AIAgent_Functions_Description`: update the page description so it covers both custom functions and MCP-connected tools/servers
- If `inAppUIHelpText.bot_AIAgent_FunctionsDes` is populated from brand/help text, that copy should be updated too so it stays consistent with the new page scope

## Shared Texts I Would Reuse First
I would check the shared multilingual source before adding new feature-specific keys for these:
- `Type`
- `Source`
- `Status`
- `Connect`
- `Prebuilt`
- `Custom`
- `Display Name`
- `Endpoint URL`
- `Connected`
- `Disconnected`
- `Error`
- `Tool Count`
- `Last Sync`
- `Sync`
- `Reconnect`
- `Disconnect`
- `Manage Tools`
- `Enabled`
- `Retry`
- `Name`
- `Description`
- `Credential`
- `Authorization Credentials`

## Notes
- The repo-owned override files under `src/Localization/OverrideLanguageTexts/` are currently empty, so none of the MCP-specific copy exists there yet.
- The new texts above would need entries in all 8 override language files: `en`, `de`, `es`, `fr`, `ja`, `tr`, `vi`, `zh-CN`.
- If you also want them backed by the shared multilingual source, the same copy should exist in `t_AutoCoding_MultilingualText`.

If you want, I can turn this into a concrete localization matrix next: `key -> English -> where used`.

---

**User**

add it to the plan

---

**Cursor**

I’m adding a dedicated localization section to the plan so the MCP UI scope includes the exact new keys, the existing keys to update, and the shared labels to reuse.

I’ve got the insertion point. I’m adding a dedicated `Localization Texts` section with new keys, existing keys to update, reuse candidates, and the target override language files.

The localization list is in the plan. I’m reading back the new section once to make sure the keys and file paths are all present.

Added to the plan.

The plan now includes a dedicated `Localization Texts` section with:
- all new MCP-specific language keys to add
- the existing keys to update, including `AIAgent_Functions` and `AIAgent_Functions_Description`
- the shared labels to reuse instead of duplicating
- the full list of override language files to update
- a note to mirror the same texts in `t_AutoCoding_MultilingualText` if that source is also used

If you want, I can next tighten this further into a `key -> exact UI location` mapping inside the plan.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (122-123) what is this? 

---

**Cursor**

I’m checking the nearby section so I can explain that line in the context of the server-management flow, not in isolation.

It means this behavior:

When the user clicks the manage action on an MCP function row in the unified Functions table, the `Manage MCP Servers` drawer should open already positioned on that function’s owning server.

Example:
- user clicks manage on `salesforce::create_lead`
- the `Manage MCP Servers` drawer opens
- the `Salesforce` server row is already visible in the drawer table
- that row can be highlighted/focused so the user does not need to manually search for it

This comes from the MCP spec requirement that the MCP function manage action opens the corresponding server management drawer and is auto-focused on that server.

It does not mean scrolling the whole page. It only means scrolling/focusing inside the server-management drawer/table, likely via a `focusedServerId` like the current sketch shows.

If you want, I can simplify that plan item to one of these:
1. open drawer and just highlight the server row
2. open drawer and filter to that server
3. open drawer and go directly into that server’s child form drawer

---

**User**

which drawer does it open when click  manage action on an MCP function row?

---

**Cursor**

It opens the parent `Manage MCP Servers` drawer, which in the plan is `CMcpManageServersDrawer`.

Current planned behavior:
- click manage on an MCP function row
- open `CMcpManageServersDrawer`
- auto-focus/scroll to that function’s owning server row inside the server table

It does not directly open the nested `CMcpServerFormDrawer` in the current plan.

If you want, I can update the plan so the row action opens the child server form drawer directly instead.

---

**User**

it should open the MCP Server form child drawer

---

**Cursor**

I’m updating the plan so the MCP row manage action opens the parent server-management drawer with the `MCP Server form child drawer` already open for that specific server.

I’ve got the spots to align. I’m updating the feature bullets, the functions-page design note, the server-drawer design, and the flow sketch so the MCP row action opens the child drawer, not just the parent list drawer.

The row-action behavior is updated. I’m doing one quick readback of the changed sections to make sure the parent/child drawer relationship is now unambiguous.

Updated the plan.

It now says the MCP function-row `Manage` action should:
- open `CMcpManageServersDrawer` as the parent host
- immediately open `CMcpServerFormDrawer` for that specific server

I also updated:
- the feature list
- the drawer creation notes
- the `Functions & MCP` page design detail
- the `Manage MCP Servers` drawer sketch
- the flow sketch

So the plan no longer says “just focus/scroll to the server row”; it now explicitly opens the child server form drawer.

---

**User**

no the CMcpServerFormDrawer can be used standalone, doesn't need to open from CMcpManageServersDrawer 

---

**Cursor**

I’m decoupling the server form drawer from the manage-servers drawer in the plan, so the MCP row action can open it directly and the manage-servers drawer stays a separate list surface.

I’ve identified the places that still imply a parent-child dependency. I’m rewriting them so `CMcpServerFormDrawer` is a standalone/reusable drawer, with direct entry from the MCP function-row action.

The decoupling is applied. I’m reading back the changed sections for any leftover “child drawer” wording or duplicate lines.

Two stale phrases remain: one duplicate line in the feature list and one “closes the child drawer” line in the form-drawer section. I’m cleaning those up for consistency.

The standalone-drawer wording is now consistent. I’m doing one final readback of the cleaned lines.

Updated the plan.

It now treats `CMcpServerFormDrawer` as a standalone/reusable drawer:
- MCP function-row `Manage` opens `CMcpServerFormDrawer` directly
- `CMcpManageServersDrawer` stays a separate header-launched server list
- the server form drawer can still be reused from the server list if needed, but it is no longer modeled as dependent on that parent drawer

I also removed the leftover parent-host wiring from the sketches and flow, and cleaned the wording so it no longer says “child drawer.”

---

**User**

@mcp_functions_ui_6664dd30.plan.md (342-350) put this into authorizationCredentialId field's helper text

---

**Cursor**

I’m checking the form-control helper text pattern first so I can move that credentials link into the `authorizationCredentialId` field guidance without inventing an unsupported API in the plan.

I checked the form API: `helperText` is a string rendered through `CHtmlText`, not a React node. I’m updating the plan so the credentials guidance becomes the `authorizationCredentialId` field helper text instead of a standalone `CLinkButton`.

I confirmed `helperText` is string-based and rendered through `CHtmlText`, so the plan should model this as helper-text content on the select field, not a standalone `CLinkButton`. I’m updating that drawer section now.

The standalone link is removed from the sketch now. I’m reading back the updated Add Functions drawer section to make sure it only describes the helper-text version.

Updated the plan.

That credentials entry is now modeled as `authorizationCredentialId` field helper text:
- removed the standalone `CLinkButton` from the Add Functions via MCP drawer
- updated the design notes to say the helper text contains the credentials-management link
- updated the sketch to:

```jsx
<CFormControl
  component={CSelect}
  name="authorizationCredentialId"
  helperText={authorizationCredentialHelperText}
/>
```

I also based that change on the actual framework form API: `helperText` is string-based and rendered via `CHtmlText`, so this is a better fit than keeping a separate button under the field.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (329-341) make sure these 3 form field is layout from top to bottom

---

**Cursor**

I’m updating the Add Functions via MCP drawer sketch so the three custom-server fields are explicitly stacked vertically with `CFormControlGroupItem xs={12}` wrappers.

I’m updating the Add Functions via MCP drawer plan so those three custom-server fields are explicitly stacked vertically, each in its own `CFormControlGroupItem xs={12}`.

The custom connection form is updated in the plan. I’m reading back the edited block to confirm the vertical layout is explicit now.

Updated the plan.

Those three custom-server fields in `CMcpAddFunctionsDrawer` are now explicitly stacked top-to-bottom:
- `displayName`
- `endpointUrl`
- `authorizationCredentialId`

The plan now says they should each be placed in their own `CFormControlGroupItem xs={12}`, and the sketch reflects that.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (491-495) the prebuild server doesn't have a editable displayName, only custom type have this

---

**Cursor**

I’m updating the server form drawer section so `displayName` is editable only for custom servers, not prebuilt ones.

I’m updating the server form drawer section so `displayName` is only shown as an editable field for custom servers.

The server form drawer now scopes `displayName` to custom servers only. I’m reading back the updated design note and sketch block to confirm it’s explicit.

Updated the plan.

The `CMcpServerFormDrawer` section now says:
- only `custom` servers show editable `displayName`
- `endpointUrl` and `authorizationCredentialId` are also inside the same `serverType === "custom"` block
- `prebuilt` servers do not show an editable `displayName` field in that drawer

So the server form sketch now wraps all three editable fields under:

```jsx
{serverType === "custom" && (
  <>
    <CFormControlGroupItem xs={12}>
      <CFormControl component={CInput} name="displayName" />
    </CFormControlGroupItem>
    ...
  </>
)}
```

---

**User**

for all form fields, mark required/not required in the plan base on the @productspecs/Specification/AIAgent-MCP.md 

---

**Cursor**

I’m checking the spec rules and entity definitions for each planned input so I can label every form field as required or not required in the plan, instead of inferring from the sketch alone.

I’m checking how the current plan models the form inputs so I can annotate each one with required/not-required clearly, including the tool enable switches.

I’ve identified the planned input fields. I’m adding explicit required/not-required notes for the add flow and server form drawer, and marking the required ones in the JSX sketches.

Updated the plan in `c:\Users\roy\.cursor\plans\mcp_functions_ui_6664dd30.plan.md` and marked the form fields from `c:\Users\roy\src\productspecs\Specification\AIAgent-MCP.md` as required or not required.

The plan now treats these as required:
- `connectionType` in the Add Functions via MCP drawer
- Prebuilt flow provider selection to continue the auth flow
- Custom add form: `displayName`, `endpointUrl`, `authorizationCredentialId`
- Custom server edit form: `displayName`, `endpointUrl`, `authorizationCredentialId` when those fields are shown

The plan now treats these as not required:
- The per-tool enabled switch in the nested `CFormTable`, because it edits existing boolean state rather than collecting a required input
- Prebuilt server edit-only connection fields, since they are not shown in that drawer

I also reflected the required fields directly in the JSX hierarchy sketches with `required` on the relevant `CFormControl`s.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (303-368) this design have problem a page/drawer should either be a form or a table, this design have both table and form, what does submit when choose the connectType to provider?



---

**Cursor**

I’m reviewing the design guidelines for list/table vs form pages so I can resolve this cleanly and update the plan shape instead of just patching the JSX sketch.

Yes, that sketch has a design problem.

In `provider` mode, the page-level submit does not have a clear meaning. The actual action for prebuilt providers should be the row-level `Connect` operation on `CMcpProviderCatalogTable`, which starts OAuth, creates the credential, then syncs tools. So a `CFormActionSubmitButton` in that branch is wrong.

The cleaner plan change is:

1. `CMcpAddFunctionsDrawer` becomes a small chooser drawer only.
   It is a form surface with just `connectionType` (`CSegmentGroup`) and a primary action labeled `Continue`.

2. Choosing `prebuilt` opens `CMcpProviderCatalogDrawer`.
   This drawer is table-only.
   No page-level submit.
   Each row uses `CMcpProviderConnectOperation` as the connect action.

3. Choosing `custom` opens `CMcpCustomServerFormDrawer`.
   This drawer is form-only.
   It contains `displayName`, `endpointUrl`, and `authorizationCredentialId`, plus the normal submit/cancel actions.

So the answer to your question is: submit should not exist in the provider table drawer. If we keep the segment switch, its submit should only mean “go to the next drawer,” not “connect”.

The corrected structure should look like this:

```jsx
<CMcpAddFunctionsDrawer>
  <CForm>
    <CFormControl component={CSegmentGroup} name="connectionType" required />
    <CFormAction>
      <CFormActionSubmitButton />
      <CFormActionCancelButton />
    </CFormAction>
  </CForm>
</CMcpAddFunctionsDrawer>

<CMcpProviderCatalogDrawer>
  <CDataTable>
    <CMcpProviderNameTableCell />
    <CMcpProviderDescriptionTableCell />
    <CMcpProviderConnectOperation />
  </CDataTable>
</CMcpProviderCatalogDrawer>

<CMcpCustomServerFormDrawer>
  <CForm>
    <CFormControl component={CInput} name="displayName" required />
    <CFormControl component={CInput} name="endpointUrl" required />
    <CFormControl component={CSelect} name="authorizationCredentialId" required />
    <CFormAction>
      <CFormActionSubmitButton />
      <CFormActionCancelButton />
    </CFormAction>
  </CForm>
</CMcpCustomServerFormDrawer>
```

If you want, I can revise the plan to this 3-surface structure next.

---

**User**

no change it to use CTabs instead and prebuilt server tab is a table and custom server tab is a form

---

**Cursor**

I’m updating the plan so the Add Functions via MCP drawer becomes a `CTabs` surface: the prebuilt tab stays table-only, and the custom tab stays form-only.

I found a good `CTabs` reference in `CBotPrebuiltEntitesPage.tsx`. I’m updating the plan so the tab itself controls the branch, with no fake submit for the prebuilt table path.

I’m replacing the segment-switch form with a tabbed drawer design and removing the misleading shared submit path from the prebuilt flow.

I’m aligning the plan with your tabbed-surface requirement, including separate loading and action behavior per tab so the prebuilt tab no longer behaves like a form.

The behavior is now correct; I’m just cleaning up the JSX sketch indentation so the updated tab structure reads clearly in the plan.

I spotted one stray closing tag in the sketch from the formatting cleanup. I’m removing that so the plan’s JSX hierarchy is consistent again.

Updated the plan in `c:\Users\roy\.cursor\plans\mcp_functions_ui_6664dd30.plan.md`.

`CMcpAddFunctionsDrawer` now uses `CTabs`:
- `prebuilt` tab is table-only with `CMcpProviderCatalogTable` and row-level `CMcpProviderConnectOperation`
- `custom` tab is form-only with `CMcpCustomServerForm`

I also removed the old shared `connectionType` form submission idea:
- no page-level submit in the prebuilt tab
- only the custom tab has `CFormActionSubmitButton`
- the prebuilt connect flow is triggered only from the provider row action

Because the tab is now view state instead of a form field, I removed the earlier “`connectionType` is required” assumption. The custom tab still marks `displayName`, `endpointUrl`, and `authorizationCredentialId` as required.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (362-365) form submitting state is inside the CFormActionSubmitButton no need to add a separate CProgress

---

**Cursor**

I’m removing the redundant form-level `CProgress` from the custom tab and updating the wording so the submit button owns that loading state.

I’m narrowing the loading guidance so only the provider tab uses a standalone `CProgress`; the custom form will rely on `CFormActionSubmitButton`’s built-in submitting state.

Updated the plan.

In `c:\Users\roy\.cursor\plans\mcp_functions_ui_6664dd30.plan.md`:
- removed the custom-tab `isSubmitting && <CProgress />` from the JSX sketch
- updated the design note to say the custom tab uses `CFormActionSubmitButton`’s built-in submitting state
- kept standalone `CProgress` only for the prebuilt provider row connect flow

So now the custom form matches the framework pattern more closely.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (312) what is this?

---

**Cursor**

I’m checking how `CHtmlText` is normally used in this repo so I can explain that placeholder precisely instead of hand-waving.

I found the repo pattern: `CHtmlText` is the HTML-capable description text component, and this placeholder should be concrete in the plan, not empty.

I found two more empty `CHtmlText` placeholders in nearby sketches. I’m making them explicit too so the plan stops using vague text placeholders.

It was meant to be the drawer-level description text, not an empty placeholder.

In this repo, `CHtmlText` is the component used to render localized text that may contain simple HTML formatting, and `CFunctionsPage.tsx` already uses it that way for the page description.

I updated the plan to make it explicit:
- Add drawer: `content={t("AIAgent_Mcp_AddDescription")}`
- Manage servers drawer: `content={t("AIAgent_Mcp_ManageServersDescription")}`
- Empty state: `content={t("AIAgent_Mcp_EmptyServersDescription")}`

So that line is now specifically “the explanatory copy shown at the top of the drawer,” not just a vague placeholder.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (311-312) no, use CDrawerPage's description property instead

---

**Cursor**

I’m updating the plan to put the add drawer’s explanatory copy on `CDrawerPage.description` instead of rendering a separate `CHtmlText` node.

I’m checking how `CDrawerPage.description` is used in the repo so I can update the sketch to the right prop shape instead of guessing.

I found repo examples using `CDrawerPage.description`, including both plain strings and `<CHtmlText ... />`. I’m switching the add drawer sketch to use the `description` prop and removing the separate top-level `CHtmlText`.

Updated the plan.

For the Add Functions drawer in `c:\Users\roy\.cursor\plans\mcp_functions_ui_6664dd30.plan.md`:
- removed the standalone top `CHtmlText`
- moved that copy to `CDrawerPage.description`
- removed `CHtmlText` from this drawer’s direct component list

It now reads like:

```jsx
<CDrawerPage
  pageId="Mcp_AddFunctions"
  size="large"
  onClose={handleClose}
  description={t("AIAgent_Mcp_AddDescription")}
>
```

This keeps the drawer aligned with the framework pattern you pointed out.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (419-421) this is the same, check other descriptions

---

**Cursor**

I’m checking the remaining description usage in the plan so I can align all drawer-level descriptions with the same `CDrawerPage.description` pattern, and leave only true body text as `CHtmlText`.

I found one matching issue: the Manage MCP Servers drawer still had a separate top `CHtmlText`. I’m moving that to `CDrawerPage.description` and leaving only the empty-state/body description as `CHtmlText`.

Updated the plan.

`CMcpManageServersDrawer` now matches the same pattern as the add drawer:
- moved the top description to `CDrawerPage.description`
- removed the standalone top `CHtmlText`

I also checked the other description usages in this area:
- `AIAgent_Mcp_AddDescription` is already on `CDrawerPage.description`
- `AIAgent_Mcp_EmptyServersDescription` stays as `CHtmlText` because it is empty-state body content, not drawer header description
- `AIAgent_Mcp_ToolsNotice` stays as `CHtmlText` because it is an inline notice inside the server form drawer, not a page/drawer description

So the drawer-level descriptions are now consistent.

---

**User**

@mcp_functions_ui_6664dd30.plan.md (421-427) the CDataTable have builtin empty data UI, use that instead

---

**Cursor**

I’m switching the Manage MCP Servers plan away from a custom empty state so it uses `CDataTable`’s built-in empty-data UI instead.

I’m checking how `CDataTable` empty-state props are typically configured in this codebase before I rewrite that part of the plan.

I’m simplifying the Manage MCP Servers drawer plan so the table always renders when loaded, and the no-rows state comes from `CDataTable` itself instead of a custom empty block.

Updated the plan.

For `Manage MCP Servers` in `c:\Users\roy\.cursor\plans\mcp_functions_ui_6664dd30.plan.md`:
- removed the custom `CMcpServerEmptyState` branch
- removed the extra `CHtmlText` and `CButton` from that empty-state design
- changed the sketch so after loading it always renders `CMcpServersTable > CDataTable`
- added a note to rely on `CDataTable`’s built-in empty-data UI when there are no connected servers

I also removed the now-unused `AIAgent_Mcp_EmptyServersDescription` localization key from the plan, since that custom empty-state copy is no longer needed.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

I’m starting implementation from the first todo and checking the current Functions area, MCP-related services, and repo state so I can wire the new drawers and unified list without clobbering anything unrelated.

I’ve confirmed the worktree only has an unrelated markdown file. Next I’m mapping existing MCP-related code and the domain models so the unified Functions view can plug into real entities instead of inventing a parallel data shape.

I found that the MCP BOs and domain services already exist in this repo, which should keep the implementation much narrower. I’m reading those next, along with existing patterns for table filters, tabs, and form tables.

The MCP service layer is already present, including list/create/validate/sync calls. I’m now inspecting the function-domain service and existing table/filter usage so the new UI can reuse those flows cleanly.

I’ve got enough of the table and service patterns now. Next I’m reading the current localization and existing function UI helpers so I can start patching the unified list and header actions without inventing key names or one-off cell components.

The unified list endpoint already exists, and the MCP services are separate but ready to use. I’m now narrowing the implementation surface in `Functions` itself so I can start making targeted edits instead of a broad refactor.

I found the likely built-in empty-state hook: `messageForNoRecords` on `CDataTable`. I’m verifying that pattern now before I wire the empty messages into the Functions and server tables.

I’ve confirmed the likely empty-table hook and the current Functions page wiring. I’m now checking the remaining string and component patterns so I can start editing the list host, header actions, and per-row behavior in one pass.

I haven’t started editing yet; I’m still closing the last unknowns around chip and operation patterns so the first code pass can cover the unified list, drawers, and strings together instead of thrashing.

I’m on the last bit of exploration: which button icons/titles and table props are already used in this codebase. After that I’ll start the actual file edits and wire the first todo through to completion.

I’m ready to start the edit pass. Before I do, I’m checking the override language files so the MCP strings can be added in the format this repo expects across all supported languages.

I have the repo-side patterns I need. I’m doing one quick check of the frontend MCP server descriptors before I use any MCP docs tool, since this repo’s guidance explicitly prefers that over guessing framework APIs.

I’m at the point where the remaining implementation risk is the prebuilt-provider connect path. I’m searching for any existing OAuth/MCP helper code in the repo before I decide whether to wire that flow directly or leave it as a scoped TODO-compatible stub.

The custom MCP path is straightforward; the remaining open point is how the frontend should obtain the OAuth code for prebuilt providers. I’m pulling the exact spec wording around that flow now so I can decide whether the repo already gives enough to implement it end-to-end.

The repo doesn’t seem to have an existing MCP-specific OAuth helper. I’m reading the existing Authorization Credential OAuth implementation now to see if that popup/code-exchange pattern can be reused for prebuilt MCP providers instead of inventing a new auth flow.

The existing OAuth pattern is popup-based, but it’s for Authorization Credentials, not MCP providers. I’m checking the spec’s backend/API section now to see whether the MCP provider login endpoint and callback behavior are explicitly defined there.

I’ve hit a second backend-surface check: the current MCP server service only exposes `create`, `getList`, `validateCustomConnection`, and `sync`. I’m scanning the spec for explicit reconnect/disconnect/update APIs before I wire those buttons against guessed endpoints.

I’ve got a workable interpretation for `Reconnect`: reuse the existing `sync` call and only change the label/availability by status, which matches the earlier plan decision. I’m doing one final search for `oauthCode`/server update details; if nothing turns up, I’ll implement the custom/server-management flows fully and keep the prebuilt connect UI in place with the least speculative behavior possible.

I found a viable path for prebuilt OAuth without guessing a backend login endpoint: the spec says the provider model includes the OAuth authorize metadata, and the existing app already uses popup-based OAuth elsewhere. I’m verifying the popup utility and then I’ll start implementing the MCP drawers and list wiring around that approach.

The popup utility works for a provider-managed authorize URL, so the OAuth route is implementable if the provider list returns the metadata from the spec. I’m checking one last detail now: how the server `namespace` should be supplied for custom and prebuilt connections, since the current create payload requires it but the UI plan intentionally doesn’t expose it as a user field.

I’ve got the payload assumptions I need now: provider namespace can come from `providerKey`, and custom namespace can be derived from the entered display name so we don’t add an extra user-facing field beyond the approved plan. I’m starting the code edits with the MCP BO/service layer and list-state wiring first.

I’m starting the implementation edits now. The first pass will wire the unified list, list-state/filter handling, and the MCP domain payloads so the page can host the new drawers and row actions without breaking the existing custom-function route flow.

I’m in the main UI implementation pass now. One thing I need to confirm before I finalize the drawer tables is whether `CDataTable` can render an in-memory array directly for provider/server rows, or whether it expects a domain service every time.

I’m tightening the table integration details before the next patch. The framework table expects an `idFieldName` on the domain service, so I’m aligning the custom MCP services with that shape rather than fighting the table type system.

I’ve confirmed why the Functions list can’t stay on the old generic table wiring: the unified MCP endpoint is represented by the custom `AIAgentFunctionDomainService`, and that service needs to match the table contract. I’m patching that contract now before I move on to the page and drawer components.

The next patch is the server form drawer, because it’s the common target for both the unified list’s MCP manage action and the server-management drawer. I’m reading one existing `CFormTable` usage in detail so the nested tools list binds to form state the same way the framework expects.

I have the `CFormTable` binding pattern now. I’m implementing the server drawer with a form-backed tools table so toggle changes stay inside form state and save together with the custom server fields, which is the riskiest interaction in this feature set.

I’m in the most stateful piece now: loading one server, binding its tools into form state, and saving tool toggles alongside custom-server edits. After this drawer lands, the rest of the UI wiring is mostly list/header plumbing and localization.

I’m implementing the add drawer with the same popup-based OAuth approach the app already uses elsewhere, plus the custom-server validation/create flow from the existing MCP domain service. After this file, the remaining work is mainly stitching the host page and table to these new surfaces.

I’ve cross-checked the existing OAuth window flow and I’m now mirroring it for MCP providers, while keeping the drawer split exactly as requested: `CTabs`, table-only prebuilt tab, form-only custom tab. I’m also checking the spec again for the required field details so the validation and helper text line up with what you approved in the plan.

I’ve finished the logic shape for the connect drawer and I’m writing the actual component now. This includes the provider table row action, OAuth popup handshake handling, custom endpoint validation, and the credential helper link inside the form field rather than as separate content.

The add drawer component is in place now. Next I’m wiring the unified functions table itself so the new buttons, filters, and “open MCP server form drawer” action actually show up in the page and refresh correctly.

I’ve got the table requirements pinned down from the plan now: unified list on the page, and a separate server-management drawer with row-level `Sync`/`Reconnect`/`Disconnect`/edit actions. I’m implementing that drawer next so the page state can wire to concrete components instead of placeholder handlers.

The remaining page work is now mostly coordination: parent state for drawer open/close, a single refresh counter to fan out updates to the list and server drawer, and hooking the MCP row action to the standalone server form drawer. I’m wiring that into `CFunctionsPage` next.

I found one important integration edge: the framework table wrapper assumes the domain service can still do built-in row operations like delete. For the unified functions list I’m fixing that by combining the new MCP-aware list loading with the existing legacy function service methods, so custom function delete/edit keeps working instead of regressing.

I’m cleaning up the new copy now so it doesn’t rely on ad hoc English literals. I’m switching the MCP-specific labels and actions to namespaced translation keys first, then I’ll add those keys across the override language files in one pass.

I’m at the localization pass now. All of the MCP-specific labels, descriptions, success/error messages, and status text are being added to every override language file so the new UI doesn’t fall back to raw keys.

The remaining language file needs a quick reread because its exported variable name doesn’t match the others. I’m checking the exact shape first, then I’ll patch it and run a type/lint sanity pass on the touched files.

The UI strings are in place across all override languages. I’m doing a consistency pass now: searching for any remaining hard-coded MCP copy, updating the todo statuses, and then running type/lint validation on the touched files.

I’ve finished the code and text integration pass. Next I’m running the repository type check so we can catch any wiring or domain-service regressions before I close out the last todo.

The repo-wide `tsc` run is blocked by pre-existing declaration syntax errors under `node_modules`, not by the MCP work itself. I’m doing one more targeted sanity check on the changed app/domain files so I can separate project baseline issues from anything introduced here.

The targeted checks are clean, and there are no leftover MCP TODO/FIXME markers. I’m grabbing a final diff summary now and then I’ll mark the last todo complete and report exactly what changed plus the validation results.

Implemented the MCP Functions and Servers plan in `chatbotpage`, and all four existing todos are now completed.

## What Changed
- `src/Components/Functions/CFunctionsPage.tsx` now owns the MCP drawer flow and refresh state for add/manage/edit server interactions.
- `src/Components/Functions/CFunctionsList.tsx` now shows a unified functions table with MCP-aware columns and filters: `type`, `source`, `status`, keyword search, plus header actions for `Add Functions via MCP` and `Manage MCP Servers`.
- Added the new MCP UI pieces in `src/Components/Functions/`: `CMcpAddFunctionsDrawer.tsx`, `CMcpManageServersDrawer.tsx`, `CMcpServerFormDrawer.tsx`, `CMcpAddFunctionsButton.tsx`, `CMcpManageServersButton.tsx`, `CMcpFunctionManageOperation.tsx`, `CFunctionsNameTableCell.tsx`, `CFunctionsTypeTableCell.tsx`, `CFunctionsSourceTableCell.tsx`, `CFunctionsStatusTableCell.tsx`, and `mcpUtils.ts`.
- The MCP row manage action now opens the MCP server form drawer directly, as requested.
- `src/Components/Application/Functions/FunctionListApp.ts` was updated to use functional query-state updates so refresh/filter state does not go stale.
- Domain and BO support was extended in `src/Domain/AIAgentFunctionDomainService.ts`, `src/Domain/AIAgentMCPProviderDomainService.ts`, `src/Domain/AIAgentMCPServerDomainService.ts`, `src/Domain/Bo/AIAgent/AIAgentFunctionBo.ts`, `src/Domain/Bo/AIAgent/AIAgentMCPServerBo.ts`, and `src/Domain/Bo/AIAgent/MCPProviderBo.ts` to support the unified MCP list, provider/server metadata, and server actions.

## Localization
Added these new keys:
`AIAgent_Functions_AddViaMcp`, `AIAgent_Functions_ManageMcpServers`, `AIAgent_Functions_Search`, `AIAgent_Mcp_AddDescription`, `AIAgent_Mcp_ManageServersDescription`, `AIAgent_Mcp_ManageCredentialsLink`, `AIAgent_Mcp_PrebuiltTab`, `AIAgent_Mcp_CustomTab`, `AIAgent_Mcp_Authentication`, `AIAgent_Mcp_Connect`, `AIAgent_Mcp_DisplayName`, `AIAgent_Mcp_EndpointURL`, `AIAgent_Mcp_Type`, `AIAgent_Mcp_Source`, `AIAgent_Mcp_Status`, `AIAgent_Mcp_Enabled`, `AIAgent_Mcp_Tools`, `AIAgent_Mcp_LastSync`, `AIAgent_Mcp_Sync`, `AIAgent_Mcp_Reconnect`, `AIAgent_Mcp_Disconnect`, `AIAgent_Mcp_ConfirmDisconnect`, `AIAgent_Mcp_ManageTools`, `AIAgent_Mcp_ToolsNotice`, `AIAgent_Mcp_Error_InvalidEndpointUrl`, `AIAgent_Mcp_Error_ConnectServerFailed`, `AIAgent_Mcp_Error_ServerAlreadyConnected`, `AIAgent_Mcp_Error_MissingOAuthCode`, `AIAgent_Mcp_Error_ProviderOAuthNotReady`, `AIAgent_Mcp_Error_PopupBlocked`, `AIAgent_Mcp_ServerConnectedSuccess`, `AIAgent_Mcp_ServerSyncedSuccess`, `AIAgent_Mcp_ServerReconnectedSuccess`, `AIAgent_Mcp_DisconnectConfirmMessage`, `AIAgent_Mcp_ServerDisconnectedSuccess`, `AIAgent_Mcp_StatusConnected`, `AIAgent_Mcp_StatusDisconnected`, `AIAgent_Mcp_StatusError`.

Updated language files:
`src/Localization/OverrideLanguageTexts/en.ts`, `src/Localization/OverrideLanguageTexts/de.ts`, `src/Localization/OverrideLanguageTexts/es.ts`, `src/Localization/OverrideLanguageTexts/fr.ts`, `src/Localization/OverrideLanguageTexts/ja.ts`, `src/Localization/OverrideLanguageTexts/tr.ts`, `src/Localization/OverrideLanguageTexts/vi.ts`, `src/Localization/OverrideLanguageTexts/zh-CN.ts`.

## Validation
- `ReadLints` reported no linter issues in the touched component, domain, and localization files.
- `npm run check` did not complete because the repo currently hits pre-existing TypeScript parse errors in `node_modules/@comm100/bot-flow-editor/dist/*.d.ts`.
- I did not run a browser smoke test.

If you want, the next useful step is a live UI smoke test of the Functions page and the three MCP flows once a local app session is available.

