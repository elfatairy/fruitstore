import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createProduct, getAllProducts } from "../backend/products";
import { getAllClients } from "../backend/clients";
import { getAllSuppliers } from "../backend/suppliers";
import { importItemHelper } from "../backend/suppliers";
import { exportItemHelper } from "../backend/clients";
import "./styles/productsPage.css";
import Layout from "./Layout";
import { Item, PageType, Product, Client, Supplier } from "../utils/types";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function ProductManagementPage() {
  const { db } = useAuth();
  const navigate = useNavigate();

  // State for products, suppliers, and clients
  const [products, setProducts] = useState<Map<string, Product>>();
  const [clients, setClients] = useState<Map<string, Client>>();
  const [suppliers, setSuppliers] = useState<Map<string, Supplier>>();

  // Modal states
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Form states
  const [newProductName, setNewProductName] = useState("");
  const [importFormData, setImportFormData] = useState({
    supplierUuid: "",
    items: [
      {
        productUuid: "",
        mass: 0,
        boxes: 0,
        price: 0,
      },
    ],
  });
  const [exportFormData, setExportFormData] = useState({
    clientUuid: "",
    items: [
      {
        itemUuid: "",
        mass: 0,
        boxes: 0,
        price: 0,
      },
    ],
  });

  // Search and dropdown states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSupplierTerm, setSearchSupplierTerm] = useState("");
  const [searchClientTerm, setSearchClientTerm] = useState("");
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      await getProducts();
      await getClients();
      await getSuppliers();
    };
    fetchInitialData();
  }, []);

  // Data fetching functions
  const getProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts(db!);
      if (fetchedProducts) {
        setProducts(fetchedProducts);
        console.log(fetchedProducts);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const getClients = async () => {
    try {
      const fetchedClients = await getAllClients(db!);
      if (fetchedClients) {
        setClients(fetchedClients);
      }
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const getSuppliers = async () => {
    try {
      const fetchedSuppliers = await getAllSuppliers(db!);
      if (fetchedSuppliers) {
        setSuppliers(fetchedSuppliers);
      }
    } catch (error) {
      console.error("Error fetching suppliers", error);
    }
  };

  // Utility functions
  const calculateWeight = (items?: Map<string, Item>) => {
    if (!items) return 0;
    let weight = 0;
    items.forEach((item) => {
      weight += item.mass;
    });
    return weight;
  };

  const calculateBoxes = (items?: Map<string, Item>) => {
    if (!items) return 0;
    let boxes = 0;
    items.forEach((item) => {
      boxes += item.boxes;
    });
    return boxes;
  };

  // Filtering functions for dropdowns
  const filteredSuppliers = suppliers
    ? [...suppliers.entries()].filter(
        ([_, supplier]) =>
          supplier.username
            .toLowerCase()
            .includes(searchSupplierTerm.toLowerCase()) ||
          supplier.number?.includes(searchSupplierTerm)
      )
    : [];

  const filteredClients = clients
    ? [...clients.entries()].filter(
        ([_, client]) =>
          client.username
            .toLowerCase()
            .includes(searchClientTerm.toLowerCase()) ||
          client.number?.includes(searchClientTerm)
      )
    : [];

  // Form submission handlers
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    try {
      await createProduct(db!, newProductName);
      await getProducts();
      setNewProductName("");
      setIsAddProductModalOpen(false);
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFormData.supplierUuid) return;

    try {
      for (const item of importFormData.items) {
        if (item.productUuid) {
          await importItemHelper(db!, importFormData.supplierUuid, {
            productUuid: item.productUuid,
            mass: item.mass,
            boxes: item.boxes,
            price: item.price,
          });
        }
      }
      await getProducts();
      setImportFormData({
        supplierUuid: "",
        items: [{ productUuid: "", mass: 0, boxes: 0, price: 0 }],
      });
      setIsImportModalOpen(false);
    } catch (error) {
      console.error("Error importing items", error);
    }
  };

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exportFormData.clientUuid) return;

    try {
      for (const item of exportFormData.items) {
        if (item.itemUuid) {
          await exportItemHelper(db!, exportFormData.clientUuid, {
            itemUuid: item.itemUuid,
            mass: item.mass,
            boxes: item.boxes,
            price: item.price,
          });
        }
      }
      await getProducts();
      setExportFormData({
        clientUuid: "",
        items: [{ itemUuid: "", mass: 0, boxes: 0, price: 0 }],
      });
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Error exporting items", error);
    }
  };

  // Dynamic form helpers
  const addImportItem = () => {
    setImportFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productUuid: "",
          mass: 0,
          boxes: 0,
          price: 0,
        },
      ],
    }));
  };

  const addExportItem = () => {
    setExportFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemUuid: "",
          mass: 0,
          boxes: 0,
          price: 0,
        },
      ],
    }));
  };

  // Dropdown selection handlers
  const handleSupplierSelect = (uuid: string, username: string) => {
    setImportFormData((prev) => ({
      ...prev,
      supplierUuid: uuid,
    }));
    setSearchSupplierTerm(username);
    setIsSupplierDropdownOpen(false);
  };

  const handleClientSelect = (uuid: string, username: string) => {
    setExportFormData((prev) => ({
      ...prev,
      clientUuid: uuid,
    }));
    setSearchClientTerm(username);
    setIsClientDropdownOpen(false);
  };

  // Filtering products based on search term
  const filteredProducts = products
    ? [...products.entries()].filter(([_, product]) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Layout page={PageType.PRODUCTS}>
      <div className="top">
        <h2 className="title">المنتجات</h2>
        <div className="btns">
          <button
            className="btn add"
            onClick={() => setIsAddProductModalOpen(true)}
          >
            <span>اضافة منتج جديد</span>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g id="Edit / Add_Plus">
                <path
                  id="Vector"
                  d="M6 12H12M12 12H18M12 12V18M12 12V6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </button>

          <button
            className="btn add receipt"
            onClick={() => setIsImportModalOpen(true)}
          >
            <span style={  {padding: '11px'}}>توريد منتجات</span>
        
          </button>

          <button
            className="btn add pay"
            onClick={() => setIsExportModalOpen(true)}
          >
            <span style={  {padding: '11px'}}>بيع منتجات</span>
              
          </button>
        </div>
      </div>

      <div className="bottom">
        <div className="input-container">
          <input
            className="search"
            placeholder="ابحث عن منتجات"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#777"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="bottom-content">
          {filteredProducts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>الصناديق المتاحة</th>
                  <th>الوزن المتاح</th>
                  <th>الاسم</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(([id, product]) => (
                  <tr key={id} onClick={() => navigate(`/products/${id}`)}>
                    <td>{calculateBoxes(product.items)}</td>
                    <td>{calculateWeight(product.items)}</td>
                    <td>{product.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No products found. Add a new product to get started.</div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setIsAddProductModalOpen(false)}
            >
              &times;
            </span>
            <h2>  إضافة منتج جديد</h2>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="اسم المنتج "
                required
              />
              <button type="submit"> إضافة المنتج</button>
            </form>
          </div>
        </div>
      )}
 
      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsImportModalOpen(false)}>
              ×
            </span>
            <h2>توريد منتجات</h2>
            <form onSubmit={handleImport}>
              <div className="form-group">
                <label>المورد</label>
                <input
                  type="text"
                  value={searchSupplierTerm}
                  onChange={(e) => {
                    setSearchSupplierTerm(e.target.value);
                    setIsSupplierDropdownOpen(true);
                  }}
                  placeholder="ابحث عن مورد"
                  onFocus={() => setIsSupplierDropdownOpen(true)}
                />
                {isSupplierDropdownOpen && filteredSuppliers.length > 0 && (
                  <div className="search-dropdown">
                    {filteredSuppliers.map(([uuid, supplier], index) => (
                      <option
                        key={uuid}
                        onClick={() =>
                          handleSupplierSelect(uuid, supplier.username)
                        }
                      >
                        {supplier.username} - {supplier.number}
                      </option>
                    ))}
                  </div>
                )}
              </div>

              {importFormData.items.map((item, index) => (
    <div key={index} className="item-row">
        <div className="form-group">
            <label>المنتج</label>
            <select
                value={item.productUuid}
                onChange={(e) => {
                    const updatedItems = [...importFormData.items];
                    updatedItems[index].productUuid = e.target.value;
                    setImportFormData((prev) => ({
                        ...prev,
                        items: updatedItems,
                    }));
                }}
            >
                <option value="">اختر المنتج</option>
                {products &&
                    [...products.entries()].map(([uuid, product]) => (
                        <option key={uuid} value={uuid}>
                            {product.name}
                        </option>
                    ))}
            </select>
        </div>
        
        <div className="input-fields-container">
            <div className="form-group">
                <label>الوزن (كجم)</label>
                <input
                    type="number"
                    value={item.mass}
                    onChange={(e) => {
                        const updatedItems = [...importFormData.items];
                        updatedItems[index].mass = parseFloat(e.target.value);
                        setImportFormData((prev) => ({
                            ...prev,
                            items: updatedItems,
                        }));
                    }}
                    placeholder="ادخل الوزن"
                />
            </div>

            <div className="form-group">
                <label>عدد الصناديق</label>
                <input
                    type="number"
                    value={item.boxes}
                    onChange={(e) => {
                        const updatedItems = [...importFormData.items];
                        updatedItems[index].boxes = parseFloat(e.target.value);
                        setImportFormData((prev) => ({
                            ...prev,
                            items: updatedItems,
                        }));
                    }}
                    placeholder="ادخل عدد الصناديق"
                />
            </div>

            <div className="form-group">
                <label>السعر</label>
                <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                        const updatedItems = [...importFormData.items];
                        updatedItems[index].price = parseFloat(e.target.value);
                        setImportFormData((prev) => ({
                            ...prev,
                            items: updatedItems,
                        }));
                    }}
                    placeholder="ادخل السعر"
                />
            </div>
        </div>
    </div>
))}
              <div className="modal-actions">
                <button type="button" onClick={addImportItem}>
                  إضافة منتج آخر
                </button>
                <button type="submit">توريد المنتجات</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsExportModalOpen(false)}>
              ×
            </span>
            <h2>بيع منتجات</h2>
            <form onSubmit={handleExport}>
              <div className="form-group">
                <label>العميل</label>
                <input
                  type="text"
                  value={searchClientTerm}
                  onChange={(e) => {
                    setSearchClientTerm(e.target.value);
                    setIsClientDropdownOpen(true);
                  }}
                  placeholder="ابحث عن عميل"
                  onFocus={() => setIsClientDropdownOpen(true)}
                />
                {isClientDropdownOpen && filteredClients.length > 0 && (
                  <div className="search-dropdown">
                    {filteredClients.map(([uuid, client], index) => (
                      <option
                        key={uuid}
                        onClick={() =>
                          handleClientSelect(uuid, client.username)
                        }
                      >
                        {client.username} - {client.number}
                      </option>
                    ))}
                  </div>
                )}
              </div>

              {exportFormData.items.map((item, index) => (
    <div key={index} className="item-row">
        <div className="form-group">
            <label>المنتج</label>
            <select
                value={item.itemUuid}
                onChange={(e) => {
                    const updatedItems = [...exportFormData.items];
                    updatedItems[index].itemUuid = e.target.value;
                    setExportFormData((prev) => ({
                        ...prev,
                        items: updatedItems,
                    }));
                }}
            >
                <option value="">اختر المنتج</option>
                {products &&
                    [...products.entries()].flatMap(([productUuid, product]) =>
                        product.items
                            ? [...product.items.entries()].map(([itemUuid, itemDetails]) => {
                                const createdDate = itemDetails.createdAt
                                    ? new Date(itemDetails.createdAt.seconds * 1000).toLocaleDateString("ar-EG")
                                    : "";
                                return (
                                    <option key={itemUuid} value={itemUuid}>
                                        {`${product.name} - ${itemDetails.mass} كجم - ${itemDetails.boxes} صندوق - ${createdDate}`}
                                    </option>
                                );
                            })
                            : []
                    )}
            </select>
        </div>
        
        <div className="input-fields-container">
            <div className="form-group">
                <label>الوزن (كجم)</label>
                <input
                    type="number"
                    value={item.mass}
                    onChange={(e) => {
                        const updatedItems = [...exportFormData.items];
                        updatedItems[index].mass = parseFloat(e.target.value);
                        setExportFormData((prev) => ({
                            ...prev,
                            items: updatedItems,
                        }));
                    }}
                    placeholder="ادخل الوزن"
                />
            </div>

            <div className="form-group">
                <label>عدد الصناديق</label>
                <input
                    type="number"
                    value={item.boxes}
                    onChange={(e) => {
                        const updatedItems = [...exportFormData.items];
                        updatedItems[index].boxes = parseFloat(e.target.value);
                        setExportFormData((prev) => ({
                            ...prev,
                            items: updatedItems,
                        }));
                    }}
                    placeholder="ادخل عدد الصناديق"
                />
            </div>

            <div className="form-group">
                <label>السعر</label>
                <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                        const updatedItems = [...exportFormData.items];
                        updatedItems[index].price = parseFloat(e.target.value);
                        setExportFormData((prev) => ({
                            ...prev,
                            items: updatedItems,
                        }));
                    }}
                    placeholder="ادخل السعر"
                />
            </div>
        </div>
    </div>
))}
              <div className="modal-actions">
                <button type="button" onClick={addExportItem}>
                  إضافة منتج آخر
                </button>
                <button type="submit">بيع المنتجات</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
