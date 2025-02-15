'use client'

import { useState } from "react";
import { initializeFarmLink, createProduct, purchaseProduct, deliverProduct } from "@/services/solana";

export default function SolanaPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInitialize = async () => {
    try {
      setLoading(true);
      setMessage("Initializing FarmLink...");

      await initializeFarmLink("FarmLink Example", 100);
      setMessage("FarmLink Initialized Successfully!");
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      setMessage("Creating product...");

      await createProduct(1000, "Tomato", "TOM", "https://example.com/tomato.jpg");
      setMessage("Product Created Successfully!");
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseProduct = async () => {
    try {
      setLoading(true);
      setMessage("Purchasing product...");

      await purchaseProduct();
      setMessage("Product Purchased Successfully!");
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverProduct = async () => {
    try {
      setLoading(true);
      setMessage("Delivering product...");

      await deliverProduct();
      setMessage("Product Delivered Successfully!");
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Solana Blockchain Interaction</h1>
      <div>
        <button onClick={handleInitialize} disabled={loading}>
          Initialize FarmLink
        </button>
        <button onClick={handleCreateProduct} disabled={loading}>
          Create Product
        </button>
        <button onClick={handlePurchaseProduct} disabled={loading}>
          Purchase Product
        </button>
        <button onClick={handleDeliverProduct} disabled={loading}>
          Deliver Product
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
}
