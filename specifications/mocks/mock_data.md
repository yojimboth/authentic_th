# Single Source of Truth: Mock Data Specification
**Project:** authentic_th  
**Version:** 1.0  
**Region:** Australia (AU)  
**Currency:** AUD ($)

---

## 👤 1. Customer Profiles
Consistent user identities for authentication mocks and order history simulation.

| User ID (UUID) | Full Name | Email | Phone | Loyalty Points | Primary Address |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `c0a1b2c3-d4e5-4f6g-8h9i-j0k1l2m3n4o5` | **Liam Wilson** | liam.wilson@example.com.au | +61 412 345 678 | 450 | 12 George St, Sydney NSW 2000 |
| `c1a2b3c4-d5e6-4f7g-8h9i-j0k1l2m3n4o6` | **Sarah Jenkins** | s.jenkins@webmail.com.au | +61 423 456 789 | 1,200 | 45 St Kilda Rd, Melbourne VIC 3004 |
| `c2a3b4c5-d6e7-4f8g-8h9i-j0k1l2m3n4o7` | **Noah Thompson** | noah.t@outlook.com.au | +61 434 567 890 | 85 | 102 Queen St, Brisbane QLD 4000 |
| `c3a4b5c6-d7e8-4f9g-8h9i-j0k1l2m3n4o8` | **Chloe Zhang** | chloe.z@icloud.com.au | +61 445 678 901 | 2,100 | 88 Hay St, Perth WA 6000 |
| `c4a5b6c7-d8e9-4f0g-8h9i-j0k1l2m3n4o9` | **Oliver Smith** | oliver.smith@gmail.com.au | +61 456 789 012 | 320 | 23 North Terrace, Adelaide SA 5000 |

---

## 🍲 2. Restaurant 1: Siam Authentic Thai (Main)
**Location:** 15-17 Darlinghurst Rd, Sydney NSW 2010  
**Category Layout:** 9 Categories

### Category: Promotion
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `m1-p1` | Lunch Special Bundle | Green Curry + Jasmine Rice + Thai Iced Tea | $22.50 | 2 | Yes |
| `m1-p2` | Family Feast Pack | 3 Mains, 2 Entrees, Large Mixed Rice | $85.00 | 2 | Yes |
| `m1-p3` | Date Night Combo | 2 Mains, 1 Entree, 2 Mango Sticky Rice | $55.00 | 1 | Yes |
| `m1-p4` | Happy Hour Spring Rolls | 6pcs Golden Spring Rolls (Mon-Fri 3-5pm) | $8.00 | 0 | Yes |
| `m1-p5` | Weekly Chef's Choice | Rotates daily. Ask staff for today's special | $18.00 | 3 | Yes |
| `m1-p6` | First-Timer Taster | Small samples of 4 signature dishes | $20.00 | 2 | Yes |

### Category: Entree
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `m1-e1` | Chicken Satay | Grilled skewers with peanut sauce | $12.00 | 1 | Yes |
| `m1-e2` | Pork Spring Rolls | Hand-rolled vegetables and minced pork | $10.00 | 0 | Yes |
| `m1-e3` | Fish Cakes (Tod Mun Pla) | Traditional Thai fish cakes with cucumber relish | $13.00 | 1 | Yes |
| `m1-e4` | Money Bags | Crispy parcels filled with shrimp and pork | $14.00 | 0 | Yes |
| `m1-e5` | Thai Chicken Wings | Deep fried wings with lemongrass glaze | $15.00 | 2 | Yes |
| `m1-e6` | Vegetable Tempura | Assorted seasonal vegetables in light batter | $11.00 | 0 | Yes |

### Category: Soup
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `m1-s1` | Tom Yum Goong | Spicy and sour soup with prawns | $14.00 | 3 | Yes |
| `m1-s2` | Tom Kha Gai | Coconut soup with chicken and galangal | $14.00 | 1 | Yes |
| `m1-s3` | Woon Sen Soup | Glass noodle soup with minced pork | $13.00 | 1 | Yes |
| `m1-s4` | Clear Vegetable Soup | Light broth with tofu and mixed greens | $12.00 | 0 | Yes |
| `m1-s5` | Tom Yum Seafood | Spicy broth with squid, prawns, and mussels | $16.00 | 4 | Yes |
| `m1-s6` | Spicy Tofu Soup | Silken tofu with chili and lime broth | $13.00 | 2 | Yes |

