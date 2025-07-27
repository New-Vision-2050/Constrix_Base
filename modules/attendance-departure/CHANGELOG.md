# Attendance Departure Module - Changelog

## 2025-07-23

### Breaking Changes

#### `attendance.ts` Type Definitions

1. **AppliedConstraint Interface**:
   - `name` field renamed to `constraint_name` for consistency
   - `config` field renamed to `constraint_config` for consistency
   - Added new field `constraint_type` to specify constraint type information
   
   **Migration Required**:
   - Update all code that references `AppliedConstraint.name` to use `AppliedConstraint.constraint_name`
   - Update all code that references `AppliedConstraint.config` to use `AppliedConstraint.constraint_config`
   
   **`constraint_type` Field Documentation**:
   - Possible values: `'standard'`, `'custom'`, `'branch-specific'`
   - Purpose: Identifies the scope and application method of the attendance constraint
     - `'standard'`: Applied globally to all employees regardless of location
     - `'custom'`: Applied to specific employees based on custom rules
     - `'branch-specific'`: Applied differently based on branch locations

2. **Other Changes**:
   - Fixed boolean handling in components to use proper boolean values instead of 0/1 integer comparisons
   - Updated column definitions in table config to match the actual property names
   - Standardized string quotes to use single quotes throughout the codebase

### Non-Breaking Changes

1. **ApproverDialog.tsx**:
   - Improved precision in working hours calculations by using integer arithmetic to avoid floating point errors
   - Enhanced code readability with functional programming patterns (using reduce instead of forEach)

2. **UI Components**:
   - Improved initialization of status variables with meaningful defaults
   - Enhanced boolean logic in conditional statements
