# Agent Guidance: authentic_th

This repository is currently in the **specification and design phase**. There is no executable code yet.

## 🔄 Development Lifecycle
The project follows a strict top-down specification flow. Do not skip steps or implement code without following this chain of authority:

`BRD` $\rightarrow$ `TAD` $\rightarrow$ `SDD` $\rightarrow$ `UX/UI Specification` $\rightarrow$ `Program Specifications` $\rightarrow$ `Test Specification`

- **BRD (Business Requirements)**: Defines the "What" and "Why" (The Binding Source).
- **SAD (Software Architecture)**: Defines the high-level "How" (Strategic Decisions).
- **SDD (Software Design)**: Defines the detailed "How" (Implementation Blueprints).
- **UX/UI Specification**: Defines the visual/interaction layer.
- **Program Specifications**: Detailed logic, pseudo-code, and final API contracts.
- **Test Specification**: Traceability and verification criteria for each requirement.

## 📚 Documentation Map
All authoritative design documents are located in `/specifications`:
- **BRD**: `specifications/BRD_authentic_th.md` (Business requirements/Binding "shall" statements).
- **SAD**: `specifications/SAD_authentic_th.md` (High-level architecture - ISO 42010/arc42).
- **SDD**: `specifications/sdd/` (Detailed design - ISO 1016).
  - `overall_sdd.md`: Core backend, DB schema, and API contracts.
  - `customer_app_sdd.md`: Customer mobile app design.
  - `restaurant_app_sdd.md`: Restaurant mobile app design.

## 🚀 Implementation Strategy
The project follows a **Frontend-First** development approach.

**The Rule:** All frontend interfaces (Web/Mobile) must be fully implemented before any real backend coding begins.

**The Workflow:**
1. **UI Implementation**: Build the screens and interactions exactly as defined in the UX/UI and Program Specifications.
2. **Mocked Backend**: All API calls must use a **mocked-double backend** with hardcoded data. No real database or server logic should be written during this phase.
3. **Frontend Validation**: The user must be able to walk through the entire application flow using mocked data to verify UX/UI requirements.
4. **Backend Transition**: Only after the frontend is completed and validated will the team transition to replacing mocks with the real Rust/Axum backend implementation.

## 🛠️ Development Rules
When implementing code in future sessions:
1. **Multi-tenancy**: Every database query MUST include a `tenant_id` filter.
2. **Backend**: Follow the Modular Monolith crate layout defined in `overall_sdd.md`.
3. **Frontend**: Use the Feature-Based Architecture described in the app SDDs.
4. **Compliance**: Adhere strictly to Australian PDPA for all PII handling.
5. **Contracts**: Use the API definitions in `overall_sdd.md` as the single source of truth.

## ⚠️ Critical Gotchas
- **Printer Integration**: Web/Mobile apps cannot print directly; they must go through the cloud-to-local relay service described in the SAD/SDD.
- **Payment Flow**: No credit card data should be handled by the Rust backend; use Stripe Elements/Checkout.

## 🔍 Issue Investigation Protocol (Binding Standard)

When an issue or bug is reported, you MUST follow this rigorous evidence-based process. This is not optional — it is the binding standard for all defect investigation in this project.

### The 10 Principles

| # | Principle | Why It Matters |
|---|-----------|----------------|
| 1 | **Get exact symptom, not paraphrase** | Truncated errors hide the real cause. "It doesn't work" isn't enough — ask for the literal error text every time. |
| 2 | **Confirm symptom is current before diagnosing** | Stale data = wrong diagnosis. Check timestamps, fresh triggers, no cached state. |
| 3 | **Read actual code/config — don't reason abstractly** | Guessing produces "confidently wrong" answers. Grep the source, read the extractor/service/middleware. |
| 4 | **Form narrow hypothesis, test before committing** | One curl, one grep, one query — verify before building on unverified assumptions. |
| 5 | **Distinguish symptom from root cause** | 401 is where the trail starts, not ends. Go 2-3 layers deep: why 401? → expired token? → missing refresh? → bad secret? |
| 6 | **Say "I was wrong" plainly, correct course** | Don't paper over mistakes. Flag openly the moment you catch it. |
| 7 | **Verify every fix independently** | Don't trust reports — re-run the actual check yourself before calling something resolved. |
| 8 | **Delegate real changes; investigate and verify directly** | Never edit application code or commit changes yourself — but reading, grepping, and running read-only diagnostic commands to actually understand a problem is different from fixing it, and you do plenty of the former yourself before handing the latter to the right specialized agent. |
| 9 | **Pause for explicit confirmation before anything hard to reverse** | Push to main, delete DB rows, restrict SSH keys, restart live production services — ask first rather than assume. |
| 10 | **Close the loop with a record, not just a fix** | Write up root cause, not just the patch — so the reasoning survives past the moment of fixing it. |

### Defect Investigation Template (Required Format)

When reporting or investigating a defect, use this template:

```markdown
## Defect: [Short Title]

### Symptom (Exact, Not Paraphrased)
- [Literal error text, URL, status code, stack trace]
- [Not "it fails" — the actual error message]

### Current State Confirmation
- [Timestamp of last successful run]
- [Fresh trigger evidence — not cached/stale]
- [Verified reproducible]

### Root Cause (After Reading Actual Code)
- [File:line with actual code that caused issue]
- [Why the symptom occurred — not just "bug"]

### Test That Confirmed the Issue
- [Exact command/test that proved the hypothesis]
- [curl output, grep result, DB query result]

### Fix Applied
- [What changed, why it fixes the issue]
- [Files modified, lines changed]

### Verification
- [Re-run of original test — show output]
- [Cross-reference check — e.g., Stripe Dashboard + DB]
- [Service status confirmed]

### Mistakes Made (If Any)
- [What you got wrong, how you corrected course]
- [Don't paper over it — own it plainly]

### Defect Log Entry
- [Record for future reference — what happened, why, how fixed]
```

### Real Example: Billing Portal "company-not-found" 404

**What went wrong initially**:
- Symptom: Stripe billing portal button fails
- First hypothesis: "Slug vs UUID issue" — tested with UUID
- Result: Also 404 → concluded "slug theory was wrong" → chased wrong path
- **Mistake**: Didn't read actual extractor code first; tested with wrong input

**The correction**:
1. **Read actual code** (Principle 3): Found extractor uses `company_id_slug` column
2. **Owned the mistake** (Principle 6): "This is my mistake, not an app bug"
3. **Retested correctly** (Principle 4): Used slug this time → worked
4. **Verified fix independently** (Principle 7): Checked Stripe Dashboard + DB cross-reference
5. **Closed the loop** (Principle 10): Root-cause writeup + defect log entry

**Key insight**: Principle 3 (read actual code) is more valuable than Principle 4 (narrow test) when the test itself might be backwards. A narrow test only tells you something if you're certain you constructed it correctly — and reading the source is what lets you catch that you haven't.

### When to Stop and Ask

**Do NOT proceed without confirmation when**:
- Pushing to `main` or any protected branch
- Deleting or modifying production database rows
- Restarting live production services
- Restricting or changing SSH keys or deploy keys
- Anything where getting it wrong has no easy recovery

**Always ask first**: "Want me to proceed? This action is hard to reverse."

---

**This protocol is binding. Every defect investigation must follow these 10 principles and use the template above. No shortcuts, no "I'll just fix it quickly." Evidence-based, transparent, verified.**