### Category: BBQ
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `m1-b1` | Crying Tiger Beef | Grilled marinated sirloin with spicy dipping sauce | $28.00 | 3 | Yes |
| `m1-b2` | Grilled Pork Neck | Marinated pork neck with toasted rice powder | $24.00 | 2 | Yes |
| `m1-b3` | Gai Yang | Traditional Thai grilled half-chicken | $22.00 | 1 | Yes |
| `m1-b4` | BBQ Seafood Platter | Mixed grill with lemongrass garlic butter | $35.00 | 1 | Yes |
| `m1-b5` | Spicy Grilled Squid | Whole squid with chili-lime glaze | $26.00 | 3 | Yes |
| `m1-b6` | Grilled Tofu Steak | Marinated tofu with peanut dipping sauce | $18.00 | 1 | Yes |

### Category: Thai Salad
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `m1-sl1` | Som Tum (Papaya Salad) | Shredded papaya, lime, chili, and peanuts | $16.00 | 3 | Yes |
| `m1-sl2` | Larb Gai | Spicy minced chicken salad with mint | $18.00 | 3 | Yes |
| `m1-sl3` | Yum Nua | Spicy grilled beef salad with vegetables | $22.00 | 2 | Yes |
| `m1-sl4` | Glass Noodle singularities | Spicy Yum Woon Sen with seafood | $19.00 | 2 | Yes |
| `m1-sl5` | Pomelo Salad | Fresh pomelo with shrimp and coconut | $18.00 | 1 | Yes |
| `m1-sl6` | Thai Cucumber Salad | Sweet and sour cucumber with sesame | $12.00 | 0 | Yes |

### Category: Curries
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `m1-c1` | Green Curry | Spicy coconut curry with bamboo shoots | $21.00 | 3 | Yes |
| `m1-c2` | Red Curry | Rich coconut curry with red chilies | $21.00 | 3 | Yes |
| `m1-c3` | Panang Curry | Thick, creamy peanut-based curry | $22.00 | 2 | Yes |
| `m1-c4` | Massaman Curry | Mild potato and peanut curry (slow cooked) | $23.00 | 1 | Yes |
| `m1-c5` | Jungle Curry | Spicy curry without coconut milk | $21.00 | 4 | Yes |
| `m1-c6` | Yellow Curry | Mild coconut curry with turmeric | $21.00 | 1 | Yes |

### Category: Stir Fries
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `m1-sf1` | Basil Stir Fry (Pad Krapow) | Minced meat with holy basil and chili | $20.00 | 3 | Yes |
| `m1-sf2` | Cashew Nut Chicken | Stir fried chicken with roasted cashews | $20.00 | 1 | Yes |
| `m1-sf3` | Ginger Stir Fry | Sliced meat with fresh ginger and mushrooms | $19.00 | 1 | Yes |
| `m1-sf4` | Garlic & Pepper Pork | Stir fried pork with crushed garlic | $19.00 | 1 | Yes |
| `m1-sf5` | Mixed Vegetable Stir Fry | Seasonal veggies in soy and oyster sauce | $17.00 | 0 | Yes |
| `m1-sf6` | Spicy Lemongrass Beef | Beef stir fried with lemongrass and chili | $22.00 | 3 | Yes |

### Category: Rices & Noodles
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- |, la | `m1-rn1` | Pad Thai | Classic stir fried rice noodles with shrimp | $20.00 | 1 | Yes |
| `m1-rn2` | Pad See Ew | Wide rice noodles with soy sauce and broccoli | $19.00 | 0 | Yes |
| `m1-rn3` | Drunken Noodles | Spicy wide rice noodles with basil | $20.00 | 3 | Yes |
| `m1-rn4` | Pineapple Fried Rice | Jasmine rice with pineapple and cashew | $21.00 | 0 | Yes |
| `m1-rn5` | Thai Fried Rice | Classic jasmine fried rice with egg | $18.00 | 1 | Yes |
| `m1-rn6` | Khao Soi | Northern Thai coconut curry noodle soup | $22.00 | 2 | Yes |

