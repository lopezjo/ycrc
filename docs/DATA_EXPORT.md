# Data Export Format

This document describes the JSON export format used to share youth information with resource providers, reducing duplicate data entry.

## Standard Export Format

The standard export format includes all information collected during the conversation, formatted for easy use by resource providers.

### Structure

```json
{
  "exportDate": "ISO 8601 timestamp",
  "exportVersion": "1.0",
  "demographics": {
    "age": 18,
    "location": "City name",
    "situation": "Description of situation",
    "durationOfSituation": "Duration category"
  },
  "eligibility": {
    "hasId": true/false,
    "hasIncome": true/false,
    "inSchool": true/false
  },
  "selectedResources": [
    {
      "resourceId": "unique-resource-id",
      "resourceName": "Resource Name",
      "category": "Category",
      "contact": {
        "phone": "phone number",
        "email": "email address",
        "address": "physical address"
      }
    }
  ],
  "resourceAssessments": {
    "resourceId": {
      "resourceName": "Resource Name",
      "responses": {
        "questionField": "answer value"
      },
      "assessedDate": "ISO 8601 timestamp"
    }
  },
  "consent": {
    "dataShared": true,
    "shareWithProviders": true,
    "exportDate": "ISO 8601 timestamp"
  }
}
```

## HMIS-Compatible Format

For providers using Homeless Management Information System (HMIS), a simplified HMIS-compatible format is available.

### Structure

```json
{
  "PersonalInformation": {
    "Age": 18
  },
  "ResidencePrior": {
    "LengthOfStay": "Duration",
    "LivingSituation": "Situation description"
  },
  "ProjectEntry": {
    "EntryDate": "YYYY-MM-DD"
  },
  "IncomeAndSources": {
    "IncomeFromAnySource": true/false
  }
}
```

## Usage

1. Youth completes the conversation and selects resources
2. Youth clicks "Export Data for Providers"
3. System generates JSON file
4. Youth can share the file with providers via:
   - Email attachment
   - File upload on provider websites
   - In-person file sharing (USB, phone, etc.)

## Privacy Considerations

- All exports are user-initiated
- Users can choose what to include
- No data is automatically transmitted
- Users maintain full control over their information

## Integration

Providers can:
- Import the JSON directly into their systems
- Use it to pre-populate intake forms
- Reference it during intake conversations
- Store it in their case management systems

