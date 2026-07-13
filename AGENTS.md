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

## 🔍 Issue Investigation Protocol
When an issue or bug is reported, follow this rigorous evidence-based process:
1. **Analyze**: Thoroughly review the reported issue to understand the expected vs. actual behavior.
2. **Fact-Check**: Do not assume the cause of an error. Always read the related source files, logs, and specifications to gather hard evidence.
3. **Conclude**: Synthesize the findings to determine the definitive gap between the reported issue and the established facts.
