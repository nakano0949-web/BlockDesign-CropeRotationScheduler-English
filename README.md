# Crop Rotation Scheduler (AG/PG Block Design)

A professional crop rotation planning tool that uses finite geometry algorithms—**Affine Plane AG(2,p)** and **Projective Plane PG(2,p)**—to optimize planting cycles and maintain soil fertility.

## 🚀 Features

- **Advanced Mathematical Models**:
  - **Affine Plane AG(2,p)**: Optimizes $p^2$ vegetables over $p+1$ years. Ideal for multi-ridge field management.
  - **Projective Plane PG(2,p)**: Covers all possible combinations for $p^2+p+1$ plots, ensuring maximum diversity.
- **Soil Fertility Analysis**: Automatically calculates the nitrogen balance based on vegetable families.
  - **Soil Accumulation Mode**: Displays when the cycle is sustainable.
  - **Soil Depletion Mode**: Warns when there is a risk of nitrogen deficiency.
- **Extensive Database**: Pre-configured with over 15 vegetable families (Solanaceae, Brassicaceae, Fabaceae, etc.) including soil characteristics and companion planting advice.
- **Multilingual Support**: Available in both Japanese and English.

## 📁 File Structure

```text
.
    
├── index.html     # English Version
├── script.js      # Core Logic & Algorithms (Shared)
└── style.css      # Styling & Layout (Shared)
