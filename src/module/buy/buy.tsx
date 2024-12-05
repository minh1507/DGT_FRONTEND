import { DataTable } from "primereact/datatable";
import { useTitle } from "../../hook/title/title";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import "./buy.scss"
import useToast from "../../hook/toast/toast";
import { BuyService } from "../../service/buy";

function Buy() {
  const [buys, setBuys] = useState<any[]>([]);

  useEffect(() => {
    findAll()
  }, []);

  const findAll = async () => {
    const buys = await BuyService.findAll()
    setBuys(buys)
  }

  const [selectedProducts, setSelectedProducts] = useState([]);

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi-briefcase"
          rounded
          outlined
          severity="danger"
          className="shadow-none"
          onClick={async() => {
            await BuyService.update(rowData.id)
            await findAll();
          }}
        />
      </React.Fragment>
    );
  };

  const purchaseStatusTemplate = (rowData: any) => {
    const statusStyle = rowData.isPurchase
      ? { color: "green", fontWeight: "bold" } // Green for Đã thanh toán
      : { color: "red", fontWeight: "bold" }; // Red for Chưa thanh toán
  
    return (
      <span style={statusStyle}>
        {rowData.isPurchase ? "Đã thanh toán" : "Chưa thanh toán"}
      </span>
    );
  };
  
  useTitle("buy");
  
  const { showToast } = useToast();

  const calculateTotalPaidAmount = () => {
    return buys
      .filter((buy) => buy.isPurchase) 
      .reduce((total, buy) => total + (buy.product.newPrice || 0) * (buy.quantity || 0), 0); 
  };
  

  return (
    <section>
      <Divider />
      <div style={{ marginBottom: "1rem", fontWeight: "bold", fontSize: "1.2rem" }}>
        Tổng thu:&nbsp;
        <span style={{ color: "green" }}>
          {calculateTotalPaidAmount().toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </span>
      </div>
      <DataTable
        value={buys}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode={null}
        selection={selectedProducts}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
      >
        <Column field="name" header="Tên"></Column>
        <Column field="address" header="Địa chỉ"></Column>
        <Column field="phone" header="Liên hệ"></Column>
        <Column field="product.title" header="Sản phẩm"></Column>
        <Column field="quantity" header="Số lượng"></Column>
        <Column field="type" header="Loại"></Column>
        <Column
          body={purchaseStatusTemplate} // Add this column
          header="Trạng thái"
        ></Column>
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "12rem" }}
          header="Action"
        ></Column>
      </DataTable>
    </section>
  );
}

export default Buy;