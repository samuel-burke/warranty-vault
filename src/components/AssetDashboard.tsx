import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "./ui/sidebar";
import { AssetGrid } from "./AssetGrid";
import { AssetDetail } from "./AssetDetail";
import { Package, FileText, Settings, Home, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { AddAssetDialog } from "./AddAssetDialog";
import { UserProfile } from "./UserProfile";
import Logo from "../assets/logo.svg";
export interface Asset {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  value: number;
  warrantyExpiration?: string;
  status: "active" | "maintenance" | "retired";
  image?: string;
  documents: Document[];
  description?: string;
}

export interface Document {
  id: string;
  name: string;
  type: "receipt" | "warranty" | "manual" | "other";
  uploadDate: string;
  fileUrl: string;
  fileSize: string;
}

const currentUser = 1;
const mockAssets: Asset[] = [
  {
    id: "1",
    name: "MacBook Pro 16-inch",
    category: "Electronics",
    purchaseDate: "2024-01-15",
    value: 2499,
    warrantyExpiration: "2026-01-15",
    status: "active",
    documents: [
      {
        id: "d1",
        name: "Purchase Receipt",
        type: "receipt",
        uploadDate: "2024-01-15",
        fileUrl: "/receipts/macbook-receipt.pdf",
        fileSize: "245 KB",
      },
      {
        id: "d2",
        name: "Warranty Document",
        type: "warranty",
        uploadDate: "2024-01-15",
        fileUrl: "/warranties/macbook-warranty.pdf",
        fileSize: "178 KB",
      },
    ],
  },
  {
    id: "2",
    name: "Herman Miller Chair",
    category: "Furniture",
    purchaseDate: "2023-11-20",
    value: 1200,
    warrantyExpiration: "2035-11-20",
    status: "active",
    documents: [
      {
        id: "d3",
        name: "Purchase Receipt",
        type: "receipt",
        uploadDate: "2023-11-20",
        fileUrl: "/receipts/chair-receipt.pdf",
        fileSize: "156 KB",
      },
    ],
  },
  {
    id: "3",
    name: "Industrial Printer",
    category: "Office Equipment",
    purchaseDate: "2023-08-10",
    value: 800,
    warrantyExpiration: "2024-08-10",
    status: "maintenance",
    documents: [
      {
        id: "d4",
        name: "User Manual",
        type: "manual",
        uploadDate: "2023-08-10",
        fileUrl: "/manuals/printer-manual.pdf",
        fileSize: "2.1 MB",
      },
    ],
  },
];

export function AssetDashboard() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "settings">(
    "dashboard"
  );

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleBackToGrid = () => {
    setSelectedAsset(null);
  };

  const handleAddAsset = async (newAsset: Omit<Asset, "id" | "documents">) => {
    const data = {
      name: newAsset.name,
      category: newAsset.category,
      purchaseDate: newAsset.purchaseDate,
      warrantyExpiration: newAsset.warrantyExpiration,
      value: newAsset.value,
      status: newAsset.status,
      description: newAsset.description || "",
      userId: currentUser,
    };
    try {
      console.log("Adding asset:", data);
      const res = await fetch("http://localhost:5050/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.log(res.json);
        throw new Error("Failed to create asset");
      }

      const createdAsset: Asset = await res.json();

      // update state with server response
      setAssets([...assets, createdAsset]);
      setShowAddDialog(false);
    } catch (err) {
      alert("Could not add asset. Please try again.");
    }
  };

  const handleDocumentUpload = (
    assetId: string,
    document: Omit<Document, "id">
  ) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
    };

    setAssets(
      assets.map((asset) =>
        asset.id === assetId
          ? { ...asset, documents: [...asset.documents, newDocument] }
          : asset
      )
    );

    if (selectedAsset?.id === assetId) {
      setSelectedAsset({
        ...selectedAsset,
        documents: [...selectedAsset.documents, newDocument],
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="font-medium">
              <img
                src={Logo}
                alt="Warranty Vault Logo"
                className="h-12 mb-2 inline-block mr-2"
              />
              Warranty Vault
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCurrentView("dashboard")}
                  isActive={currentView === "dashboard"}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Package className="h-4 w-4" />
                  Assets ({0})
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FileText className="h-4 w-4" />
                  Documents
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCurrentView("settings")}
                  isActive={currentView === "settings"}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <UserProfile />
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="font-medium">
                {selectedAsset ? selectedAsset.name : "Dashboard"}
              </h1>
            </div>
            {currentView === "dashboard" && !selectedAsset && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            )}
          </header>

          <main className="flex-1 overflow-auto">
            {currentView === "dashboard" && (
              <>
                {selectedAsset ? (
                  <AssetDetail
                    asset={selectedAsset}
                    onBack={handleBackToGrid}
                    onDocumentUpload={(document) =>
                      handleDocumentUpload(selectedAsset.id, document)
                    }
                  />
                ) : (
                  <AssetGrid assets={assets} onAssetClick={handleAssetClick} />
                )}
              </>
            )}
            {currentView === "settings" && (
              <div className="p-6">
                <h2 className="mb-4">Settings</h2>
                <p className="text-muted-foreground">
                  Settings panel coming soon...
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <AddAssetDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddAsset={handleAddAsset}
      />
    </SidebarProvider>
  );
}
