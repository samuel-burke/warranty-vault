import { useState } from "react";
import { Asset, Document } from "./AssetDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DocumentUpload } from "./DocumentUpload";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign, 
  Shield, 
  FileText, 
  Download, 
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AssetDetailProps {
  asset: Asset;
  onBack: () => void;
  onDocumentUpload: (document: Omit<Document, "id">) => void;
}

export function AssetDetail({ asset, onBack, onDocumentUpload }: AssetDetailProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Asset["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "retired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getWarrantyStatus = () => {
    if (!asset.warrantyExpiration) return null;
    
    const today = new Date();
    const warranty = new Date(asset.warrantyExpiration);
    const daysUntilExpiry = Math.ceil((warranty.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiry < 0) {
      return { 
        status: "Expired", 
        color: "text-red-600 bg-red-50", 
        icon: AlertTriangle,
        days: Math.abs(daysUntilExpiry) 
      };
    } else if (daysUntilExpiry < 30) {
      return { 
        status: "Expiring Soon", 
        color: "text-yellow-600 bg-yellow-50", 
        icon: AlertTriangle,
        days: daysUntilExpiry 
      };
    } else {
      return { 
        status: "Active", 
        color: "text-green-600 bg-green-50", 
        icon: Shield,
        days: daysUntilExpiry 
      };
    }
  };

  const getDocumentTypeIcon = (type: Document["type"]) => {
    return FileText;
  };

  const getDocumentTypeColor = (type: Document["type"]) => {
    switch (type) {
      case "receipt": return "bg-blue-100 text-blue-800";
      case "warranty": return "bg-green-100 text-green-800";
      case "manual": return "bg-purple-100 text-purple-800";
      case "other": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const warrantyStatus = getWarrantyStatus();
  const WarrantyIcon = warrantyStatus?.icon;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assets
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{asset.category}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{asset.name}</CardTitle>
                  <Badge variant="secondary" className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {asset.image ? (
                    <ImageWithFallback
                      src={asset.image}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Purchase Date</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(asset.purchaseDate)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-muted-foreground">Asset Value</label>
                      <div className="flex items-center gap-2 mt-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatCurrency(asset.value)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Category</label>
                    <p className="mt-1">{asset.category}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Documents</label>
                    <p className="mt-1">{asset.documents.length} file(s) attached</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warranty Status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Warranty Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {asset.warrantyExpiration ? (
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${warrantyStatus?.color || ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {WarrantyIcon && <WarrantyIcon className="h-4 w-4" />}
                      <span className="font-medium">{warrantyStatus?.status}</span>
                    </div>
                    <p className="text-sm">
                      {warrantyStatus?.status === "Expired" 
                        ? `Expired ${warrantyStatus.days} days ago`
                        : warrantyStatus?.status === "Expiring Soon"
                        ? `Expires in ${warrantyStatus.days} days`
                        : `${warrantyStatus?.days} days remaining`
                      }
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground">Expiration Date</label>
                    <p className="mt-1">{formatDate(asset.warrantyExpiration)}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No warranty information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Documents Section */}
      <div className="mt-6">
        <Tabs defaultValue="documents" className="w-full">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Attached Documents</CardTitle>
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {asset.documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-muted-foreground mb-2">No documents uploaded</h3>
                    <p className="text-sm text-muted-foreground mb-4">Upload receipts, warranties, and other important documents</p>
                    <Button onClick={() => setShowUploadDialog(true)}>
                      Upload First Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {asset.documents.map(document => {
                      const DocumentIcon = getDocumentTypeIcon(document.type);
                      return (
                        <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <DocumentIcon className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{document.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="secondary" className={getDocumentTypeColor(document.type)}>
                                  {document.type}
                                </Badge>
                                <span>•</span>
                                <span>{document.fileSize}</span>
                                <span>•</span>
                                <span>Uploaded {formatDate(document.uploadDate)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Asset created</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(asset.purchaseDate)}</p>
                    </div>
                  </div>
                  
                  {asset.documents.map(document => (
                    <div key={`history-${document.id}`} className="flex gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Document uploaded: {document.name}</h4>
                        <p className="text-sm text-muted-foreground">{formatDate(document.uploadDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DocumentUpload
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={onDocumentUpload}
      />
    </div>
  );
}