## 1. Data Source

**Original source:** Porsche Sanitized Sales Spreadsheet

**Purpose:**
This document describes the structure and meaning of the data used by the dashboard.

The production dataset is generated from the sanitized Porsche sales spreadsheet and exported to:


data/sales.json


---

# 2. Dataset Overview

The dataset represents vehicle sales transactions from Porsche vehicles sold in the United States.

Each record represents one vehicle sale.

Expected records:


100 sales transactions


---

# 3. Data Fields

| JSON Field     | Original Column         | Description                      | Usage                      |
| -------------- | ----------------------- | -------------------------------- | -------------------------- |
| id             | Generated               | Unique identifier for each sale  | Record identification      |
| date           | SaleDateSanitized       | Date of vehicle sale             | Time analysis              |
| brand          | Generated               | Vehicle manufacturer             | Fixed value: Porsche       |
| category       | Generated               | Product category                 | Fixed value: Automobile    |
| model          | PorscheModelSanitized   | Porsche vehicle model sold       | Vehicle analysis           |
| modelYear      | ModelYearSanitized      | Manufacturing year of vehicle    | Vehicle age analysis       |
| mileage        | VehicleMileageSanitized | Vehicle mileage at sale          | Vehicle condition analysis |
| paymentMethod  | PayMethodSanitized      | Payment method used              | Payment analysis           |
| city           | CitySanitized           | Sales city                       | Geographic analysis        |
| state          | StateSanitized          | Sales state                      | Geographic analysis        |
| deliveryStatus | DeliveryStatusSanitized | Delivery completion status       | Delivery analysis          |
| sales          | SalesPriceSanitized     | Final vehicle sales price in USD | Revenue calculations       |

---

# 4. Business Rules

## Sales Value

The dashboard revenue calculations must always use:


sales


This field represents the actual vehicle selling price in USD.

---

## Product Category

All records belong to:


Automobile


All vehicles are Porsche vehicles.

---

## Geography

All sales occurred in:


United States


Geographic analysis should use:


state
city


---

# 5. Dashboard Metrics

Current KPIs:

## Total Sales

Sum of all vehicle selling prices.

Source:


sales


---

## Vehicles Sold

Count of sales transactions.

Source:


id


---

## Average Vehicle Price

Calculation:


Total Sales / Number of Vehicles Sold


---

## Top Selling Region

Calculated from:


state


grouped by:


sales


---

# 6. Data Quality Rules

Before updating the production dataset, verify:

* sales values are numeric;
* vehicle models are populated;
* states are valid US state codes;
* delivery status is populated;
* no duplicate transaction identifiers exist.

---

# 7. Version History

## Version 1.0

Initial documentation created during dashboard development.

Dataset migrated from generic sales example data to Porsche vehicle sales data.
