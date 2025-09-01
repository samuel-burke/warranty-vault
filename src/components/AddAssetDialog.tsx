import { useState } from "react";
import { Asset } from "./AssetDashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAsset: (asset: Omit<Asset, "id" | "documents">) => void;
}

const categories = [
  "Electronics",
  "Furniture",
  "Office Equipment",
  "Vehicles",
  "Tools",
  "Software",
  "Real Estate",
  "Other"
];

export function AddAssetDialog({ open, onOpenChange, onAddAsset }: AddAssetDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    purchaseDate: "",
    value: "",
    warrantyExpiration: "",
    status: "active" as Asset["status"],
    description: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Asset name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = "Purchase date is required";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Asset value is required";
    } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = "Please enter a valid positive number";
    }

    if (formData.warrantyExpiration && formData.purchaseDate) {
      const purchaseDate = new Date(formData.purchaseDate);
      const warrantyDate = new Date(formData.warrantyExpiration);
      if (warrantyDate <= purchaseDate) {
        newErrors.warrantyExpiration = "Warranty expiration must be after purchase date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const asset: Omit<Asset, "id" | "documents"> = {
      name: formData.name.trim(),
      category: formData.category,
      purchaseDate: formData.purchaseDate,
      value: Number(formData.value),
      warrantyExpiration: formData.warrantyExpiration || undefined,
      status: formData.status
    };

    onAddAsset(asset);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      category: "",
      purchaseDate: "",
      value: "",
      warrantyExpiration: "",
      status: "active",
      description: ""
    });
    setErrors({});
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="asset-name">Asset Name *</Label>
            <Input
              id="asset-name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="Enter asset name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="asset-category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase-date">Purchase Date *</Label>
              <Input
                id="purchase-date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => updateFormData("purchaseDate", e.target.value)}
                className={errors.purchaseDate ? "border-red-500" : ""}
              />
              {errors.purchaseDate && <p className="text-sm text-red-500 mt-1">{errors.purchaseDate}</p>}
            </div>

            <div>
              <Label htmlFor="asset-value">Asset Value (USD) *</Label>
              <Input
                id="asset-value"
                type="number"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={(e) => updateFormData("value", e.target.value)}
                placeholder="0.00"
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && <p className="text-sm text-red-500 mt-1">{errors.value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="warranty-expiration">Warranty Expiration</Label>
              <Input
                id="warranty-expiration"
                type="date"
                value={formData.warrantyExpiration}
                onChange={(e) => updateFormData("warrantyExpiration", e.target.value)}
                className={errors.warrantyExpiration ? "border-red-500" : ""}
              />
              {errors.warrantyExpiration && <p className="text-sm text-red-500 mt-1">{errors.warrantyExpiration}</p>}
            </div>

            <div>
              <Label htmlFor="asset-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Asset["status"]) => updateFormData("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="asset-description">Description (Optional)</Label>
            <Textarea
              id="asset-description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder="Enter additional details about the asset"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Asset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}