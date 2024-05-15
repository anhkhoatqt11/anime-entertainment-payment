import mongoose from "mongoose";

const skycoinPackageSchema = new mongoose.Schema({
    packageName: { type: String },
    quantity: { type: Number },
    price: { type: Number },
});

type SkycoinPackage = mongoose.InferSchemaType<typeof skycoinPackageSchema>;

export default mongoose.models.SkycoinPackage || mongoose.model<SkycoinPackage>("SkycoinPackage", skycoinPackageSchema);

