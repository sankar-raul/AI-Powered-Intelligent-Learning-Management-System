const generalSchemaOptions = {
	timestamps: true,
	validateBeforeSave: true
};

const virtualSchemaOptions = {
	toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
export const VIRTUAL_SCHEMA_OPTIONS = virtualSchemaOptions
export const GENERAL_SCHEMA_OPTIONS = generalSchemaOptions;
