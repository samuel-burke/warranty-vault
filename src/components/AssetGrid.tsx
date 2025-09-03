import { useState } from "react";
import { Asset } from "./AssetDashboard";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Search,
  Package,
  Calendar,
  DollarSign,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AssetGridProps {
  assets: Asset[];
  onAssetClick: (asset: Asset) => void;
}

export function AssetGrid({ assets, onAssetClick }: AssetGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || asset.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || asset.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(assets.map((asset) => asset.category)));

  const getStatusColor = (status: Asset["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWarrantyStatus = (warrantyExpiration?: string) => {
    if (!warrantyExpiration) return null;

    const today = new Date();
    const warranty = new Date(warrantyExpiration);
    const daysUntilExpiry = Math.ceil(
      (warranty.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (daysUntilExpiry < 0) {
      return { status: "expired", color: "text-red-600", icon: AlertTriangle };
    } else if (daysUntilExpiry < 30) {
      return {
        status: "expiring",
        color: "text-yellow-600",
        icon: AlertTriangle,
      };
    } else {
      return { status: "valid", color: "text-green-600", icon: Shield };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="font-medium">{0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="font-medium">
                  {formatCurrency(
                    assets.reduce((sum, asset) => sum + asset.value, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Under Warranty</p>
                <p className="font-medium">
                  {
                    assets.filter((asset) => {
                      if (!asset.warrantyExpiration) return false;
                      return new Date(asset.warrantyExpiration) > new Date();
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="font-medium">
                  {
                    assets.filter((asset) => asset.status === "maintenance")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-muted-foreground">No assets found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const warrantyStatus = getWarrantyStatus(asset.warrantyExpiration);
            const WarrantyIcon = warrantyStatus?.icon;

            return (
              <Card
                key={asset.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onAssetClick(asset)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                    {asset.image ? (
                      <ImageWithFallback
                        src={asset.image}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{asset.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {asset.category}
                      </p>
                    </div>
                    {warrantyStatus && WarrantyIcon && (
                      <WarrantyIcon
                        className={`h-4 w-4 ${warrantyStatus.color} ml-2 flex-shrink-0`}
                      />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Value
                      </span>
                      <span className="font-medium">
                        {formatCurrency(asset.value)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Purchased
                      </span>
                      <span className="text-sm">
                        {formatDate(asset.purchaseDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Documents
                      </span>
                      <span className="text-sm">{0}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(asset.status)}
                      >
                        {asset.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
