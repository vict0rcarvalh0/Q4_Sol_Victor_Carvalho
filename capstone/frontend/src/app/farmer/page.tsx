"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeliverModal } from "@/components/DeliverModal";
import { DeleteProductConfirmationModal } from "@/components/DeleteProductConfirmationModal";
import { getStoredUser } from "@/utils/storage";
import {
  createProduct,
  deleteProduct,
  getProductByFarmer,
} from "@/services/product";
import { toast } from "@/hooks/use-toast";
import {
  ArrowUpDown,
  History,
  Truck,
  DollarSign,
  Package,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  fair_location: string;
  unit: string;
  total_amount: number;
  price_per_unit: number;
  available_quantity: number;
  status: string;
  farmer_id: number;
  created_at: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    fair_location: "",
    unit: "",
    total_amount: "",
    price_per_unit: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = getStoredUser();
        if (!user || !user.id) {
          throw new Error("No farmer data found in local storage.");
        }

        const fetchedProducts = await getProductByFarmer(user.id);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Failed to fetch products",
          description: "Could not load your products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setFetchingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const user = getStoredUser();
      if (!user || !user.id) {
        throw new Error("No farmer data found in local storage.");
      }

      console.log("User:", user);

      const payload = {
        ...formData,
        total_amount: parseFloat(formData.total_amount),
        price_per_unit: parseFloat(formData.price_per_unit),
        available_quantity: parseFloat(formData.total_amount),
        status: "available",
        farmer_id: user.id,
      };
      console.log("Payload:", payload);

      const createdProduct = await createProduct(payload);
      console.log("Product created:", createdProduct);

      setFormData({
        name: "",
        description: "",
        category: "",
        fair_location: "",
        unit: "",
        total_amount: "",
        price_per_unit: "",
      });

      toast({
        title: "Product created",
        description: "Your product was successfully added to the marketplace.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating product:", error);

      toast({
        title: "Failed to create product",
        description:
          "There was an issue creating your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverClick = (productId: number) => {
    setSelectedProductId(productId);
    setDeliverModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        console.log("Deleting product:", productToDelete);
        await deleteProduct(productToDelete.id);
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        toast({
          title: "Product removed",
          description: "The product was successfully removed from the catalog.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Failed to remove product",
          description:
            "There was an issue removing the product. Please try again.",
          variant: "destructive",
        });
      } finally {
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-12">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="bg-white text-black">
          <CardTitle className="text-3xl font-bold">
            Register an Agricultural Product
          </CardTitle>
          <CardDescription className="text-gray-800">
            Add your new product to the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-m">
                Product Name
              </Label>
              <Input
                id="name"
                placeholder="Enter product name"
                className="text-m"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-m">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="text-m"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-m">
                  Category
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fruit">Fruit</SelectItem>
                    <SelectItem value="Vegetable">Vegetable</SelectItem>
                    <SelectItem value="Sweet">Sweet</SelectItem>
                    <SelectItem value="Fried">Fried</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-m">
                  Unit
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("unit", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_amount" className="text-m">
                Total Amount
              </Label>
              <Input
                id="total_amount"
                type="number"
                placeholder="Enter total amount"
                className="text-m"
                value={formData.total_amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_per_unit" className="text-m">
                Price Per Unit
              </Label>
              <Input
                id="price_per_unit"
                type="number"
                placeholder="Enter price per unit"
                className="text-m"
                value={formData.price_per_unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fair_location" className="text-m">
                Fair Location (e.g: Street, number)
              </Label>
              <Input
                id="fair_location"
                placeholder="Enter fair location"
                className="text-m"
                value={formData.fair_location}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button
                type="submit"
                className="w-full sm:w-auto text-m transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-8 py-3 rounded-md text-black font-bold"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {fetchingProducts ? (
        <p className="text-center text-lg">Loading products...</p>
      ) : (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">Your Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product: Product) => (
              <Card
                key={product.id}
                className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src="/corn.jpg"
                        alt="Product"
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2 text-blue-500" />
                        <p>
                          Total:{" "}
                          <span className="font-semibold">
                            {product.total_amount}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2 text-green-500" />
                        <p>
                          Available:{" "}
                          <span className="font-semibold">
                            {product.available_quantity}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
                        <p>
                          Price:{" "}
                          <span className="font-semibold">
                            ${product.price_per_unit}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.status === "closed" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-grow"
                          >
                            <History className="w-4 h-4 mr-2" />
                            Transaction History
                          </Button>
                          <Badge variant="secondary" className="px-2 py-1">
                            <X className="w-4 h-4 mr-2" />
                            Closed
                          </Badge>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <History className="w-4 h-4 mr-2" />
                            Transaction History
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            Remove from Catalog
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDeliverClick(product.id)}
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Deliver
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <DeleteProductConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        productName={productToDelete?.name || ""}
      />

      <DeliverModal
        isOpen={deliverModalOpen}
        onClose={() => setDeliverModalOpen(false)}
        productId={selectedProductId || 0}
      />
    </div>
  );
}