### Category: Fish
| Item ID (UUID) | Name | Description | Price | Spice | Avail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `m1-f1` | Steamed Sea Bass | Lime, garlic, and chili steamed whole fish | $38.00 | 2 | Yes |
| `m1-f2` | Deep Fried Snapper | Crispy fish with sweet and sour mango sauce | $36.00 | 1 | Yes |
| `m1-f3` | Red Curry Fish | White fish fillets in creamy red curry | $26.00 | 3 | Yes |
| `m1-f4` | Garlic Fish Fillet | Pan-fried fish with garlic and peppercorns | $25.00 | 0 | Yes |
| `m1-f5` | Spicy Basil Fish | Fish fillet stir fried with holy basil | $25.00 | 3 | Yes |
| `m1-f6` | Three Flavor Fish | Fried fish with sweet, sour, and spicy sauce | $34.00 | 2 | Yes |

---

## 🍃 3. Restaurant 2: Thai Breeze Express (Satellite)
**Location:** 200 George St, Sydney NSW 2000  
**Category Layout:** 7 Categories (Subset of Restaurant 1)

### Active Categories:
1. **Promotion** (Overlapping)
2. **Entree** (Overlapping)
3. **Soup** (Overlapping)
4. **Thai Salad** (Overlapping)
5. **Curries** (Overlapping)
6. **Stir Fries** (Overlapping)
7. **Rices & Noodles** (Overlapping)
*(Excluded: BBQ and Fish)*

### Menu Items (Sampling Overlap and Uniqueness)
*Note: IDs for overlapping items remain identical to Restaurant 1. Unique items get new IDs.*

| Category | Item ID | Name | Price | Spice | Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Promotion** | `m1-p1` | Lunch Special Bundle | $21.00 | 2 | Same Item |
| **Promotion** | `m2-p7` | Express Bento Box | $16.00 | 2 | **Unique** |
| **Entree** | `m1-e1` | Chicken Satay | $11.00 | 1 | Same Item |
| **Entree** | `m2-e7` | Crispy Tofu Cubes | $9.00 | 0 | **Unique** |
| **Soup** | `m1-s1` | Tom Yum Goong | $13.00 | 3 | Same Item |
| **Soup** | `m1-s2` | Tom Kha Gai | $13.00 | 1 | Same Item |
| **Soup** | `m2-s7` | Miso-Thai Fusion | $11.00 | 0 | **Unique** |
| **Thai Salad** | `m1-sl1` | Som Tum | $15.00 | 3 | Same Item |
| **Thai Salad** | `m2-sl7` | Spicy Glass Noodle (Small) | $14.00 | 2 | **Unique** |
| **Curries** | `m1-c1` | Green Curry | $19.00 | 3 | Same Item |
| **Curries** | `m1-c4` | Massaman Curry | $20.00 | 1 | Same Item |
| **Stir Fries** | `m1-sf1` | Basil Stir Fry | $18.00 | 3 | Same Item |
| **Stir Fries** | `m2-sf7` | Honey Garlic Chicken | $17.00 | 0 | **Unique** |
| **Rices/Noodle** | `m1-rn1` | Pad Thai | $18.00 | 1 | Same Item |
| **Rices/Noodle** | `m1-rn2` | Pad See Ew | $17.00 | 0 | Same Item |
| **Rices/Noodle** | `m2-rn7` | Egg Fried Rice (Budget) | $14.00 | 0 | **Unique** |

---

## 🛠️ 4. Global Admin Data
System-wide configurations used by the Admin Dashboard to calculate revenue and rewards.

### Platform Financials
| Parameter | Value | Type | Description |
| :--- | :--- | :--- | :--- |
| `platform_fee_percent` | `15%` | Percentage | Commission taken from each order |
| `platform_fee_fixed` | `$0.50` | Fixed | Base transaction fee per order |
| `payment_gateway_fee` | `2.9% + $0.30` | Combined | Stripe processing processing fees (pass-through) |

### Loyalty Program
| Parameter | Value | Description |
| :--- | :--- | :--- |
| `loyalty_earn_rate` | `$1.00 = 1 Point` | Points earned per AUD spent |
| `loyalty_redeem_value` | `100 Points = $5.00` | Discount value for point redemption |
| `minimum_redeem` | `500 Points` | Minimum points required to apply discount |

---

## 🖼️ 5. Image Placeholder Specification
To maintain consistency in UI mocks, use the following URL patterns:
- **Menu Items**: `https://placehold.co/400x300?text=[Item+Name]`
- **Category Icons**: `https://placehold.co/100x100?text=[Category+Name]`
- **Customer Avatars**: `https://i.pravatar.cc/150?u=[user_id]`
