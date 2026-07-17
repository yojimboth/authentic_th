# Mock Asset Registry

This file tracks assets provided in the `/temp` folder to be integrated during the Frontend-First implementation phase.

## Restaurant Logos
| Tenant Name | Filename | Target Use Case |
| :--- | :--- | :--- |
| Siam Authentic | `siam_authientic.png` | Storefront Header, Order Confirmation |
| Thai Breeze | `thai_brezze_logo.png` | Storefront Header, Order Confirmation |

## Implementation Note
Assets should be moved from `/temp` to `src/assets/mocks/logos/` (within the respective app project) during the UI implementation phase. 
The mocked backend should return these local paths or a dummy URL that resolves to these images for initial UX validation.
