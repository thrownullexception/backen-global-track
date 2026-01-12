import { ConflictError, BadRequestError } from "./app-error";

export function extractDbError (error: any): Error {
    // MySQL duplicate key
    if (error.cause?.code === "ER_DUP_ENTRY")
    {
        if (error.sqlMessage?.includes("profiles_email_unique"))
        {
            return new ConflictError("Email already exists");
        }

        if (error.sqlMessage?.includes("profiles_partner_code_unique"))
        {
            return new ConflictError("Partner code already exists");
        }

        return new ConflictError("Duplicate record");
    } else
    {
        return new ConflictError(error.cause?.sqlMessage || error.message);
    }

    // Foreign key constraint
    if (error?.code === "ER_NO_REFERENCED_ROW_2")
    {
        return new BadRequestError("Invalid foreign key reference");
    }

    // Not a DB error → rethrow
    return error;
}
